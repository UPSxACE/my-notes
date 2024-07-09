import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import "server-only";

export default function getToken(cookieStore: ReadonlyRequestCookies) {
  const token = cookieStore.get(
    process.env.NODE_ENV === "production"
      ? "__Secure-authjs.session-token"
      : "authjs.session-token"
  );

  return token?.value;
}
