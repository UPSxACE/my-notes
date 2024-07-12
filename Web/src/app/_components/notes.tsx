"use client";

import SpinnerSkCircle from "@/components/spinners/sk-circle";
import { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Folder from "./folder";
import Note from "./note";
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

  // FIXME searchbar filters
  // FIXME new folder
  // FIXME loading
  // FIXME empty
  // FIXME components for each
  // FIXME drag & drop
  // FIXME context menu
  // FIXME onclick triggers
  // FIXME triggers on navigate and go back
  // FIXME redirect on create
  // FIXME page transitions
  // FIXME responsiveness
  // FIXME workana + productivity + clean (plan)

  const enterFolder = (newPath: string) => () => updatePath(newPath);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-2">
      {folders.map((f, index) => {
        return (
          <Folder key={index} folder={f} enterFolder={enterFolder(f.path)} />
        );
      })}
      {notes.map((n, index) => {
        return <Note key={index} note={n} />;
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
