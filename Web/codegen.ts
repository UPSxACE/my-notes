import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: process.env.GPL_SCHEMA_URL,
  documents: "src/**/*.{ts,tsx,gql,graphql}",
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
    },
    "src/gql/introspection.json": {
      plugins: ["introspection"],
    },
    "src/gql/graphql.schema.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
    },
  },
};

export default config;
