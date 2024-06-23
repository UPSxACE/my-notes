import { Separator } from "@/components/ui/separator";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ConfirmationForm from "./_components/confirmation-form";
import ResendText from "./_components/resend-text";

type StateObject = {
  state: "VERIFIED" | "UNVERIFIED" | "INVALID";
};

export default async function ConfirmEmailPage({
  searchParams,
}: {
  searchParams: { uid?: string; code?: string };
}) {
  const { uid, code } = searchParams;
  if (!uid) {
    redirect("/");
  }

  const { state }: StateObject = await axios
    .get("/auth/confirmation-state", {
      params: {
        uid,
      },
      baseURL: process.env.INTERNAL_API_URL,
    })
    .then((result) => result.data)
    .catch(() => {
      return { state: "INVALID" };
    });

  if (state === "INVALID") {
    redirect("/");
  }

  if (state === "VERIFIED") {
    redirect("/login");
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
          <div className="bg-white px-8 py-8 rounded-xl w-3/4 max-w-[720px] flex flex-col items-center shadow">
            <div className="relative aspect-square w-3/4 max-w-[200px] mb-3">
              <Image
                style={{ objectFit: "cover" }}
                src="/envelope-figure-2.svg"
                alt="cartoonish person sending a letter"
                fill
                decoding="sync"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold mb-3">Verify email</h1>
            <p className="text-center leading-snug px-8 mb-3 text-zinc-800">
              Enter the 6 digit code we sent you via email to continue
            </p>
            <ConfirmationForm uid={uid} defaultValue={code} />
            <Separator className="mt-2 mb-5 max-w-[600px]" />
            <ResendText uid={uid} />
          </div>
        </div>
      </div>
    </main>
  );
}
