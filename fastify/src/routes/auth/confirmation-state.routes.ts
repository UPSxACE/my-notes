import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";

export type ConfirmationStateRoute = {
  Querystring: {
    uuid: string;
  };
  Reply: {
    "2xx": { state: "VERIFIED" | "UNVERIFIED" };
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

const buildConfirmationState = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<ConfirmationStateRoute>({
    method: "GET",
    url: "/auth/confirmation-state",
    schema,
    handler: async function (request, reply) {
      const { uuid } = request.query;

      try {
        const result = await request.db.query.confirmationMails.findFirst({
          columns: {
            uuid: true,
          },
          where(fields, { eq }) {
            return eq(fields.uuid, uuid);
          },
          with: {
            user: true,
          },
        });

        if (!result) {
          reply.code(404).send();
          return;
        }

        return reply
          .code(200)
          .send({ state: result.user.verified ? "VERIFIED" : "UNVERIFIED" });
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildConfirmationState;
