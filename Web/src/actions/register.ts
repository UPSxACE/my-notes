"use server";

import axios from "axios";

type RegisterForm = {
  username: string;
  fullName: string;
  email: string;
  password: string;
};

type RegisterError = {
  message: string;
  path?: string;
} | null;

type RegisterResolve = {
  ok: boolean;
  error: RegisterError;
};

export default async function register(
  registerForm: RegisterForm
): Promise<RegisterResolve> {
  let ok = true;
  let error: RegisterError = null;

  await axios
    .post("/register", registerForm, {
      baseURL: process.env.INTERNAL_API_URL,
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      ok = false;
      const regError: RegisterError = {
        message: "",
      };
      regError.message = err?.response?.data?.message || {
        message: "Try again later",
      };
      regError.path = err?.response?.data?.path?.[0];
      error = regError;
    });

  return { ok, error };
}
