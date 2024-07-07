"use client";

import { ReactState } from "@/utils/react-state-type";
import { Ref } from "react";
import { TagSuggestion } from "react-tag-autocomplete";
import Folder from "./folder";
import Priority from "./priority";
import Tags from "./tags";

type Props = {
  tagsState: ReactState<TagSuggestion[]>;
  folderState: ReactState<string>;
  priorityRef: Ref<HTMLInputElement>;
};

export default function Sidebar(props: Props) {
  return (
    <aside className="w-[320px] border-l border-solid border-zinc-200 py-3">
      <Priority priorityRef={props.priorityRef} />
      <Tags state={props.tagsState} />
      <Folder state={props.folderState} />
    </aside>
  );
}
