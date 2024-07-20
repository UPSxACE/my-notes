import { NavigateDocument } from "@/gql/graphql";
import { NavigateQuery, PathNodes } from "@/gql/graphql.schema";
import gqlClient from "@/http/client";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

type Options = {
  cursor?: string | null;
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
  path?: string;
  pageSize?: number;
};

type CursorType = string | null | undefined;

export default function useQueryNavigate(opts: Options = {}) {
  const [options, setOptions] = useState({ pageSize: 16, ...opts });
  const {
    data,
    error,
    isFetching,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery<
    NavigateQuery,
    Error,
    InfiniteData<NavigateQuery, CursorType>,
    string[],
    CursorType
  >({
    initialPageParam: undefined,
    queryKey: [
      "navigate",
      options.path || "",
      options.orderBy || "",
      options.direction || "",
    ],
    queryFn: async ({ pageParam }) =>
      gqlClient.request(NavigateDocument, {
        input: { ...options, cursor: pageParam },
      }),
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.navigate.cursor,
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => firstPage.navigate.cursor,
  });

  const emptyData: PathNodes = { folders: [], notes: [], cursor: undefined };
  const mergedData =
    data?.pages.reduce(
      (acc, currPage) => ({
        ...acc,
        cursor: currPage.navigate.cursor,
        folders: [...acc.folders, ...currPage.navigate.folders],
        notes: [...acc.notes, ...currPage.navigate.notes],
      }),
      emptyData
    ) || emptyData;

  return {
    data: mergedData,
    error,
    isFetching,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    options,
    setOptions,
  };
}
