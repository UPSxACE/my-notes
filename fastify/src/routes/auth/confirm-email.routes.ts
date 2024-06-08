import { eq } from "drizzle-orm";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import { users } from "../../database/users";

export type ConfirmEmailRoute = {
  Body: {
    uuid: string;
    code: number;
  };
  Reply: {
    "2xx": null;
    "3xx": null;
    "4xx": Error;
    "5xx": Error;
  };
};

const schema = {
  body: S.object()
    .prop("uuid", S.string())
    .required()
    .prop("code", S.number())
    .required(),
  response: {
    "2xx": {
      type: "null",
    },
    "3xx": {
      type: "null",
    },
    "4xx": S.object().prop("message", S.string()),
    "5xx": S.object().prop("message", S.string()),
  },
};

const buildConfirmEmail = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<ConfirmEmailRoute>({
    method: "POST",
    url: "/auth/confirm-email",
    schema,
    handler: async function (request, reply) {
      const { uuid, code } = request.body;

      try {
        const result = await request.db.query.confirmationMails.findFirst({
          columns: {
            uuid: true,
            code: true,
          },
          where(fields, { eq, and }) {
            return and(eq(fields.uuid, uuid), eq(fields.code, code));
          },
          with: {
            user: {
              columns: {
                id: true,
                verified: true,
              },
            },
          },
        });

        if (!result) {
          reply.code(400).send();
          return;
        }

        if (!result.user.verified) {
          await request.db
            .update(users)
            .set({
              verified: true,
            })
            .where(eq(users.id, result.user.id));
        }

        return reply.code(200).send();
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildConfirmEmail;
