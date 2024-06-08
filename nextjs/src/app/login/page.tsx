import Image from "next/image";
import Link from "next/link";
import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <main className="font-sans flex min-h-screen">
      <aside className="flex-1 basis-[50%] from-0% from-[#7769ef] to-100%  to-[#4942b3] bg-gradient-to-br hidden lg:flex flex-col justify-center items-center px-10">
        <h1 className="text-5xl leading-tight text-white font-semibold text-center">
          Welcome back!
        </h1>
        <div className="relative aspect-square w-3/5 max-w-[400px] my-10">
          <Image
            style={{ objectFit: "contain" }}
            src="figure-2.svg"
            alt="cartoonish person taking notes"
            fill
            decoding="sync"
            priority
          />
        </div>
        <h2 className="text-3xl leading-tight text-white font-semibold text-center">
          Ready to get productive again?
        </h2>
        <p className="text-base leading-tight text-white text-center mt-8">
          Capture and organize your ideas
        </p>
      </aside>
      <article
        id="login"
        className="flex-1 basis-[50%] px-8 py-4 flex flex-col items-center"
      >
        <header className="w-full">
          <Link href="/" className="text-3xl font-semibold">
            MyNotes
          </Link>
        </header>
        <div className="flex-1 flex flex-col justify-center w-full max-w-[400px] gap-4">
          <h1 className="text-4xl font-semibold">Login</h1>
          <p className="text-zinc-600 font-medium mb-3">
            Preserve your thoughts, forever
          </p>
          <LoginForm />
        </div>
      </article>
    </main>
  );
}
