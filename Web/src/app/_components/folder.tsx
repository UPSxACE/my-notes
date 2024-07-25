"use client";
import { Folder as FolderModel } from "@/gql/graphql.schema";
import { toDateDMYStringCompact } from "@/utils/date-format";
import { motion, useAnimationControls, useDragControls } from "framer-motion";
import { Clock, Ellipsis, File } from "lucide-react";
import {
  MouseEventHandler,
  RefObject,
  useContext,
  useRef,
  useState,
} from "react";
import { AiOutlineFolderOpen } from "react-icons/ai";
import { DropTargetContext } from "./drop-target-context";
import { NotesListContext } from "./notes-list-context";
import useMoveFolder from "./use-move-folder";

type Props = {
  enterFolder: MouseEventHandler<HTMLButtonElement>;
  folder: FolderModel;
  constraintsRef: RefObject<HTMLDivElement | null>;
};

export default function Folder(props: Props) {
  const { path } = useContext(NotesListContext);
  const { enterFolder, folder, constraintsRef } = props;
  const { onMouseEnter, onMouseLeave } = useContext(DropTargetContext);

  const lastSlash = folder.path.lastIndexOf("/");

  const controls = useDragControls();
  const isDragging = useRef(false);
  const animationControls = useAnimationControls();
  const [pe, setPE] = useState(true);
  const { target } = useContext(DropTargetContext);

  // move
  const moveFolder = useMoveFolder(path);

  return (
    <div className="bg-gray-200 rounded-md">
      <motion.article
        className="bg-white py-3 px-5 border border-solid border-zinc-200 rounded-md"
        onMouseEnter={onMouseEnter(folder.path)}
        onMouseLeave={onMouseLeave()}
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
            moveFolder({
              currentPath: folder.path,
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
      </motion.article>
    </div>
  );
}
