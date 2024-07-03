"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AppSidebar() {
  const path = usePathname();
  const show = isVisible(path);

  return (
    <aside
      className={clsx(
        "font-sans max-h-screen overflow-hidden transition-all duration-500",
        show ? "w-[300px] opacity-100" : "w-0 opacity-0"
      )}
    >
      <div
        className={clsx(
          "w-full border-solid border-zinc-200 transition-[border-width] duration-500 h-full",
          show ? "border-r" : "border-r-0"
        )}
      >
        <div className="p-8 w-[300px] h-full">
          <Link href="/" className="text-2xl font-semibold">
            MyNotes
          </Link>
        </div>
      </div>
    </aside>
  );
}

function isVisible(path: string) {
  switch (path) {
    case "/notes/create":
      return false;
    default:
      return true;
  }
}
