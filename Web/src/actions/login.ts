"use server";

import { signIn } from "@/auth";
import axios from "axios";

export default async function login(identifier: string, password: string) {
  let ok = true;
  let error: string = "";

  try {
    const data = await axios
      .post(
        "/login",
        { identifier, password },
        {
          baseURL: process.env.INTERNAL_API_URL,
        }
      )
      .then((res) => {
        return res.data;
      });

    if (!data.access_token || typeof data.access_token !== "string") {
      throw new Error();
    }

    await signIn("credentials", {
      token: data.access_token,
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
