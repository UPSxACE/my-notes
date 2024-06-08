import { FastifyInstance, FastifyPluginOptions } from "fastify";
import S from "fluent-json-schema";
import { PgOnConnect } from "../types/pg-on-connect";

type Generic = {
  Querystring: {
    id: number;
  };
  Reply: {
    "2xx": { hello: string };
    "3xx": {};
    "4xx": { error: Error };
    "5xx": { error: Error };
  };
};

const schema = {
  querystring: {
    id: { type: "integer" },
  },
  response: {
    "2xx": S.object().prop("hello", S.string()),
    "3xx": S.object(),
    "4xx": S.object().prop("error", S.object().prop("message", S.string())),
    "5xx": S.object().prop("error", S.object().prop("message", S.string())),
  },
};

const buildIndex = (
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) => {
  return fastify.route<Generic>({
    method: "GET",
    url: "/",
    schema,
    handler: function (request, reply) {
      const onConnect: PgOnConnect = (err, client, release) => {
        if (err) return reply.code(500).send({ error: err });

        const { id } = request.query;

        client?.query(
          'SELECT "id", "username" FROM public.user WHERE id=$1',
          [id],
          function onResult(err, result) {
            release();

            if (err) {
              console.log(err);
              return reply.code(500).send({ error: err });
            }
            return reply.code(200).send({ hello: JSON.stringify(result.rows) });
          }
        );
      };

      fastify.pg.connect(onConnect);
    },
  });
};

export default buildIndex;
