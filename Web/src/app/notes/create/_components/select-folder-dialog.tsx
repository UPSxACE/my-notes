"use client";
import BaseInput from "@/components/base-components/base-input";
import CtaButton from "@/components/theme/app/cta-button";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Folder } from "@/gql/graphql";
import usePagination from "@/hooks/use-pagination";
import { ReactState } from "@/utils/react-state-type";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Inter } from "next/font/google";
import { MouseEventHandler, useState } from "react";
import { Flipped } from "react-flip-toolkit";
import { LuSearch } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type Props = {
  visibleClass: string;
  visible: boolean;
  onNewFolderClick: MouseEventHandler<HTMLButtonElement>;
  folders: Folder[] | undefined;
  folderState: ReactState<string>;
  localSelectionState: ReactState<string>;
};

export default function SelectFolderDialog(props: Props) {
  const {
    visible,
    visibleClass,
    onNewFolderClick: onClick,
    folders,
    localSelectionState,
    folderState,
    ...rest
  } = props;

  const [search, setSearch] = useState("");
  const [localSelection, setLocalSelection] = localSelectionState;
  const [folder, setFolder] = folderState;
  const PAGE_SIZE = 10;
  const currSelectedIndex = folders?.findIndex((x) => x.path === folder);
  const currSelectedPage = currSelectedIndex
    ? Math.ceil((currSelectedIndex + 1) / PAGE_SIZE)
    : 1;

  const { currentPageData, currentPage, totalPages, nextPage, previousPage } =
    usePagination(
      folders?.filter((x) => x.path.includes(search)),
      PAGE_SIZE,
      currSelectedPage
    );

  const selectFolder = (newFolder: string) => () =>
    setLocalSelection(newFolder);
  const folderItems = currentPageData?.map((f, index) => {
    return (
      //border-solid border-b border-gray-200 [&:nth-of-type(10)]:border-0
      <button
        key={index}
        className={twMerge(
          inter.className,
          "text-neutral-600 font-semibold flex text-left h-10 hover:bg-gray-50 transition-all duration-200 px-6 text-sm w-full items-center",
          localSelection == f.path && "!bg-violet-100 !text-violet-600"
        )}
        onClick={selectFolder(f.path)}
      >
        {f.path}
      </button>
    );
  });

  return (
    <div className={"bg-white overflow-hidden shadow-md rounded-md"} {...rest}>
      <Flipped inverseFlipId="wrapper">
        <div className={twMerge("w-[90svw] max-w-[720px]", visibleClass)}>
          <DialogHeader className="p-4 px-5">
            <DialogTitle>Select folder</DialogTitle>
            <DialogDescription>
              Select the folder to save the note in. Or create a new one.
            </DialogDescription>
          </DialogHeader>

          <div className="flex gap-0">
            {/** border-zinc-200 */}
            <div className="flex-1 flex bg-white rounded-none overflow-hidden items-center pl-5 pr-5 border-gray-300 border-t border-solid">
              <span className="select-none text-xl">
                <LuSearch />
              </span>
              <BaseInput
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
                placeholder="Search"
                className="bg-transparent focus-visible:outline-none border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-base p-0 px-[0.4rem]"
              />
            </div>
            <CtaButton green square className="h-auto" onClick={onClick}>
              New Folder
            </CtaButton>
          </div>
          <Separator className="bg-gray-300" />
          <div className="h-[25rem]">{folderItems}</div>
          <Separator className="bg-gray-300" />
          <DialogFooter className="mt-0 h-auto !justify-start !items-center gap-1 flex-wrap">
            <div className="flex gap-3 flex-wrap items-center bg-transparent overflow-hidden">
              <Button
                onClick={previousPage}
                variant="ghost"
                className="px-2 rounded-none bg-transparent hover:bg-gray-100 border-r border-solid border-gray-200"
              >
                <ChevronLeft />
              </Button>
              <span className="text-sm">
                {currentPage} of {totalPages}
              </span>
              <Button
                onClick={nextPage}
                variant="ghost"
                className="px-2 rounded-none bg-transparent hover:bg-gray-100 border-l border-r border-solid border-gray-200"
              >
                <ChevronRight />
              </Button>
            </div>
            <DialogClose asChild>
              <CtaButton
                className="!ml-auto"
                square
                onClick={() => {
                  setFolder(localSelection);
                }}
              >
                Select Folder
              </CtaButton>
            </DialogClose>
          </DialogFooter>
        </div>
      </Flipped>
    </div>
  );
}
