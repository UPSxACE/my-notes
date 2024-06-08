import { FastifyInstance, FastifyPluginOptions } from "fastify";
import buildConfirmEmail from "./auth/confirm-email.routes";
import buildConfirmationState from "./auth/confirmation-state.routes";
import buildForgotPassword from "./auth/forgot-password.routes";
import buildLogin from "./auth/login.routes";
import buildRecoveryState from "./auth/recovery-state.routes";
import buildRegister from "./auth/register.routes";
import buildResendConfirmation from "./auth/resend-confirmation.routes";
import buildResetPassword from "./auth/reset-password.routes";
import buildIndex from "./index.routes";

export default async function routes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  //index
  buildIndex(fastify, options);
  // auth
  buildRegister(fastify, options);
  buildConfirmationState(fastify, options);
  buildConfirmEmail(fastify, options);
  buildResendConfirmation(fastify, options);
  buildForgotPassword(fastify, options);
  buildResetPassword(fastify, options);
  buildRecoveryState(fastify, options);
  buildLogin(fastify, options);
}
