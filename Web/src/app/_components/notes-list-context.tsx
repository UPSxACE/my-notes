"use client";
import { PathNodes } from "@/gql/graphql";
import { ApolloError } from "@apollo/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, createContext, useCallback, useEffect } from "react";
import useQueryNavigate from "./use-query-navigate";

type Context = {
  data: PathNodes;
  fetchMore: () => void;
  loading: boolean;
  error?: ApolloError;
  endOfResults: boolean;
  updatePath: (newPath: string) => void;
};

const defaultValue: Context = {
  data: { cursor: null, folders: [], notes: [] },
  fetchMore: () => {},
  loading: true,
  endOfResults: false,
  updatePath: (newPath: string) => {},
};

export const NotesListContext = createContext<Context>(defaultValue);

export default function NotesListContextProvider(props: {
  children: Readonly<ReactNode>;
}) {
  const searchParams = useSearchParams();
  const path = searchParams.get("path") || undefined;

  const {
    data = defaultValue.data,
    error,
    loading,
    fetchMore,
    endOfResults,
    setOptions,
  } = useQueryNavigate({ path });

  const router = useRouter();
  const pathname = usePathname();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  function updatePath(newPath: string) {
    router.push(`${pathname}?${createQueryString("path", newPath)}`);
  }

  useEffect(() => {
    setOptions((prev) => ({ ...prev, path }));
  }, [path, setOptions]);

  return (
    <NotesListContext.Provider
      value={{ data, fetchMore, loading, error, endOfResults, updatePath }}
    >
      {props.children}
    </NotesListContext.Provider>
  );
}
