import cookie from "cookie";
import dayjs from "dayjs";
import { FastifyReply, FastifyRequest } from "fastify";

type PromiseType<T> = T extends PromiseLike<infer U> ? U : T;

declare module "mercurius" {
  interface MercuriusContext
    extends PromiseType<ReturnType<typeof buildContext>> {}
}

const buildContext = async (req: FastifyRequest, reply: FastifyReply) => {
  const cookies = cookie.parse(req.headers.cookie || "");

  const cookieName = process.env.JWT_COOKIE_NAME || "authorization";

  const authCookie = cookies[cookieName];
  const authHeader = req.headers.authorization
    ? req.headers.authorization.replace("Bearer ", "")
    : "";

  const token = authCookie || authHeader;
  const authorization = req.jwt.verify(token);

  if (authorization && authorization.exp) {
    const expMoment = dayjs(authorization.exp);
    const expMoment12hBefore = expMoment.subtract(12, "hours");
    const last12h = dayjs().isAfter(expMoment12hBefore);
    if (last12h) {
      // refresh token if it will expire in the next 12h
      const newToken = req.jwt.signToken(
        authorization.id,
        authorization.permissions,
        authorization.isDemo
      );

      reply.header(
        "set-cookie",
        cookie.serialize(process.env.JWT_COOKIE_NAME || "authToken", newToken, {
          httpOnly: true,
          sameSite: "lax",
          domain: process.env.JWT_COOKIE_DOMAIN,
          path: "/",
          expires: dayjs().add(2, "days").toDate(),
          // FIXME secure:true
        })
      );
    }
  }

  return {
    authorization: authorization,
    db: req.db,
  };
};

export default buildContext;
