"use client";
import { Folder as FolderModel } from "@/gql/graphql.schema";
import { toDateDMYStringCompact } from "@/utils/date-format";
import { Clock, Ellipsis, File } from "lucide-react";
import { MouseEventHandler } from "react";
import { AiOutlineFolderOpen } from "react-icons/ai";

type Props = {
  enterFolder: MouseEventHandler<HTMLButtonElement>;
  folder: FolderModel;
};

export default function Folder(props: Props) {
  const { enterFolder, folder } = props;

  const lastSlash = folder.path.lastIndexOf("/");

  return (
    <article className="bg-white py-3 px-5 border border-solid border-zinc-200 rounded-md">
      <div className="flex text-lg">
        <button
          onClick={enterFolder}
          className="flex-1 text-left font-medium line-clamp-1"
        >
          {folder.path.slice(lastSlash + 1)}
        </button>
        <button className="px-1 text-zinc-500">
          <Ellipsis />
        </button>
      </div>
      {/** 5 * 1.5rem(line height) = 7.5 */}
      <button
        onClick={enterFolder}
        className="w-full h-40 border-b border-solid border-zinc-200 mb-[0.35rem] flex justify-center items-center p-6"
      >
        <AiOutlineFolderOpen className="text-zinc-100 h-full w-auto" />
      </button>
      <div className="flex text-zinc-500 items-center">
        <span className="text-sm flex gap-[0.35rem]">
          <Clock size="1.1rem" className="pt-[0.05rem]" strokeWidth={1.5} />{" "}
          {folder.lastNoteAdded &&
            toDateDMYStringCompact(new Date(folder.lastNoteAdded))}
        </span>
        <span className="ml-auto text-sm flex gap-1">
          <File size="1.1rem" className="pt-[0.1rem]" strokeWidth={1.5} />{" "}
          {folder.notesCount}
        </span>
      </div>
    </article>
  );
}
