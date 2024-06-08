"use server";

import { signIn } from "@/auth";
import axios from "axios";
// import { ConfirmationStateRoute } from "@/fastify/src/routes/auth/login-routes";

export default async function login(identifier: string, password: string) {
  let ok = true;
  let error: string = "";

  try {
    const data = await axios
      .post(
        "/auth/login",
        { identifier, password },
        {
          baseURL: process.env.INTERNAL_API_URL,
        }
      )
      .then((res) => {
        return res.data;
      });

    if (!data.token || typeof data.token !== "string") {
      throw new Error();
    }

    await signIn("credentials", {
      token: data.token,
      redirect: false,
    });
  } catch (err: any) {
    ok = false;
    console.log(err);
    switch (err?.response?.status) {
      case 404:
        error = "The user does not exist.";
        break;
      case 400:
        error = "Invalid username or password.";
        break;
      default:
        error = "Try again later.";
    }
  }

  return { ok, error };
}
