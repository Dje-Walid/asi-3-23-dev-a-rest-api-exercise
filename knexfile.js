import "dotenv/config"

export default {
  client: process.env.DB_CLIENT,
  connection: {
    port: process.env.DB_PORT,
    user: process.env.DB_CONNECTION_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_CONNECTION_DATABASE,
  },
  migrations: {
    directory: "./src/db/migrations",
    stub: "./src/db/migration.stub",
  },
  seeds: {
    directory: "./src/db/seeds",
  },
}
