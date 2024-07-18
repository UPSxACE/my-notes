import { ApolloError } from "@apollo/client";

export default function getGqlErrorMessage(
  apolloError: ApolloError
): string | null {
  const error: unknown =
    //@ts-ignore
    apolloError?.networkError?.result?.errors?.[0]?.message ||
    apolloError?.graphQLErrors?.[0]?.message;

  if (typeof error !== "string")
    console.log(JSON.stringify(apolloError, null, 2));

  return typeof error === "string" ? error : null;
}
