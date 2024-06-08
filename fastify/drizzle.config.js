/** @type { import("drizzle-kit").Config } */
export default {
  schema: "./src/database",
  out: "./migrations",
  dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
  dbCredentials: {
    url: process.env.DB_CONNECTION_STRING,
  },
};
