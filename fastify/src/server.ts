import cors from "@fastify/cors";
import postgresFastify from "@fastify/postgres";
import dotenv from "dotenv";
import Fastify from "fastify";
import mercurius from "mercurius";
import mercuriusCodegen, { gql } from "mercurius-codegen";
import { Db, initDrizzle } from "./drizzle";
import mercuriusConfig from "./graphql";
import Jwt from "./jwt";
import Mail from "./mail";
import routes from "./routes";
import Passwords from "./passwords";

dotenv.config();

declare module "fastify" {
  interface FastifyRequest {
    db: Db;
    jwt: Jwt;
    mailer: Mail;
    pws: Passwords;
  }
}

const fastify = Fastify({
  logger: true,
});

// db
const db = initDrizzle();

// cors
if (!process.env.FRONTEND_URI) {
  throw new Error("Missing FRONTEND_URI environment variable");
}
fastify.register(cors, {
  origin: [process.env.FRONTEND_URI],
  credentials: true,
});

// codegen
mercuriusCodegen(fastify, {
  // Commonly relative to your root package.json
  targetPath: "./src/types/graphql/generated.ts",
}).catch(console.error);

// Decorate request with jwt
fastify.decorateRequest("jwt", null);
fastify.addHook("preHandler", (req, reply, done) => {
  req.jwt = new Jwt();
  done();
});

// Decorate request with db
fastify.decorateRequest("db", null);
fastify.addHook("preHandler", (req, reply, done) => {
  req.db = db;
  done();
});

// Decorate request with mail
fastify.decorateRequest("mail", null);
fastify.addHook("preHandler", (req, reply, done) => {
  req.mailer = new Mail(db);
  done();
});

// Decorate request with the password module
fastify.decorateRequest("pws", null);
fastify.addHook("preHandler", (req, reply, done) => {
  req.pws = new Passwords();
  done();
});

// Register postgres
fastify.register(postgresFastify, {
  // FIXME do i even use this? i don't directly do graphql queries anymore i think
  connectionString: process.env.DB_CONNECTION_STRING,
});

// Register graphql
fastify.register(mercurius, mercuriusConfig);

// Register routes
fastify.register(routes);

fastify.get("/gql-example", async function (req, reply) {
  const query = gql`
    query {
      hello(name: "Ace")
    }
  `;
  return reply.graphql(query);
});

fastify.listen({ port: 8080, host: "0.0.0.0" }, function (err, address) {
  // Run the server!
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
  fastify.log.info(`server listening on ${address}`);
});
