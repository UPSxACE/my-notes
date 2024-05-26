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
  username: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  repeatPassword: z.string(),
});

export default function RegisterForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
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
          name="username"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput placeholder="Username" {...field} />
                </FormControl>
                <FormMessage className="!mt-1" />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput placeholder="Name" {...field} />
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
                  <LightInput placeholder="Email" {...field} />
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
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => {
            return (
              <FormItem>
                <FormControl>
                  <LightInput placeholder="Repeat Password" {...field} />
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
        <LightButton>JOIN NOW</LightButton>
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
