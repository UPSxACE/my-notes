"use client";

import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Countdown from "./countdown";

type Props = {
  uid: string;
};

export default function ResendText(props: Props) {
  const router = useRouter();
  const [counting, setCounting] = useState(false);

  function resend() {
    setCounting(true);
    const tenMinutes = 1000 * 60 * 10.5;
    setTimeout(() => setCounting(false), tenMinutes);

    axios
      .post(
        "/resend-confirmation",
        {
          uid: props.uid,
        },
        {
          baseURL: process.env.INTERNAL_API_URL,
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
