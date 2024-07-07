import { SignJWT, jwtVerify } from "jose";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import "server-only";

export const { handlers, signIn, signOut, auth } = NextAuth({
  cookies: {
    sessionToken: {
      // name: "next-auth.session-token"
      options: {
        domain: process.env.JWT_COOKIE_DOMAIN,
      },
    },
  },
  callbacks: {
    // TODO: Study about this
    async session({ session, token }) {
      // NOTE: when it reaches here, the token is ALWAYS decoded already
      // and session.user has only the default fields, therefore it needs to be replaced by the token (which is decoded)

      if (token) {
        session.user = { ...token, ...session.user };
      }

      return session;
    },
    async jwt({ token, user }) {
      // NOTE about token:
      // When trigger is "signIn" or "signUp", it will be a subset of JWT, name, email and image will be included.
      // Otherwise, it will be the full JWT for subsequent calls.

      // NOTE about user:
      // Either the result of the OAuthConfig.profile or the CredentialsConfig.authorize callback.

      if (user) {
        // NOTE: if code reaches here it means its resulting from an 'authorize' callback, and triggered by a "signIn" or "signUp"
        // and in this case you need to add the values in user to the token payload, because it has only the original fields
        // when it is triggered by a signIn or signUp!
        // NOTE: in the reamaining cases, this will be called after 'decode', so the token will have the extra fields already
        // as long as it was properly encoded!
        token = { ...token, ...user };
      }

      return token;
    },
  },
  jwt: {
    encode: async ({ token, secret }) => {
      if (token && secret) {
        if (typeof secret !== "string")
          throw new Error("Only strings supported for jwt secret");
        return await new SignJWT(token)
          .setProtectedHeader({ alg: "HS256", typ: "JWT" })
          .sign(new TextEncoder().encode(secret));
      }
      return "";
    },
    decode: async ({ token, secret }) => {
      if (!token) {
        return null;
      }

      try {
        if (typeof secret !== "string")
          throw new Error("Only strings supported for jwt secret");

        const { payload } = await jwtVerify(
          token,
          new TextEncoder().encode(secret)
        );

        return payload;
      } catch (err) {
        return null;
      }
    },
  },
  providers: [
    Credentials({
      credentials: {
        token: {},
      },
      authorize: async (credentials) => {
        try {
          if (typeof credentials.token !== "string") {
            throw new Error();
          }

          const { payload } = await jwtVerify(
            credentials.token,
            new TextEncoder().encode(process.env.JWT_SECRET)
          );

          return payload as Record<string, any>;
        } catch (err: any) {
          return null;
        }
      },
    }),
  ],
});
