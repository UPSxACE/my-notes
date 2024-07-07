import Link from "next/link";
import CtaLink from "../theme/app/cta-link";

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
        <CtaLink href="/login" className="ml-2 rounded-full">
          Sign In
        </CtaLink>
      </nav>
    </header>
  );
}
