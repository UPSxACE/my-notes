import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import { ZodIssue, ZodType, z } from "zod";
import { users } from "../../database/users";
import { REGEX_PASSWORD, REGEX_USERNAME } from "../../utils/regexes";

export type RegisterRoute = {
  Body: {
    username: string;
    email: string;
    password: string;
    fullName: string;
  };
  Reply: {
    "2xx": null;
    "3xx": null;
    "4xx": Error | ZodIssue;
    "5xx": Error | ZodIssue;
  };
};

export const RegisterRouteZod = z.object({
  username: z
    .string()
    .regex(
      REGEX_USERNAME,
      "Usernames can only include letters, numbers, periods, hyphens, and underscores, with the exception that periods, hyphens, and underscores cannot be placed at the start or end."
    )
    .min(3, "Please pick a bigger username")
    .max(24, "Your username is too big"),
  email: z
    .string()
    .min(1, "This field is required")
    .email("Invalid email format"),
  password: z
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
  fullName: z.string().min(1, "This field is required"),
}) satisfies ZodType<RegisterRoute["Body"]>;

const schema = {
  body: S.object()
    .prop("username", S.string())
    .required()
    .prop("email", S.string())
    .required()
    .prop("password", S.string())
    .required()
    .prop("fullName", S.string())
    .required(),
  response: {
    "2xx": {
      type: "null",
    },
    "3xx": {
      type: "null",
    },
    "4xx": S.object().prop("message", S.string()).prop("path", S.array()),
    "5xx": S.object().prop("message", S.string()).prop("path", S.array()),
  },
};

const buildRegister = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<RegisterRoute>({
    method: "POST",
    url: "/auth/register",
    schema,
    handler: async function (request, reply) {
      try {
        const { success, error, data } = RegisterRouteZod.safeParse(
          request.body
        );
        if (!success) {
          reply.code(400).send(error.issues[0]);
          return;
        }

        // Check for existing users with same email or username
        const user = await request.db.query.users.findFirst({
          columns: {
            username: true,
            email: true,
          },
          where({ username, email }, { or, eq }) {
            return or(eq(username, data.username), eq(email, data.email));
          },
        });

        // Return error if username or email is already taken
        if (user) {
          const { username, email } = user;

          // Username taken
          if (username === data.username) {
            reply.code(409).send({
              code: "custom",
              path: ["username"],
              message: "Username is already taken",
            });
            return;
          }

          // Email taken
          if (email === data.email) {
            reply.code(409).send({
              code: "custom",
              path: ["email"],
              message: "Email is already taken",
            });
            return;
          }

          // Unexpected error (should never reach this)
          throw new Error("Internal Error");
        }

        // encrypt password
        data.password = await request.pws.hashPassword(data.password);

        // Create new account
        const [newUser] = await request.db
          .insert(users)
          .values(data)
          .returning({
            id: users.id,
            username: users.username,
            email: users.email,
          });

        await request.mailer.sendConfirmationEmail(
          newUser.id,
          newUser.username,
          newUser.email
        );

        reply.code(201).send();
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildRegister;
