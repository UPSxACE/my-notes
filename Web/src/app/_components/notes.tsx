"use client";

import SpinnerSkCircle from "@/components/spinners/sk-circle";
import BaseTag from "@/components/tags/base-tag";
import { toDateDMYStringCompact } from "@/utils/date-format";
import { Clock, Ellipsis, Eye, File } from "lucide-react";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { useInView } from "react-intersection-observer";
import { NotesListContext } from "./notes-list-context";

export default function Notes() {
  const { data, loading, fetchMore, error, endOfResults, updatePath } =
    useContext(NotesListContext);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  const folders = data?.folders || [];
  const notes = data?.notes || [];

  useEffect(() => {
    if (inView && !endOfResults) fetchMore();
  }, [inView, endOfResults, fetchMore]);

  if (loading || error) {
    return <section>Loading</section>;
  }

  // FIXME tags map
  // FIXME infinite scroll
  // FIXME tags overflow + hover
  // FIXME searchbar filters
  // FIXME new folder
  // FIXME loading
  // FIXME empty
  // FIXME components for each
  // FIXME drag & drop
  // FIXME context
  // FIXME triggers on navigate and go back
  // FIXME redirect on create
  // FIXME workana + productivity + clean (plan)

  const enterFolder = (newPath: string) => () => updatePath(newPath);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-2">
      {folders.map((f, index) => {
        const lastSlash = f.path.lastIndexOf("/");

        return (
          <article
            key={index}
            className="bg-white py-3 px-5 border border-solid border-zinc-200 rounded-md"
          >
            <div className="flex text-lg">
              <button
                onClick={enterFolder(f.path)}
                className="flex-1 text-left font-medium line-clamp-1"
              >
                {f.path.slice(lastSlash + 1)}
              </button>
              <button className="px-1 text-zinc-500">
                <Ellipsis />
              </button>
            </div>
            {/** 5 * 1.5rem(line height) = 7.5 */}
            <button
              onClick={enterFolder(f.path)}
              className="w-full h-40 border-b border-solid border-zinc-200 mb-[0.35rem] flex justify-center items-center p-6"
            >
              <AiOutlineFolderOpen className="text-zinc-100 h-full w-auto" />
            </button>
            <div className="flex text-zinc-500 items-center">
              <span className="text-sm flex gap-[0.35rem]">
                <Clock
                  size="1.1rem"
                  className="pt-[0.05rem]"
                  strokeWidth={1.5}
                />{" "}
                {f.lastNoteAdded &&
                  toDateDMYStringCompact(new Date(f.lastNoteAdded))}
              </span>
              <span className="ml-auto text-sm flex gap-1">
                <File size="1.1rem" className="pt-[0.1rem]" strokeWidth={1.5} />{" "}
                {f.notesCount}
              </span>
            </div>
          </article>
        );
      })}
      {notes.map((n, index) => {
        return (
          <article
            key={index}
            className="bg-white py-3 px-5 border border-solid border-zinc-200 rounded-md"
          >
            <div className="flex text-lg">
              <Link
                href={`/notes/view/${n.id}`}
                className="flex-1 text-left font-medium line-clamp-1"
              >
                {n.title}
              </Link>
              <button className="px-1 text-zinc-500">
                <Ellipsis />
              </button>
            </div>
            {/** 5 * 1.5rem(line height) = 7.5 */}
            <Link
              href={`/notes/view/${n.id}`}
              className="h-[7.5rem] text-base w-full text-left flex"
            >
              <p className="h-[7.5rem] line-clamp-5 text-left text-zinc-500 text-sm whitespace-break-spaces">
                {n.contentText?.replaceAll("\n\n", "\n")}
              </p>
            </Link>
            {/** 1 * 1.75rem(line height) + 0.75 + 0.25 = 2.75 */}
            <div className="flex border-solid border-b border-zinc-200 h-10 pb-2 pt-1 mb-[0.35rem] gap-[0.35rem]">
              {n.tags.map((tag, index) => (
                <BaseTag key={index} text={"#" + tag} />
              ))}
            </div>
            <div className="flex text-zinc-500 items-center">
              <span className="text-sm flex gap-[0.35rem]">
                <Clock
                  size="1.1rem"
                  className="pt-[0.05rem]"
                  strokeWidth={1.5}
                />{" "}
                {toDateDMYStringCompact(new Date(n.createdAt))}
              </span>
              <span className="ml-auto text-sm flex gap-1 items-center">
                <Eye size="1.1rem" className="pb-[0.05rem]" strokeWidth={1.5} />{" "}
                {n.views}
              </span>
            </div>
          </article>
        );
      })}
      {!loading && !error && !endOfResults && (
        <div ref={ref} className="col-span-1 xl:col-span-4 flex justify-center">
          {/* <LoadingSpinner className="h-10 w-10" /> */}
          <SpinnerSkCircle className="!mx-0 !my-2" />
        </div>
      )}
      {/* <BaseButton onClick={fetchMore}>Load more</BaseButton> */}
    </section>
  );
}
