"use client";

import LightInput from "@/components/theme/input";
import LightButton from "@/components/theme/light-button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  login: z.string(),
  password: z.string(),
});

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="login"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput placeholder="Username or email" {...field} />
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
                  <LightInput placeholder="Password" {...field} />
                </FormControl>
                <FormMessage className="!mt-1" />
              </FormItem>
            );
          }}
        />
        <Link
          href="/register"
          className="text-sm text-right hover:underline text-zinc-600"
        >
          Forgot your password?
        </Link>
        <LightButton>SIGN IN</LightButton>
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
