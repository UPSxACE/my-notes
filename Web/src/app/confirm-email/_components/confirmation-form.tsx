"use client";

import LightButton from "@/components/theme/light-button";
import LoadingSpinner from "@/components/theme/loading-spinner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  defaultValue?: string;
  uid: string;
};

export default function ConfirmationForm(props: Props) {
  const defaultValue = isNaN(Number(props.defaultValue))
    ? ""
    : String(props.defaultValue);

  const [value, setValue] = useState(defaultValue);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [error, setError] = useState("");

  const otpClass = "border-solid outline-l-0 w-12 h-12 text-xl";
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        setIsSubmiting(true);
        axios
          .post(
            "/confirm-email",
            {
              uid: props.uid,
              code: value,
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
            if (err?.response?.status !== 400) {
              setError("Please try again later.");
              setIsSubmiting(false);
              return;
            }

            setError("The inserted code is not correct.");
            setIsSubmiting(false);
            setValue("");
            return;
          });
      }}
      className="w-full flex flex-col items-center"
    >
      <InputOTP
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
        maxLength={6}
      >
        <InputOTPGroup className="mb-3">
          <InputOTPSlot className={otpClass} index={0} />
          <InputOTPSlot className={otpClass} index={1} />
          <InputOTPSlot className={otpClass} index={2} />
          <InputOTPSlot className={otpClass} index={3} />
          <InputOTPSlot className={otpClass} index={4} />
          <InputOTPSlot className={otpClass} index={5} />
        </InputOTPGroup>
      </InputOTP>
      {error && <span className="mb-3 text-red-500 text-sm">{error}</span>}
      <LightButton
        disabled={value.length !== 6 || isSubmiting}
        className="w-full max-w-[400px] mb-3 mt-1 transition-all duration-150"
      >
        {isSubmiting ? (
          <>
            <LoadingSpinner className="w-5 h-5 mr-2" />
            Attempting to verify...
          </>
        ) : (
          <>CONTINUE</>
        )}
      </LightButton>
    </form>
  );
}
