"use client";

import SpinnerSkCircle from "@/components/spinners/sk-circle";
import LoadingSpinner from "@/components/theme/loading-spinner";
import useThrottledState from "@/hooks/use-throttled-state";
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
    if (search === "" && !loading && !searchLoading && inView && !endOfResults)
      fetchMore();
    // with search
    if (
      search !== "" &&
      !loading &&
      !searchLoading &&
      inView &&
      !searchEndOfResults
    )
      searchFetchMore();
  }, [
    inView,
    endOfResults,
    fetchMore,
    search,
    searchEndOfResults,
    searchFetchMore,
    loading,
    searchLoading,
  ]);

  const notReady = !!(search === "" && (loading || error));
  const searchNotReady = !!(search !== "" && (searchLoading || searchError));
  const throttledNotReady = useThrottledState(
    notReady || searchNotReady,
    400,
    (value) => value === false
  );

  if (throttledNotReady) {
    return (
      <section className="col-span-1 xl:col-span-4 flex flex-col flex-1 justify-center items-center">
        <LoadingSpinner className="h-12 w-12 text-theme-4" />
        {/* <SpinnerSkCircle className="!mx-0 !my-2" /> */}
        {/* <SpinnerSkRect className="!mx-0 !my-2" /> */}
      </section>
    );
  }

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
  // FIXME order folder names by name
  // FIXME notifications on register/etc. (review fixmes)

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
