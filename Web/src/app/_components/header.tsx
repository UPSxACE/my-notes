"use client";

import BaseInput from "@/components/base-components/base-input";
import CtaButton from "@/components/theme/app/cta-button";
import CtaLink from "@/components/theme/app/cta-link";
import { ChangeEvent, useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

import { debounce } from "lodash";
import { NotesSearchContext } from "./notes-search-context";

export default function Header() {
  const { search, updateSearch } = useContext(NotesSearchContext);

  const changeSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    updateSearch(e.target.value);
  }, 800);

  return (
    <section className="flex gap-2">
      <div className="flex">
        <CtaLink href="/notes/create" className="rounded-r-none px-3 h-10">
          Create
        </CtaLink>
        <CtaButton className="rounded-l-none px-2 border-l-gray-200 border-solid border-l h-10">
          <span>
            <FaChevronDown />
          </span>
        </CtaButton>
      </div>
      <div className="flex-1 flex bg-white rounded-md overflow-hidden items-center pl-3 pr-2 border-zinc-200 border border-solid h-10">
        <span className="select-none text-xl">
          <LuSearch />
        </span>
        <BaseInput
          defaultValue={search}
          placeholder="Search"
          className="focus-visible:outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 px-[0.4rem] h-full"
          onChange={changeSearch}
        />
      </div>
    </section>
  );
}
