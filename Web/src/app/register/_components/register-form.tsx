"use client";

import register from "@/actions/register";
import { ErrorAlert } from "@/components/alerts/error-alert";
import LightButton from "@/components/theme/light-button";
import LightInput from "@/components/theme/light-input";
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
import formSchema from "./form-schema";
// import { useBookQuery } from "@/gql/graphql.schema";

export default function RegisterForm() {
  // const { loading, error, data } = useBookQuery();
  const [signingUp, setSigningUp] = useState(false);
  const [errorAlert, setErrorAlert] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      password: "",
      username: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorAlert("");
    setSigningUp(true);
    register(values).then((result) => {
      if (!result.ok) {
        setSigningUp(false);
        const path = result?.error?.path;
        const message = result?.error?.message;
        if (path && message) {
          form.setError(path as any, {
            message,
          });
          return;
        }

        if (message) {
          setErrorAlert(message);
        }
        // unexpected error
        return;
      }
      // FIXME ok
      console.log("OK");
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
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput placeholder="Username" required {...field} />
                </FormControl>
                <FormMessage className="!mt-1" />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput placeholder="Full Name" required {...field} />
                </FormControl>
                <FormMessage className="!mt-1" />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput placeholder="Email" required {...field} />
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
                    type="password"
                    placeholder="Password"
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
          name="repeatPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput
                    type="password"
                    placeholder="Repeat Password"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage className="!mt-1" />
              </FormItem>
            );
          }}
        />
        <p className="text-center px-2 text-sm text-zinc-600 mt-3 mb-3">
          By clicking Join now, you agree to MyNote&apos;s privacy policy and
          terms and conditions.
        </p>
        <LightButton
          loading={signingUp}
          loadingComponent={
            <span className="flex">
              <LoadingSpinner className="w-5 h-5 mr-2" />
              Attempting to sign up...
            </span>
          }
          className="transition-all duration-150"
        >
          JOIN NOW
        </LightButton>
        <Link
          href="/login"
          className="text-sm text-center text-zinc-800 hover:underline"
        >
          Already have an account? Login
        </Link>
      </form>
    </Form>
  );
}
