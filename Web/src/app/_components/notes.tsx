"use client";

import BaseButton from "@/components/base-components/base-button";
import Link from "next/link";
import { useContext } from "react";
import { NotesListContext } from "./notes-list-context";

export default function Notes() {
  const { data, loading, fetchMore, error } = useContext(NotesListContext);

  const folders = data?.folders || [];
  const notes = data?.notes || [];

  if (loading || error) {
    return <section>Loading</section>;
  }

  return (
    <section>
      <div>
        {folders.map((f, index) => {
          const lastSlash = f.path.lastIndexOf("/");

          return <h1 key={index}>{f.path.slice(lastSlash)}</h1>;
        })}
        {notes.map((n, index) => {
          return (
            <Link key={index} href={`/notes/view/${n.id}`}>
              <h1>{n.title}</h1>
            </Link>
          );
        })}
        <BaseButton onClick={fetchMore}>Load more</BaseButton>
      </div>
    </section>
  );
}
