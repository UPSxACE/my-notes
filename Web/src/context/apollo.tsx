"use client";

import { NavigateInput, PathNodes } from "@/gql/graphql";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { ReactNode } from "react";

const link = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL + "/graphql",
  credentials: "include",
});

const client = new ApolloClient({
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          navigate: {
            keyArgs: ["input", ["path", "orderBy", "direction"]], // REVIEW
            merge: (
              existing: PathNodes = { folders: [], notes: [] },
              incoming: PathNodes,
              { args }: { [key: string]: any; args: NavigateInput | null }
            ) => {
              return {
                cursor: incoming.cursor,
                folders: [...existing.folders, ...incoming.folders],
                notes: [...existing.notes, ...incoming.notes],
              };
            },
          },
        },
      },
    },
  }),
  link,
  credentials: "include",
});

export default function ApolloClientProvider(props: { children: ReactNode }) {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
