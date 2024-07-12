"use client";
import { Note as NoteModel } from "@/gql/graphql.schema";
import { toDateDMYStringCompact } from "@/utils/date-format";
import { Clock, Ellipsis, Eye } from "lucide-react";
import Link from "next/link";
import NoteTags from "./note-tags";

type Props = {
  note: NoteModel;
};

export default function Note(props: Props) {
  const { note } = props;
  return (
    <article className="bg-white py-3 px-5 border border-solid border-zinc-200 rounded-md">
      <div className="flex text-lg">
        <Link
          href={`/notes/view/${note.id}`}
          className="flex-1 text-left font-medium line-clamp-1"
        >
          {note.title}
        </Link>
        <button className="px-1 text-zinc-500">
          <Ellipsis />
        </button>
      </div>
      {/** 5 * 1.5rem(line height) = 7.5 */}
      <Link
        href={`/notes/view/${note.id}`}
        className="h-[7.5rem] text-base w-full text-left flex"
      >
        <p className="h-[7.5rem] line-clamp-5 text-left text-zinc-500 text-sm whitespace-break-spaces">
          {note.contentText?.replaceAll("\n\n", "\n")}
        </p>
      </Link>
      {/** 1 * 1.75rem(line height) + 0.75 + 0.25 = 2.75 */}
      <NoteTags tags={note.tags} />
      <div className="flex text-zinc-500 items-center">
        <span className="text-sm flex gap-[0.35rem]">
          <Clock size="1.1rem" className="pt-[0.05rem]" strokeWidth={1.5} />{" "}
          {toDateDMYStringCompact(new Date(note.createdAt))}
        </span>
        <span className="ml-auto text-sm flex gap-1 items-center">
          <Eye size="1.1rem" className="pb-[0.05rem]" strokeWidth={1.5} />{" "}
          {note.views}
        </span>
      </div>
    </article>
  );
}
