"use client";
import { SearchNoteDocument } from "@/gql/graphql";
import {
  CursorSearchOfListOfNote,
  SearchNoteQuery,
} from "@/gql/graphql.schema";
import gqlClient from "@/http/client";
import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

type Options = {
  cursor?: string | null;
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
  query: string;
  pageSize?: number;
};

type CursorType = string | null | undefined;

export default function useQuerySearchNote(opts: Options = { query: "" }) {
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
    SearchNoteQuery,
    Error,
    InfiniteData<SearchNoteQuery, CursorType>,
    string[],
    CursorType
  >({
    enabled: opts.query !== "",
    initialPageParam: undefined,
    queryKey: [
      "search-note",
      options.query || "",
      options.orderBy || "",
      options.direction || "",
    ],
    queryFn: async ({ pageParam }) =>
      gqlClient.request(SearchNoteDocument, {
        input: { ...options, cursor: pageParam },
      }),
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParams) =>
      lastPage.searchNote.cursor,
    getPreviousPageParam: (
      firstPage,
      allPages,
      firstPageParam,
      allPageParams
    ) => firstPage.searchNote.cursor,
  });

  const emptyData: CursorSearchOfListOfNote = {
    cursor: undefined,
    results: [],
  };
  const mergedData =
    data?.pages.reduce(
      (acc, currPage) => ({
        ...acc,
        cursor: currPage.searchNote.cursor,
        results: [...acc.results, ...currPage.searchNote.results],
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
