"use client";
import {
  CursorSearchOfListOfNote,
  useSearchNoteLazyQuery,
} from "@/gql/graphql.schema";
import useDoOnce from "@/hooks/use-do-once";
import { notifyFatal } from "@/utils/toaster-notifications";
import { useEffect, useState } from "react";

type Options = {
  cursor?: string | null;
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
  query: string;
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

  function _fetchMore() {
    if (endOfResults) return;
    if (options.query === "") return;

    if (!called) {
      // NOTE: despite this being here, this will probably never happen
      console.log("!called situation happened");
      fetch({
        variables: {
          input: options,
        },
      });
    }

    if (called) {
      fetchMore({
        variables: {
          input: options,
        },
      });
    }
  }

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
