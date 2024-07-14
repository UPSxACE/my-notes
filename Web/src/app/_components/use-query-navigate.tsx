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
  });

  useEffect(() => {
    // console.log("next fetch with:", data?.navigate.cursor);
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
    // console.log("fetch more with: ", options.cursor);
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
