import { AppError } from "../errors.js"

const handleError = (err, req, res) => {
  if (!(err instanceof AppError)) {
    res.send({ error: ["Oops. Something went wrong."], errorCode: "error" })

    return
  }

  res.status(err.httpCode).send({ error: err.errors, errorCode: err.errorCode })
}

export default handleError
