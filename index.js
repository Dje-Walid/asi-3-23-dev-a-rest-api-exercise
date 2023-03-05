import cors from "cors"
import express from "express"
import knex from "knex"
import morgan from "morgan"
import config from "./src/config.js"
import BaseModel from "./src/db/models/BaseModel.js"
import prepareRoutes from "./src/prepareRoutes.js"

const db = knex(config.db)

BaseModel.knex(db)

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.use((req, res, next) => {
  req.locals = {}

  next()
})

prepareRoutes({ app, db })

app.listen(config.port)
