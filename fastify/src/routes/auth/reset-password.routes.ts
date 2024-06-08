import dayjs from "dayjs";
import { eq, isNull, sql } from "drizzle-orm";
import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import { ZodIssue, z } from "zod";
import { recoveryMails } from "../../database/recovery-mails";
import { users } from "../../database/users";
import getDatabaseTime from "../../utils/get-database-time";
import { REGEX_PASSWORD } from "../../utils/regexes";

export type ResetPasswordRoute = {
  Body: {
    uuid: string;
    newPassword: string;
  };
  Reply: {
    "2xx": null;
    "3xx": null;
    "4xx": Error | ZodIssue;
    "5xx": Error | ZodIssue;
  };
};

export const ResetPasswordRouteZod = z.object({
  newPassword: z
    .string()
    .regex(REGEX_PASSWORD, "Your password contains illegal characters")
    .min(8, "Your password is too small")
    .max(64, "Your password is too big")
    .refine(
      (data) => data.toLowerCase() !== data && data.toUpperCase() !== data,
      {
        message:
          "Your password needs at least 1 lower case and 1 upper case character",
      }
    )
    .refine(
      (data) => {
        const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        return data.split("").some((letter) => numbers.includes(letter));
      },
      {
        message: "Your password needs at least 1 number",
      }
    ),
});

const schema = {
  body: S.object()
    .prop("uuid", S.string())
    .required()
    .prop("newPassword", S.string())
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

const buildResetPassword = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<ResetPasswordRoute>({
    method: "POST",
    url: "/auth/reset-password",
    schema,
    handler: async function (request, reply) {
      const { uuid, newPassword } = request.body;

      // FIXME validate type of password, return 400

      try {
        const result = await request.db.query.recoveryMails.findFirst({
          columns: {
            uuid: true,
            createdAt: true,
          },
          where(fields, { eq, and }) {
            return and(eq(fields.uuid, uuid), isNull(fields.usedAt));
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
          // if there is no unused recovery mail found, return 404 (not found, expired or invalid)
          reply.code(404).send();
          return;
        }

        const now = await getDatabaseTime(request.db);
        const expireDate = dayjs(result.createdAt).add(24, "hours");
        if (now.isAfter(expireDate)) {
          // if the code is already expired, return 404 (not found, expired or invalid)
          reply.code(404).send();
          return;
        }

        // encrypt new password
        const encryptedPassword = await request.pws.hashPassword(newPassword);

        await request.db
          .update(users)
          .set({
            password: encryptedPassword,
          })
          .where(eq(users.id, result.user.id));

        await request.db.update(recoveryMails).set({
          usedAt: sql`NOW()`,
        });

        return reply.code(200).send();
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildResetPassword;
