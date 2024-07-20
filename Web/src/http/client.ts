import { GraphQLClient } from "graphql-request";

// Graphql base url
const baseUrl = process.env.NEXT_PUBLIC_API_URL + "/graphql";
const gqlClient = new GraphQLClient(baseUrl, {
  credentials: "include",
});

export default gqlClient;
