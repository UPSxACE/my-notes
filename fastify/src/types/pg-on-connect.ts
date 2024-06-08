import { FastifyInstance } from "fastify";

export type PgOnConnect = Parameters<FastifyInstance["pg"]["connect"]>[0];
// export type PgOnConnectArgs = Parameters<
//   Parameters<FastifyInstance["pg"]["connect"]>[0]
// >;
