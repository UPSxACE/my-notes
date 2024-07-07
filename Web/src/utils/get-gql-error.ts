import { ApolloError } from "@apollo/client";

export default function getGqlErrorMessage(
  apolloError: ApolloError
): string | null {
  const error: unknown =
    //@ts-ignore
    apolloError?.networkError?.result?.errors?.[0]?.message;

  return typeof error === "string" ? error : null;
}
