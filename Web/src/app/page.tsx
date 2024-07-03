import { auth } from "@/auth";
import CtaButton from "@/components/theme/app/cta-button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FaChevronDown } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import HomePageGuest from "./page-guest";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <HomePageGuest />;
  }

  return (
    <main className="font-sans bg-ligrey-0 flex-1 p-6">
      <div className="flex gap-2">
        <div className="flex">
          <CtaButton asChild className="rounded-r-none px-3">
            <Link href="/notes/create">Create</Link>
          </CtaButton>
          <CtaButton className="rounded-l-none px-2 border-l-gray-200 border-solid border-l">
            <span>
              <FaChevronDown />
            </span>
          </CtaButton>
        </div>
        <div className="flex-1 flex bg-white rounded-md overflow-hidden items-center pl-3 pr-2 border-zinc-200 border border-solid">
          <span className="select-none text-xl">
            <LuSearch />
          </span>
          <Input
            placeholder="Search"
            className="focus-visible:outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 px-[0.4rem]"
          />
        </div>
      </div>
    </main>
  );
}
