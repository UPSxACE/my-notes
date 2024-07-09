import { auth } from "@/auth";
import BaseInput from "@/components/base-components/base-input";
import CtaButton from "@/components/theme/app/cta-button";
import CtaLink from "@/components/theme/app/cta-link";
import { FaChevronDown } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import NotesListContextProvider from "./_components/notes-list-context";
import HomePageGuest from "./page-guest";
import Notes from "./_components/notes";

export default async function HomePage() {
  const session = await auth();

  if (!session) {
    return <HomePageGuest />;
  }

  return (
    <main className="font-sans bg-ligrey-0 flex-1 p-6">
      <NotesListContextProvider>
        <section className="flex gap-2">
          <div className="flex">
            <CtaLink href="/notes/create" className="rounded-r-none px-3">
              Create
            </CtaLink>
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
            <BaseInput
              placeholder="Search"
              className="focus-visible:outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 px-[0.4rem]"
            />
          </div>
        </section>
        <Notes />
      </NotesListContextProvider>
    </main>
  );
}
