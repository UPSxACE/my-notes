import { OwnNoteTagsDocument } from "@/gql/graphql";
import useDoOnce from "@/hooks/use-do-once";
import gqlClient from "@/http/client";
import { notifyFatal } from "@/utils/toaster-notifications";
import { useQuery } from "@tanstack/react-query";

export default function useQueryTags() {
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["own-note-tags"],
    queryFn: async () => gqlClient.request(OwnNoteTagsDocument, {}),
  });
  const tags = data?.ownNoteTags;

  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (!isLoading && error) {
    notifyErrorOnce();
  }

  return { data: tags, error, isLoading, refetch };
}
