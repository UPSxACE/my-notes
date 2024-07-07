"use client";

import { useOwnFoldersQuery } from "@/gql/graphql.schema";
import useDoOnce from "@/hooks/use-do-once";
import { notifyFatal } from "@/utils/toaster-notifications";

export default function useQueryFolders() {
  const { data, error, loading, refetch } = useOwnFoldersQuery();
  const allFolders = data?.ownFolders;

  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (!loading && error) {
    notifyErrorOnce();
  }

  return { data: allFolders, error, loading, refetch };
}
