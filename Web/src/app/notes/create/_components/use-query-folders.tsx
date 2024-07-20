"use client";

import { OwnFoldersDocument } from "@/gql/graphql";
import useDoOnce from "@/hooks/use-do-once";
import gqlClient from "@/http/client";
import { notifyFatal } from "@/utils/toaster-notifications";
import { useQuery } from "@tanstack/react-query";

export default function useQueryFolders() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["own-folders"],
    queryFn: async () => gqlClient.request(OwnFoldersDocument, {}),
  });
  const tags = data?.ownFolders;

  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (!isLoading && error) {
    notifyErrorOnce();
  }

  return { data: tags, error, isLoading, refetch };
}
