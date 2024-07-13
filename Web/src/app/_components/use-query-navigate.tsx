import { useNavigateQuery } from "@/gql/graphql.schema";
import useDoOnce from "@/hooks/use-do-once";
import { notifyFatal } from "@/utils/toaster-notifications";
import { useEffect, useState } from "react";

type Options = {
  cursor?: string | null;
  direction?: "asc" | "desc";
  orderBy?: "createdat" | "priority" | "views" | "title";
  path?: string;
};

export default function useQueryNavigate(opts: Options = {}) {
  const [options, setOptions] = useState({ pageSize: 16, ...opts });
  const { data, error, loading, refetch, fetchMore } = useNavigateQuery({
    variables: { input: options },
    onCompleted: (a) => {
      console.log("next fetch with:", a.navigate.cursor);
    },
  });

  // FIXME: test the behavior of cursors when changing the orderBy type to see if its truly working
  // (probably yes because cursor is set on useEffect, and useEffect is triggered after the query?)
  // (may still be a problem for cursors that should have been fetched already, or maybe not because of apollo cache?)
  useEffect(() => {
    console.log(data?.navigate.cursor);
    // REVIEW: maybe this is good enough, lets hope so.
    setOptions((prev) => ({ ...prev, cursor: data?.navigate.cursor }));
  }, [data]);

  const result = data?.navigate;
  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (!loading && error) {
    notifyErrorOnce();
  }

  const endOfResults = !loading && !result?.cursor;

  function _fetchMore() {
    if (endOfResults) return;
    fetchMore({
      variables: {
        input: options,
      },
    });
    // REVIEW: test this with 3+ pages. maybe its needed, maybe its not
    // .then((res) => {
    //   setOptions((prev) => ({ ...prev, cursor: res.data.navigate.cursor }));
    // });
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
