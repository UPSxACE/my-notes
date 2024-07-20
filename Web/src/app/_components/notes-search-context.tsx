"use client";
import { CursorSearchOfListOfNote } from "@/gql/graphql.schema";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { OrderBy, enumToOptions } from "./order-by";
import useQuerySearchNote from "./use-query-search-note";

type Context = {
  data: CursorSearchOfListOfNote;
  error: Error | null;
  isFetching: boolean;
  isLoading: boolean;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean;
  search: string;
  updateSearch: (newSearch: string) => void;
  resetCursor: () => void;
};

const defaultValue: Context = {
  data: { cursor: null, results: [] },
  error: null,
  isFetching: true,
  isLoading: true,
  fetchNextPage: async () => {},
  hasNextPage: false,
  search: "",
  updateSearch: (newSearch: string) => {},
  resetCursor: () => {},
};

export const NotesSearchContext = createContext<Context>(defaultValue);

export default function NotesSearchContextProvider(props: {
  children: Readonly<ReactNode>;
}) {
  const searchParams = useSearchParams();
  const search = searchParams.get("search") || "";
  const orderBy = (searchParams.get("order") as OrderBy) || OrderBy.LatestFirst;

  const orderByOptionsInitial = useRef({
    query: search,
    ...enumToOptions(orderBy),
  });
  //   const orderByOptionsInitial = useRef(enumToOptions(orderBy));
  const {
    data,
    error,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
    options,
    setOptions,
  } = useQuerySearchNote(orderByOptionsInitial.current);

  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value === "") {
        params.delete(name);
        return params.toString();
      }

      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  function updateSearch(newSearch: string) {
    router.push(`${pathname}?${createQueryString("search", newSearch)}`);
  }

  useEffect(() => {
    const orderByOptions = enumToOptions(orderBy);
    if (
      orderByOptions.direction !== options.direction ||
      orderByOptions.orderBy !== options.orderBy ||
      search !== options.query
    ) {
      setOptions((prev) => ({
        ...prev,
        query: search,
        ...orderByOptions,
        // cursor: undefined, // cursor should be resetted when search or orderBy changes // REVIEW: maybe not needed in react query
      }));
    }
  }, [orderBy, search, setOptions, options]);

  function resetCursor() {
    setOptions((prev) => ({ ...prev, cursor: undefined }));
  }

  return (
    <NotesSearchContext.Provider
      value={{
        data,
        error,
        isFetching,
        isLoading,
        fetchNextPage,
        hasNextPage,
        search,
        updateSearch,
        resetCursor,
      }}
    >
      {props.children}
    </NotesSearchContext.Provider>
  );
}
