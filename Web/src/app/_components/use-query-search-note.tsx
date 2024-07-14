"use client";
import {
  CursorSearchOfListOfNote,
  useSearchNoteLazyQuery,
} from "@/gql/graphql.schema";
import useDoOnce from "@/hooks/use-do-once";
import { notifyFatal } from "@/utils/toaster-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";

type Options = {
  cursor?: string | null;
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
  query: string;
  pageSize?: number;
};

export default function useQuerySearchNote(opts: Options = { query: "" }) {
  const [options, setOptions] = useState({ pageSize: 16, ...opts });
  const [fetch, { data, error, loading, refetch, fetchMore, called }] =
    useSearchNoteLazyQuery({
      variables: { input: options },
    });

  useEffect(() => {
    if (options.query !== "" && !called) fetch();
  }, [options, called, fetch]);

  useEffect(() => {
    if (called) {
      // REVIEW: maybe this is good enough, lets hope so.
      setOptions((prev) => ({ ...prev, cursor: data?.searchNote.cursor }));
    }
  }, [data, called]);

  // if query is empty, results should be empty array
  const result: CursorSearchOfListOfNote =
    options.query !== "" && data
      ? data.searchNote
      : { cursor: null, results: [] };
  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (!loading && error) {
    notifyErrorOnce();
  }

  const endOfResults = !loading && !result?.cursor;

  const memoizedOptions: Options = useMemo(
    () => ({
      cursor: options.cursor,
      direction: options.direction,
      orderBy: options.orderBy,
      pageSize: options.pageSize,
      query: options.query,
    }),
    [
      options.cursor,
      options.direction,
      options.orderBy,
      options.pageSize,
      options.query,
    ]
  );

  const _fetchMore = useCallback(() => {
    if (endOfResults) return;
    if (memoizedOptions.query === "") return;

    if (!called) {
      // NOTE: despite this being here, this will probably never happen
      console.log("!called situation happened");
      fetch({
        variables: {
          input: memoizedOptions,
        },
      });
    }

    if (called) {
      fetchMore({
        variables: {
          input: memoizedOptions,
        },
      });
    }
  }, [endOfResults, called, memoizedOptions, fetch, fetchMore]);

  return {
    data: result,
    error,
    loading,
    refetch,
    fetchMore: _fetchMore,
    endOfResults,
    setOptions, //TODO ? cache cursor
  };
}
