import dayjs from "dayjs";
import { desc } from "drizzle-orm";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import { z } from "zod";
import { recoveryMails } from "../../database/recovery-mails";
import getDatabaseTime from "../../utils/get-database-time";

export type ForgotPasswordRoute = {
  Body: {
    email: string;
  };
  Reply: {
    "2xx": null;
    "3xx": null;
    "4xx": Error;
    "5xx": Error;
  };
};

const schema = {
  body: S.object().prop("email", S.string()).required(),
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

const buildForgotPassword = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<ForgotPasswordRoute>({
    method: "POST",
    url: "/auth/forgot-password",
    schema,
    handler: async function (request, reply) {
      const { email } = request.body;

      const emailValidation = z.string().email().safeParse(email);

      if (!emailValidation.success) {
        // not a valid email format, not worth checking database
        return reply.code(200).send();
      }

      try {
        const user = await request.db.query.users.findFirst({
          columns: {
            email: true,
            username: true,
            id: true,
          },
          where(fields, { eq, and }) {
            return eq(fields.email, email);
          },
        });

        if (!user) {
          // if user doesn't exist, return 200
          return reply.code(200).send();
        }

        const recoveryMail = await request.db.query.recoveryMails.findFirst({
          columns: {
            usedAt: true,
            createdAt: true,
            uuid: true,
          },
          where(fields, { eq, and }) {
            return eq(fields.userId, user.id);
          },
          orderBy: [desc(recoveryMails.createdAt)],
          with: {
            mail: true,
          },
        });

        // 1 recovery email per 24h, unless it was already used

        if (!recoveryMail) {
          // doesn't exist = create new one and send
          await request.mailer.sendRecoveryEmail(
            user.id,
            user.username,
            user.email
          );
          return reply.code(200).send();
        }

        const now = await getDatabaseTime(request.db);
        const expired = now.isAfter(
          dayjs(recoveryMail.createdAt).add(24, "hours")
        );
        if (recoveryMail.usedAt !== null || expired) {
          // if expired or used = create new one and send
          await request.mailer.sendRecoveryEmail(
            user.id,
            user.username,
            user.email
          );
          return reply.code(200).send();
        }

        const lastAttempt = dayjs(recoveryMail.mail.lastAttempt);
        if (!lastAttempt.isValid()) {
          // if last attempt never happened, try resending now again
          await request.mailer.resendRecoveryEmail(recoveryMail.uuid);
          return reply.code(200).send();
        }

        const canResend = lastAttempt.isBefore(now.subtract(30, "minutes"));
        if (!canResend) {
          // its not been 30 minutes since it was sent/resent
          return reply.code(200).send();
        }

        // it's been 30 minutes since last time, so resend
        await request.mailer.resendRecoveryEmail(recoveryMail.uuid);
        return reply.code(200).send();
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildForgotPassword;
