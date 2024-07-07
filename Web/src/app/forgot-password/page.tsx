"use client";
import { ErrorAlert } from "@/components/alerts/error-alert";
import LightInput from "@/components/theme/light-input";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export default function ForgotPassword() {
  const [errorAlert, setErrorAlert] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorAlert("");
    setIsSubmiting(true);
    axios
      .post(
        "/forgot-password",
        {
          email: values.email,
        },
        {
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        }
      )
      .then(() => {
        // FIXME notification
        router.push("/forgot-password/sent?email=" + values.email);
      })
      .catch((err: AxiosError) => {
        setErrorAlert("Please try again later.");
        setIsSubmiting(false);
        return;
      });
  }

  return (
    <main className="font-sans flex min-h-screen relative flex-col">
      <div className="bg-theme-6 flex-1 basis-1/2"></div>
      <div className="bg-theme-1 flex-1 basis-1/2"></div>
      <div className="px-8 py-4 absolute top-0 left-0 flex w-full h-full justify-center items-center">
        <div className="w-full flex flex-col items-center">
          <header className="w-full text-center mb-4">
            <Link
              href="/"
              className="text-4xl font-semibold text-white text-center"
            >
              MyNotes
            </Link>
          </header>
          <div className="bg-white px-6 pb-10 pt-8 rounded-xl  max-w-[500px] flex flex-col items-center shadow">
            <h1 className="text-2xl font-bold w-full px-4 mb-1">
              Forgot your password?
            </h1>
            <p className="text-left leading-snug px-4 mb-6 text-zinc-800 w-full">
              Please enter the email you use to sign in to MyNotes.
            </p>
            <Form {...form}>
              <form
                className="flex flex-col gap-6 w-full px-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                {errorAlert && (
                  <ErrorAlert title={"Error"} description={errorAlert} />
                )}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormControl>
                          <LightInput placeholder="Email" required {...field} />
                        </FormControl>
                        <FormMessage className="!mt-1" />
                      </FormItem>
                    );
                  }}
                />
                <div className="w-full">
                  <LightButton
                    loading={isSubmiting}
                    loadingComponent={
                      <span className="flex">
                        <LoadingSpinner className="w-5 h-5 mr-2" />
                        Attempting to resend...
                      </span>
                    }
                    className="w-full transition-all duration-150 mb-3"
                  >
                    <>CONTINUE</>
                  </LightButton>
                  <Link
                    href="/login"
                    className="text-blue-500 text-center w-full block"
                  >
                    Back to login
                  </Link>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
}
