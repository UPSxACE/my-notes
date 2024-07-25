"use client";
import { Note as NoteModel } from "@/gql/graphql.schema";
import { toDateDMYStringCompact } from "@/utils/date-format";
import { motion, useAnimationControls, useDragControls } from "framer-motion";
import { Clock, Ellipsis, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { RefObject, useContext, useRef, useState } from "react";
import { DropTargetContext } from "./drop-target-context";
import NoteTags from "./note-tags";
import { NotesListContext } from "./notes-list-context";
import useMoveNote from "./use-move-note";

type Props = {
  note: NoteModel;
  constraintsRef: RefObject<HTMLDivElement | null>;
};

export default function Note(props: Props) {
  const { path, orderBy, hasNextPage } = useContext(NotesListContext);
  const { note, constraintsRef } = props;

  const router = useRouter();

  const controls = useDragControls();
  const isDragging = useRef(false);
  const animationControls = useAnimationControls();
  const [pe, setPE] = useState(true);
  const { target } = useContext(DropTargetContext);

  // move
  const moveNote = useMoveNote(path, orderBy, hasNextPage);

  return (
    <div className="bg-gray-200 rounded-md">
      <motion.article
        className="bg-white py-3 px-5 border border-solid border-zinc-200 rounded-md"
        onDragStart={(e) => {
          isDragging.current = true;
          target.current = null;
          setPE(false);
        }}
        onDragEnd={() => {
          isDragging.current = false;
          setPE(true);

          if (!target.current) return animationControls.start({ x: 0, y: 0 });

          const targetPath = target.current;
          animationControls.start({ scale: 0.1, opacity: 0, dur: 200 });
          setTimeout(() => {
            moveNote({
              noteId: note.id,
              targetPath,
            });
          }, 100);
        }}
        dragMomentum={false}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        animate={animationControls}
        style={{
          touchAction: "none",
          pointerEvents: !pe ? "none" : undefined,
        }} // compatibility with touch screen
        drag
        dragControls={controls}
        dragConstraints={constraintsRef}
      >
        <div className="flex text-lg">
          <button
            onClick={() => {
              if (!isDragging.current) router.push(`/notes/view/${note.id}`);
            }}
            // href={`/notes/view/${note.id}`}
            className="flex-1 text-left font-medium line-clamp-1"
          >
            {note.title}
          </button>
          <button className="px-1 text-zinc-500">
            <Ellipsis />
          </button>
        </div>
        {/** 5 * 1.5rem(line height) = 7.5 */}
        <button
          // href={`/notes/view/${note.id}`}
          onClick={() => {
            if (!isDragging.current) router.push(`/notes/view/${note.id}`);
          }}
          className="h-[7.5rem] text-base w-full text-left flex"
        >
          <p className="h-[7.5rem] line-clamp-5 text-left text-zinc-500 text-sm whitespace-break-spaces">
            {note.contentText?.replaceAll("\n\n", "\n")}
          </p>
        </button>
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
      </motion.article>
    </div>
  );
}
