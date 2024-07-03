"use client";

import Folder from "./folder";
import Priority from "./priority";
import Tags from "./tags";

export default function Sidebar() {
  return (
    <aside className="w-[360px] border-l border-solid border-zinc-200">
      <Priority />
      <Tags />
      <Folder />
    </aside>
  );
}
