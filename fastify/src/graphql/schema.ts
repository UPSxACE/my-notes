import { gql } from "mercurius-codegen";

const schema = gql`
  type Query {
    hello(name: String!): String!
  }

  input CreateUserInput {
    username: String!
    fullName: String!
    email: String!
    password: String!
  }

  type Mutation {
    createUser(data: CreateUserInput!): Boolean!
  }
`;

export default schema;
