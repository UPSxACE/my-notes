"use client";
import { PathNodes } from "@/gql/graphql";
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
  error: Error | null;
  isFetching: boolean;
  isLoading: boolean;
  fetchNextPage: () => Promise<any>;
  hasNextPage: boolean;
  path?: string;
  updatePath: (newPath: string) => void;
  orderBy?: OrderBy;
  updateOrderBy: (newOrder: OrderBy) => void;
};

const defaultValue: Context = {
  data: { cursor: null, folders: [], notes: [] },
  error: null,
  isFetching: true,
  isLoading: true,
  fetchNextPage: async () => {},
  hasNextPage: false,
  updatePath: (newPath: string) => {},
  updateOrderBy: (newOrder: OrderBy) => {},
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
    data,
    error,
    isFetching,
    isLoading,
    fetchNextPage,
    hasNextPage,
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
        // cursor: undefined, // cursor should be resetted when path or orderBy changes // REVIEW: maybe not needed in react query
      }));
  }, [path, orderBy, setOptions, options]);

  // FIXME
  // function resetCursor() {
  //   setOptions((prev) => ({ ...prev, cursor: undefined }));
  // }

  return (
    <NotesListContext.Provider
      value={{
        data,
        error,
        isFetching,
        isLoading,
        fetchNextPage,
        hasNextPage,
        path,
        updatePath,
        orderBy,
        updateOrderBy,
      }}
    >
      {props.children}
    </NotesListContext.Provider>
  );
}
