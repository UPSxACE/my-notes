import Image from "next/image";
import Link from "next/link";
import RegisterForm from "./register-form";

export default function RegisterPage() {
  return (
    <main className="font-sans flex min-h-screen">
      <article
        id="register"
        className="flex-1 basis-[50%] px-8 py-4 flex flex-col items-center"
      >
        <header className="w-full">
          <Link href="/" className="text-3xl font-semibold">
            MyNotes
          </Link>
        </header>
        <div className="flex-1 flex flex-col justify-center w-full max-w-[400px] gap-4">
          <h1 className="text-4xl font-semibold">Register</h1>
          <p className="text-zinc-600 font-medium mb-3">
            Take control of your life again
          </p>
          <RegisterForm />
        </div>
      </article>
      <aside className="flex-1 basis-[50%] from-0% from-[#7769ef] to-100%  to-[#4942b3] bg-gradient-to-br hidden lg:flex flex-col justify-center items-center px-10">
        <h1 className="text-5xl leading-tight text-white font-semibold text-center">
          Welcome to our community!
        </h1>
        <div className="relative aspect-square w-3/5 max-w-[500px]">
          <Image
            style={{ objectFit: "contain" }}
            src="./figure-1.svg"
            alt="cartoonish person taking notes"
            fill
          />
        </div>
        <h2 className="text-3xl leading-tight text-white font-semibold text-center">
          Plan your everyday tasks seamlessly
        </h2>
        <p className="text-base leading-tight text-white text-center mt-8">
          Capture and organize your ideas
        </p>
      </aside>
    </main>
  );
}
