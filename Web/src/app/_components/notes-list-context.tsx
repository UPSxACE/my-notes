"use client";
import { PathNodes } from "@/gql/graphql";
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
import useQueryNavigate from "./use-query-navigate";

type Context = {
  data: PathNodes;
  fetchMore: () => void;
  loading: boolean;
  error?: ApolloError;
  endOfResults: boolean;
  path?: string;
  updatePath: (newPath: string) => void;
  orderBy?: OrderBy;
  updateOrderBy: (newOrder: OrderBy) => void;
  resetCursor: () => void;
};

const defaultValue: Context = {
  data: { cursor: null, folders: [], notes: [] },
  fetchMore: () => {},
  loading: true,
  endOfResults: false,
  updatePath: (newPath: string) => {},
  updateOrderBy: (newOrder: OrderBy) => {},
  resetCursor: () => {},
};

export const NotesListContext = createContext<Context>(defaultValue);

export default function NotesListContextProvider(props: {
  children: Readonly<ReactNode>;
}) {
  const searchParams = useSearchParams();
  const path = searchParams.get("path") || undefined;
  const orderBy = (searchParams.get("order") as OrderBy) || OrderBy.LatestFirst;

  const orderByOptionsInitial = useRef({ path, ...enumToOptions(orderBy) });
  const {
    data = defaultValue.data,
    error,
    loading,
    fetchMore,
    endOfResults,
    options,
    setOptions,
  } = useQueryNavigate(orderByOptionsInitial.current);

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

  function updatePath(newPath: string) {
    router.push(`${pathname}?${createQueryString("path", newPath)}`);
  }

  function updateOrderBy(newOrder: OrderBy) {
    router.push(`${pathname}?${createQueryString("order", newOrder)}`);
  }

  useEffect(() => {
    const orderByOptions = enumToOptions(orderBy);
    if (
      orderByOptions.direction !== options.direction ||
      orderByOptions.orderBy !== options.orderBy ||
      path !== options.path
    )
      setOptions((prev) => ({
        ...prev,
        path,
        ...orderByOptions,
        cursor: undefined, // cursor should be resetted when path or orderBy changes
      }));
  }, [path, orderBy, setOptions, options]);

  function resetCursor() {
    setOptions((prev) => ({ ...prev, cursor: undefined }));
  }

  return (
    <NotesListContext.Provider
      value={{
        data,
        fetchMore,
        loading,
        error,
        endOfResults,
        path,
        updatePath,
        orderBy,
        updateOrderBy,
        resetCursor,
      }}
    >
      {props.children}
    </NotesListContext.Provider>
  );
}
