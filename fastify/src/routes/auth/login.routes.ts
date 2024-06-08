import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import { ZodIssue, ZodType, z } from "zod";

export type LoginRoute = {
  Body: {
    identifier: string;
    password: string;
  };
  Reply: {
    "2xx": {
      token: string;
    };
    "3xx": null;
    "4xx": Error | ZodIssue;
    "5xx": Error | ZodIssue;
  };
};

export const RegisterRouteZod = z.object({
  identifier: z.string(),
  password: z.string(),
}) satisfies ZodType<LoginRoute["Body"]>;

const schema = {
  body: S.object()
    .prop("identifier", S.string())
    .required()
    .prop("password", S.string())
    .required(),
  response: {
    "2xx": S.object().prop("token", S.string()),
    "3xx": {
      type: "null",
    },
    "4xx": S.object().prop("message", S.string()).prop("path", S.array()),
    "5xx": S.object().prop("message", S.string()).prop("path", S.array()),
  },
};

const buildLogin = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<LoginRoute>({
    method: "POST",
    url: "/auth/login",
    schema,
    handler: async function (request, reply) {
      const { identifier, password } = request.body;
      try {
        // Check for existing users with same email or username
        const user = await request.db.query.users.findFirst({
          columns: {
            id: true,
            password: true,
          },
          where({ username, email }, { or, eq }) {
            return or(eq(username, identifier), eq(email, identifier));
          },
        });

        if (!user) {
          return reply.code(404).send();
        }

        if (!user.password) {
          // wrong type of login
          return reply.code(400).send();
        }

        const correctPassword = await request.pws.verifyPassword(
          user.password,
          password
        );

        if (!correctPassword) {
          return reply.code(400).send();
        }

        const token = request.jwt.signToken(user.id, 0, false);

        return reply.code(200).send({ token });
      } catch (error: any) {
        reply.code(500).send(error);
      }
    },
  });
};

export default buildLogin;
