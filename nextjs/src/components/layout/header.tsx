import Link from "next/link";
import CtaButton from "../theme/cta-button";

export default function Header() {
  return (
    <header className="flex w-full items-center text-white h-[5.5rem]">
      <Link href="/" className="text-3xl font-semibold">
        MyNotes
      </Link>
      <nav className="flex ml-auto gap-4 items-center">
        <Link className="px-2" href="/#landing">
          Home
        </Link>
        <Link className="px-2" href="/#features">
          Features
        </Link>
        <CtaButton className="ml-2 rounded-full" asChild>
          <Link href="/login">Sign In</Link>
        </CtaButton>
      </nav>
    </header>
  );
}
