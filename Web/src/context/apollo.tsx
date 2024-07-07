"use client";

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
  cache: new InMemoryCache(),
  link,
  credentials: "include",
});

export default function ApolloClientProvider(props: { children: ReactNode }) {
  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
