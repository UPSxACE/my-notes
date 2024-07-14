"use client";

import SpinnerSkCircle from "@/components/spinners/sk-circle";
import { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Folder from "./folder";
import Note from "./note";
import { NotesListContext } from "./notes-list-context";
import { NotesSearchContext } from "./notes-search-context";

export default function Notes() {
  // Without search
  const { data, loading, fetchMore, error, endOfResults, updatePath } =
    useContext(NotesListContext);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const folders = data?.folders || [];
  const notes = data?.notes || [];
  // With search
  const {
    data: searchData,
    loading: searchLoading,
    fetchMore: searchFetchMore,
    error: searchError,
    endOfResults: searchEndOfResults,
    search,
  } = useContext(NotesSearchContext);
  const filteredNotes = searchData?.results || [];

  useEffect(() => {
    // without search
    if (search === "" && inView && !endOfResults) fetchMore();
    if (search !== "" && inView && !searchEndOfResults) searchFetchMore();
  }, [
    inView,
    endOfResults,
    fetchMore,
    search,
    searchEndOfResults,
    searchFetchMore,
  ]);

  const notReady = search === "" && (loading || error);
  const searchNotReady = search !== "" && (loading || error);
  if (notReady || searchNotReady) {
    return <section>Loading</section>;
  }

  // FIXME searchbar filters
  // FIXME new folder
  // FIXME loading
  // FIXME empty
  // FIXME components for each
  // FIXME drag & drop
  // FIXME context menu on note + logout
  // FIXME hover effect
  // FIXME onclick triggers + (inner join noteNoteTags + inner join noteTags + and filter OR)
  // FIXME triggers on navigate and go back
  // FIXME redirect on create
  // FIXME page transitions
  // FIXME sidebar
  // FIXME responsiveness + smaller sidebar for smaller screens
  // FIXME style note view
  // FIXME context menu (+ select)
  // FIXME return style instead of class in transition hooks
  // FIXME 15: workana + productivity + clean (plan)

  const enterFolder = (newPath: string) => () => updatePath(newPath);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-4 gap-4 mt-2">
      {search === "" &&
        folders.map((f, index) => {
          return (
            <Folder key={index} folder={f} enterFolder={enterFolder(f.path)} />
          );
        })}
      {search === "" &&
        notes.map((n, index) => {
          return <Note key={index} note={n} />;
        })}
      {search !== "" &&
        filteredNotes.map((n, index) => {
          return <Note key={index} note={n} />;
        })}
      {search === "" && !loading && !error && !endOfResults && (
        <div ref={ref} className="col-span-1 xl:col-span-4 flex justify-center">
          {/* <LoadingSpinner className="h-10 w-10" /> */}
          <SpinnerSkCircle className="!mx-0 !my-2" />
        </div>
      )}
      {search !== "" &&
        !searchLoading &&
        !searchError &&
        !searchEndOfResults && (
          <div
            ref={ref}
            className="col-span-1 xl:col-span-4 flex justify-center"
          >
            {/* <LoadingSpinner className="h-10 w-10" /> */}
            <SpinnerSkCircle className="!mx-0 !my-2" />
          </div>
        )}
      {/* <BaseButton onClick={fetchMore}>Load more</BaseButton> */}
    </section>
  );
}
