import { useNavigateQuery } from "@/gql/graphql.schema";
import useDoOnce from "@/hooks/use-do-once";
import { notifyFatal } from "@/utils/toaster-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";

type Options = {
  cursor?: string | null;
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
  path?: string;
  pageSize?: number;
};

export default function useQueryNavigate(opts: Options = {}) {
  const [fetchingMore, setFetchingMore] = useState(false);
  const [options, setOptions] = useState({ pageSize: 16, ...opts });
  const { data, error, loading, refetch, fetchMore, networkStatus } =
    useNavigateQuery({
      variables: { input: options },
      notifyOnNetworkStatusChange: true,
    });

  useEffect(() => {
    console.log("RECEIVED DATA");
    // console.log("next fetch with:", data?.navigate.cursor);
    setOptions((prev) => ({ ...prev, cursor: data?.navigate.cursor }));
  }, [data]);

  const result = data?.navigate;
  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (!loading && error) {
    notifyErrorOnce();
  }

  const endOfResults = !loading && !result?.cursor;

  // REVIEW: the options was causing a lot of rerenders, specially because it was a dependency of
  // _fetchMore, and _fetchMore was only rerendering because of it.
  // That issue was causing apollo to do the same query multiple times.
  // This memoization might have fixed it, but it needs to be more carefully tested.
  const memoizedOptions: Options = useMemo(
    () => ({
      cursor: options.cursor,
      direction: options.direction,
      orderBy: options.orderBy,
      pageSize: options.pageSize,
      path: options.path,
    }),
    [
      options.cursor,
      options.direction,
      options.orderBy,
      options.pageSize,
      options.path,
    ]
  );

  const _fetchMore = useCallback(async () => {
    if (endOfResults) return;
    setFetchingMore(true);
    // console.log("fetch more with: ", options.cursor);
    await fetchMore({
      variables: {
        input: memoizedOptions,
      },
    }).finally(() => {
      setFetchingMore(false);
    });
    // REVIEW: test this with 3+ pages. maybe its needed, maybe its not
    // .then((res) => {
    //   setOptions((prev) => ({ ...prev, cursor: res.data.navigate.cursor }));
    // });
  }, [endOfResults, memoizedOptions, fetchMore]);

  const fetching = fetchingMore || (networkStatus !== 7 && networkStatus !== 8);

  return {
    data: result,
    error,
    loading: networkStatus === 1,
    refetch,
    fetchMore: _fetchMore,
    endOfResults,
    options,
    setOptions, //TODO ? cache cursor
    fetching,
  };
}
