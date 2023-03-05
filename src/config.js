import "dotenv/config"

const config = {
  port: process.env.PORT,
  db: {
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
  },
  security: {
    jwt: {
      secret: process.env.SECURITY_SESSION_JWT_SECRET,
      options: {
        expiresIn: "1 day",
      },
    },
    password: {
      saltLen: 128,
      keylen: 128,
      iterations: 10000,
      digest: "sha512",
      pepper: process.env.PASSWORD_PEPPER,
    },
  },
}

export default config
