import { useOwnNoteTagsQuery } from "@/gql/graphql.schema";
import useDoOnce from "@/hooks/use-do-once";
import { notifyFatal } from "@/utils/toaster-notifications";

export default function useQueryTags() {
  const { data, error, loading, refetch } = useOwnNoteTagsQuery();
  const tags = data?.ownNoteTags;

  const notifyErrorOnce = useDoOnce(() => notifyFatal());

  if (!loading && error) {
    notifyErrorOnce();
  }

  return { data: tags, error, loading, refetch };
}
