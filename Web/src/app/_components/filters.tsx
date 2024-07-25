"use client";

import { Fragment, useContext, useState } from "react";
import { NotesListContext } from "./notes-list-context";

import GhostTextButton from "@/components/theme/app/ghost-text-button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import { Inter } from "next/font/google";
import { NoteOrderBy } from "../../utils/note-order-by";
import { NotesSearchContext } from "./notes-search-context";

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export default function Filters() {
  // without search
  const { path, updatePath, orderBy, updateOrderBy } =
    useContext(NotesListContext);
  const splitPath = path && path.length >= 2 ? path.split("/") : [""];
  const breadcrumbs = splitPath.slice(1);
  const [open, setOpen] = useState(false);

  const changePath = (newPath: string) => () => updatePath(newPath);

  // with search
  const { search } = useContext(NotesSearchContext);

  return (
    <section
      className={"mt-2 flex items-center text-lg gap-1 " + inter.className}
    >
      {search === "" && (
        <>
          <button onClick={path !== "/" && !!path ? changePath("") : undefined}>
            Notes
          </button>
          {breadcrumbs.map((x, index) => {
            return (
              <Fragment key={index}>
                <span
                  className={
                    index === breadcrumbs.length - 1 ? "font-bold" : ""
                  }
                >
                  /
                </span>
                <button
                  className={
                    index === breadcrumbs.length - 1 ? "font-bold" : ""
                  }
                  onClick={changePath(
                    "/" + breadcrumbs.slice(0, index + 1).join("/")
                  )}
                >
                  {x}
                </button>
              </Fragment>
            );
          })}
        </>
      )}
      {search !== "" && (
        <span>
          Results for: <strong>{search}</strong>
        </span>
      )}

      <Popover open={open} onOpenChange={(open) => setOpen(open)}>
        <PopoverTrigger
          asChild
          className="!ring-0 !ring-offset-0 !outline-none"
        >
          <GhostTextButton className="ml-auto font-medium hover:bg-zinc-200 rounded-sm h-9 px-2 text-lg">
            Filters{" "}
            <ListFilter
              size={"1.5rem"}
              className="ml-1 !mb-[0.075rem]"
              strokeWidth={1.5}
            />
          </GhostTextButton>
        </PopoverTrigger>
        <PopoverContent
          className="min-w-40 px-3 py-3 rounded-md w-60"
          side="bottom"
          align="end"
        >
          <h1 className="font-medium">Order by</h1>
          <Select
            value={orderBy}
            // defaultValue={OrderBy.LatestFirst}
            onValueChange={(newOrder: NoteOrderBy) => {
              updateOrderBy(newOrder);
              setOpen(false);
            }}
          >
            <SelectTrigger className="mt-1 w-full focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!outline-none focus:!ring-0 focus:!ring-offset-0 focus:!outline-none">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={NoteOrderBy.LatestFirst}>
                Latest First
              </SelectItem>
              <SelectItem value={NoteOrderBy.OldestFirst}>
                Oldest First
              </SelectItem>
              <SelectItem value={NoteOrderBy.TitleAZ}>Title A-Z</SelectItem>
              <SelectItem value={NoteOrderBy.TitleZA}>Title Z-A</SelectItem>
              <SelectItem value={NoteOrderBy.HighestPriority}>
                Highest Priority
              </SelectItem>
              <SelectItem value={NoteOrderBy.LowestPriority}>
                Lowest Priority
              </SelectItem>
              <SelectItem value={NoteOrderBy.MostViews}>Most Views</SelectItem>
              <SelectItem value={NoteOrderBy.LeastViews}>
                Least Views
              </SelectItem>
            </SelectContent>
          </Select>
        </PopoverContent>
      </Popover>
    </section>
  );
}
