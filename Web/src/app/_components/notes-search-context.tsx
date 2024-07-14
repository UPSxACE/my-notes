"use client";
import { CursorSearchOfListOfNote } from "@/gql/graphql.schema";
import { ApolloError } from "@apollo/client";
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
  fetchMore: () => void;
  loading: boolean;
  error?: ApolloError;
  endOfResults: boolean;
  search: string;
  updateSearch: (newSearch: string) => void;
};

const defaultValue: Context = {
  data: { cursor: null, results: [] },
  fetchMore: () => {},
  loading: true,
  endOfResults: false,
  search: "",
  updateSearch: (newSearch: string) => {},
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
    data = defaultValue.data,
    error,
    loading,
    fetchMore,
    endOfResults,
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
    setOptions((prev) => ({
      ...prev,
      query: search,
      ...orderByOptions,
      cursor: undefined, // cursor should be resetted when search or orderBy changes
    }));
  }, [orderBy, search, setOptions]);

  return (
    <NotesSearchContext.Provider
      value={{
        data,
        fetchMore,
        loading,
        error,
        endOfResults,
        search,
        updateSearch,
      }}
    >
      {props.children}
    </NotesSearchContext.Provider>
  );
}
