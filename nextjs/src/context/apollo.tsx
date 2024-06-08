"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { ReactNode } from "react";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL + "/graphql",
  cache: new InMemoryCache(),
  credentials: "include",
});

export default function ApolloClientProvider(props: { children: ReactNode }) {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
