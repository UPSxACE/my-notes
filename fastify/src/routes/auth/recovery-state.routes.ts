import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import getDatabaseTime from "../../utils/get-database-time";
import dayjs from "dayjs";
import { isNull } from "drizzle-orm";

export type RecoveryStateRoute = {
  Querystring: {
    uuid: string;
  };
  Reply: {
    "2xx": { state: "READY" };
    "3xx": null;
    "4xx": Error;
    "5xx": Error;
  };
};

const schema = {
  querystring: S.object().prop("uuid", S.string()).required(),
  response: {
    "2xx": S.object().prop("state", S.string().required()),
    "3xx": {
      type: "null",
    },
    "4xx": S.object().prop("message", S.string()),
    "5xx": S.object().prop("message", S.string()),
  },
};

const buildRecoveryState = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<RecoveryStateRoute>({
    method: "GET",
    url: "/auth/recovery-state",
    schema,
    handler: async function (request, reply) {
      const { uuid } = request.query;

      try {
        // find the one with the corresponding UUID and NOT USED YET
        const result = await request.db.query.recoveryMails.findFirst({
          columns: {
            uuid: true,
            createdAt: true,
          },
          where(fields, { eq, and }) {
            return and(eq(fields.uuid, uuid), isNull(fields.usedAt));
          },
          with: {
            user: true,
          },
        });

        if (!result) {
          reply.code(404).send();
          return;
        }

        const now = await getDatabaseTime(request.db);
        const expired = now.isAfter(dayjs(result.createdAt).add(24, "hours"));

        if (expired) {
          reply.code(404).send();
          return;
        }

        return reply.code(200).send({ state: "READY" });
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildRecoveryState;
