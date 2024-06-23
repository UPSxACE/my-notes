"use client";
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
import axios, { AxiosError } from "axios";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import formSchema from "./form-schema";

type Props = {
  uid: string;
};

export default function ResetPasswordForm(props: Props) {
  const [errorAlert, setErrorAlert] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      newPassword: "",
      repeatPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorAlert("");
    setIsSubmiting(true);
    axios
      .post(
        "/reset-password",
        {
          uid: props.uid,
          newPassword: values.newPassword,
        },
        {
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        }
      )
      .then(() => {
        // FIXME notification
        router.push("/login");
      })
      .catch((err: AxiosError) => {
        if (err?.response?.status === 404) {
          redirect("/");
        }

        setErrorAlert("Please try again later.");
        setIsSubmiting(false);
        return;
      });
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-6 w-full px-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {errorAlert && <ErrorAlert title={"Error"} description={errorAlert} />}
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
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
        <FormField
          control={form.control}
          name="repeatPassword"
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormControl>
                  <LightInput
                    placeholder="Repeat Password"
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
        <div className="w-full">
          <LightButton
            disabled={isSubmiting}
            className="w-full transition-all duration-150 mb-3"
          >
            {isSubmiting ? (
              <>
                <LoadingSpinner className="w-5 h-5 mr-2" />
                Attempting to resend...
              </>
            ) : (
              <>CONTINUE</>
            )}
          </LightButton>
        </div>
      </form>
    </Form>
  );
}
