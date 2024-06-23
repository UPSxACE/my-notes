"use client";

import login from "@/actions/login";
import { ErrorAlert } from "@/components/alerts/error-alert";
import LightInput from "@/components/theme/input";
import LightButton from "@/components/theme/light-button";
import LoadingSpinner from "@/components/theme/loading-spinner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

export default function LoginForm() {
  const [signingIn, setSigningIn] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorAlert("");
    setSigningIn(true);
    login(values.identifier, values.password).then((result) => {
      if (!result.ok) {
        setErrorAlert(result.error);
        setSigningIn(false);
        return;
      }

      // reload page on success
      window.location.href = "/";
    });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {errorAlert && <ErrorAlert title={"Error"} description={errorAlert} />}
        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput
                    placeholder="Username or email"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage className="!mt-1" />
              </FormItem>
            );
          }}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput
                    placeholder="Password"
                    required
                    type="password"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="!mt-1" />
              </FormItem>
            );
          }}
        />
        <Link
          href="/forgot-password"
          className="text-sm text-right hover:underline text-zinc-600"
        >
          Forgot your password?
        </Link>
        <LightButton
          disabled={signingIn}
          className="transition-all duration-150"
        >
          {signingIn ? (
            <>
              <LoadingSpinner className="w-5 h-5 mr-2" />
              Attempting to sign in...
            </>
          ) : (
            <>SIGN IN</>
          )}
        </LightButton>
        <Link
          href="/register"
          className="text-sm text-center text-zinc-800 hover:underline"
        >
          Don&apos;t have an account yet? Register
        </Link>
      </form>
    </Form>
  );
}
