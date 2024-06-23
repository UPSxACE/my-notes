import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ConfirmationSentPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  const { email } = searchParams;
  if (!email) {
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
          <div className="bg-white px-8 py-8 rounded-xl w-3/4 max-w-[720px] flex flex-col items-center shadow">
            <div className="relative aspect-square w-3/4 max-w-[400px]">
              <Image
                style={{ objectFit: "cover" }}
                src="/mail-figure-2.svg"
                alt="cartoonish person sending a letter"
                fill
                decoding="sync"
                priority
              />
            </div>
            <h1 className="text-2xl font-bold mb-3">Confirm your email</h1>
            <p className="text-center leading-snug px-8 mb-3 text-zinc-800">
              We have sent a link to <em className="text-theme-6">{email}</em>{" "}
              to confirm the validity of your email address. After receiving it,
              please follow the instructions provided to complete your
              registration.
            </p>
            <Separator className="mt-2 mb-5 max-w-[600px]" />
            <p className="text-center text-sm text-zinc-600">
              If you do not see any email please check your spam folder
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
