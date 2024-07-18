"use client";

import BaseInput from "@/components/base-components/base-input";
import CtaButton from "@/components/theme/app/cta-button";
import CtaLink from "@/components/theme/app/cta-link";
import { ChangeEvent, useContext } from "react";
import { FaChevronDown } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

import { Dialog } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useToggle from "@/hooks/use-toggle";
import { debounce } from "lodash";
import NewFolderDialog from "./new-folder-dialog";
import { NotesListContext } from "./notes-list-context";
import { NotesSearchContext } from "./notes-search-context";
import { enumToOptions } from "./order-by";

export default function Header() {
  const { search, updateSearch } = useContext(NotesSearchContext);

  const changeSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    updateSearch(e.target.value);
  }, 800);

  const [newFolderOpen, toggleNewFolderOpen] = useToggle(false);
  const updateNewFolder = (value: boolean) => () => toggleNewFolderOpen(value);

  const { path, orderBy: _orderBy } = useContext(NotesListContext);
  const { orderBy, direction } = enumToOptions(_orderBy);

  return (
    <section className="flex gap-2">
      <div className="flex">
        <CtaLink href="/notes/create" className="rounded-r-none px-3 h-10">
          Create
        </CtaLink>{" "}
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="!ring-0 !ring-offset-0 !outline-none"
          >
            <CtaButton className="rounded-l-none px-2 border-l-gray-200 border-solid border-l h-10">
              <span>
                <FaChevronDown />
              </span>
            </CtaButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-0 rounded-md p-0 !translate-y-0"
            alignOffset={0}
            sideOffset={0}
          >
            <DropdownMenuItem
              onClick={updateNewFolder(true)}
              className="!ring-0 !ring-offset-0 !outline-none px-3 py-2 transition-all duration-100 rounded-md hover:cursor-pointer"
            >
              <span className="w-fit">Create Folder</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={newFolderOpen} onOpenChange={toggleNewFolderOpen}>
          <NewFolderDialog
            path={path}
            orderBy={orderBy}
            direction={direction}
            afterSave={updateNewFolder(false)}
          />
        </Dialog>
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
