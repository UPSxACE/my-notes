"use client";
import { PathNodes } from "@/gql/graphql";
import { ApolloError } from "@apollo/client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, createContext, useCallback, useEffect } from "react";
import useQueryNavigate from "./use-query-navigate";

export enum OrderBy {
  LatestFirst = "latest_first",
  OldestFirst = "oldest_first",
  TitleAZ = "title_az",
  TitleZA = "title_za",
  HighestPriority = "highest_prio",
  LowestPriority = "lowest_prio",
  MostViews = "most_views",
  LeastViews = "least_views",
}

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
};

const defaultValue: Context = {
  data: { cursor: null, folders: [], notes: [] },
  fetchMore: () => {},
  loading: true,
  endOfResults: false,
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

  function updateOrderBy(newOrder: OrderBy) {
    router.push(`${pathname}?${createQueryString("order", newOrder)}`);
  }

  useEffect(() => {
    // setOptions((prev) => ({ ...prev, path }));

    switch (orderBy) {
      case OrderBy.TitleAZ:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "title",
          direction: "asc",
        }));
      case OrderBy.TitleZA:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "title",
          direction: "desc",
        }));
      case OrderBy.HighestPriority:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "priority",
          direction: "desc",
        }));
      case OrderBy.LowestPriority:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "priority",
          direction: "asc",
        }));
      case OrderBy.MostViews:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "views",
          direction: "desc",
        }));
      case OrderBy.LeastViews:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "views",
          direction: "asc",
        }));
      case OrderBy.OldestFirst:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "createdat",
          direction: "asc",
        }));
      default:
        return setOptions((prev) => ({
          ...prev,
          path,
          orderBy: "createdat",
          direction: "desc",
        }));
    }
  }, [path, orderBy, setOptions]);

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
      }}
    >
      {props.children}
    </NotesListContext.Provider>
  );
}
