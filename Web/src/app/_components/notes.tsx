"use client";

import SpinnerSkCircle from "@/components/spinners/sk-circle";
import LoadingSpinner from "@/components/theme/loading-spinner";
import useDoOnce from "@/hooks/use-do-once";
import { notifyFatal } from "@/utils/toaster-notifications";
import { useContext, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import Folder from "./folder";
import Note from "./note";
import { NotesListContext } from "./notes-list-context";
import { NotesSearchContext } from "./notes-search-context";

export default function Notes() {
  // const [inViewCalculated, setInViewCalculated] = useState()
  // Without search
  const {
    data,
    isLoading,
    isFetching,
    fetchNextPage,
    error,
    hasNextPage,
    updatePath,
  } = useContext(NotesListContext);
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });
  const folders = data.folders;
  const notes = data.notes;
  // With search
  const {
    data: searchData,
    isLoading: searchIsLoading,
    isFetching: searchIsFetching,
    fetchNextPage: searchFetchNextPage,
    error: searchError,
    hasNextPage: searchHasNextPage,
    search,
  } = useContext(NotesSearchContext);
  const filteredNotes = searchData.results;

  useEffect(() => {
    const isAnyLoading =
      isLoading || isFetching || searchIsFetching || searchIsLoading;
    if (inView && !isAnyLoading && search === "" && hasNextPage) {
      fetchNextPage();
    }
    if (inView && !isAnyLoading && search !== "" && searchHasNextPage) {
      searchFetchNextPage();
    }
  }, [
    inView,
    isLoading,
    searchIsFetching,
    searchIsLoading,
    search,
    hasNextPage,
    searchHasNextPage,
    fetchNextPage,
    searchFetchNextPage,
  ]);

  const notReady = !!(search === "" && (isLoading || error));
  const searchNotReady = !!(
    search !== "" &&
    (searchIsFetching || searchIsLoading || searchError)
  );

  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (notReady || searchNotReady) {
    if (error) {
      notifyErrorOnce();
    }

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
      {search === "" && hasNextPage && (
        <div ref={ref} className="col-span-1 xl:col-span-4 flex justify-center">
          {/* <LoadingSpinner className="h-10 w-10" /> */}
          <SpinnerSkCircle className="!mx-0 !my-2" />
        </div>
      )}
      {search !== "" && searchHasNextPage && (
        <div ref={ref} className="col-span-1 xl:col-span-4 flex justify-center">
          {/* <LoadingSpinner className="h-10 w-10" /> */}
          <SpinnerSkCircle className="!mx-0 !my-2" />
        </div>
      )}
      {/* <BaseButton onClick={fetchMore}>Load more</BaseButton> */}
    </section>
  );
}
