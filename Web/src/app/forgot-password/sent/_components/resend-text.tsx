"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Countdown from "./countdown";

type Props = {
  email: string;
};

export default function ResendText(props: Props) {
  const router = useRouter();
  const [counting, setCounting] = useState(false);

  function resend() {
    setCounting(true);
    const thirtyMinutes = 1000 * 60 * 30.5;
    setTimeout(() => setCounting(false), thirtyMinutes);

    axios
      .post(
        "/forgot-password",
        {
          email: props.email,
        },
        {
          baseURL: process.env.NEXT_PUBLIC_API_URL,
        }
      )
      .catch((err: AxiosError) => {
        if (err?.response?.status === 400) {
          // FIXME notification
          return router.push("/login");
        }
      });
  }

  if (counting) {
    return <Countdown />;
  }

  return (
    <p className="text-center text-sm text-zinc-600">
      If you do not receive an email within 10 minutes,{" "}
      <button className="text-blue-400 underline" onClick={resend}>
        click here
      </button>{" "}
      to resend.
    </p>
  );
}
