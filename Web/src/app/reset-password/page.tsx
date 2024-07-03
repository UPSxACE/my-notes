import axios from "axios";
import Link from "next/link";
import { redirect } from "next/navigation";
import ResetPasswordForm from "./_components/reset-password-form";

type StateObject = {
  state: "READY" | "INVALID";
};

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: { uid?: string; code?: string };
}) {
  const { uid } = searchParams;
  if (!uid) {
    redirect("/");
  }

  const { state }: StateObject = await axios
    .get("/recovery-state", {
      params: {
        uid: uid,
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
          <div className="bg-white px-6 pb-10 pt-8 rounded-xl max-w-[500px] flex flex-col items-center shadow">
            <h1 className="text-2xl font-bold w-full px-4 mb-1">
              Reset your password
            </h1>
            <p className="text-left leading-snug px-4 mb-6 text-zinc-800 w-full">
              Enter a new password for your MyNotes account. We&apos;ll ask for
              this password whenever you log in.
            </p>
            <ResetPasswordForm uid={uid} />
          </div>
        </div>
      </div>
    </main>
  );
}
