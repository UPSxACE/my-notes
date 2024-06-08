import dayjs from "dayjs";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import getDatabaseTime from "../../utils/get-database-time";

export type ResendConfirmationRoute = {
  Body: {
    uuid: string;
  };
  Reply: {
    "2xx": null;
    "3xx": null;
    "4xx": Error;
    "5xx": Error;
  };
};

const schema = {
  body: S.object().prop("uuid", S.string()).required(),
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

const buildResendConfirmation = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<ResendConfirmationRoute>({
    method: "POST",
    url: "/auth/resend-confirmation",
    schema,
    handler: async function (request, reply) {
      const { uuid } = request.body;

      try {
        const result = await request.db.query.confirmationMails.findFirst({
          columns: {
            uuid: true,
          },
          where(fields, { eq, and }) {
            return eq(fields.uuid, uuid);
          },
          with: {
            mail: {
              columns: {
                lastAttempt: true,
              },
            },
            user: {
              columns: {
                id: true,
                verified: true,
              },
            },
          },
        });

        // 200 in case user wasn't found or it was resent in the last 10 minutes already

        if (!result) {
          reply.code(200).send();
          return;
        }

        const now = await getDatabaseTime(request.db);
        const lastAttempt = dayjs(result.mail.lastAttempt);

        if (lastAttempt.isValid()) {
          const canResend = now.isAfter(lastAttempt.add(10, "minutes"));
          if (!canResend) {
            // resent in the last 10 minutes already
            reply.code(200).send();
            return;
          }
        }

        // if the user was already verified return 400
        if (result.user.verified) {
          reply.code(400).send();
          return;
        }

        // in other cases resend email
        await request.mailer.resendConfirmationEmail(result.uuid);
        return reply.code(200).send();
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildResendConfirmation;
