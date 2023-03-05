import hashPassword from "../db/hashPassword.js"
import UserModel from "../db/models/UserModel.js"
import validate from "../middlewares/validate.js"
import { sanitizeUser } from "../sanitizers.js"
import {
  firstNameValidator,
  lastNameValidator,
  emailValidator,
  passwordValidator,
  idValidator,
  limitValidator,
  offsetValidator,
  boolValidator,
} from "../validators.js"

const prepareUserRoutes = ({ app, db }) => {
  app.post(
    "/create-user",
    validate({
      body: {
        firstName: firstNameValidator.required(),
        lastName: lastNameValidator.required(),
        email: emailValidator.required(),
        password: passwordValidator.required(),
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { firstName, lastName, email, password, hasRight } = req.locals.body

      // IL faudrait mettre un if ici qui permet de voir si l'utilisateur a les droits
      // Cependant j'ai eu un soucis avec le middleware et le req.headers et je n'arrive
      // pas a récupérer qui fait quel appel api ni a valider son jwt

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const user = await UserModel.query().findOne({ email })

      if (user) {
        res.send({ result: "User already exist" })

        return
      }

      const [passwordHash, passwordSalt] = await hashPassword(password)

      await db("users").insert({
        firstName,
        lastName,
        email,
        passwordHash,
        passwordSalt,
      })

      res.send({ result: "User created" })
    }
  )

  app.get(
    "/get-users",
    validate({
      body: {
        limit: limitValidator.required(),
        offset: offsetValidator.required(),
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { limit, offset, hasRight } = req.locals.body

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const users = await UserModel.query()
        .orderBy("lastName")
        .limit(limit)
        .offset(offset)

      res.send({ result: sanitizeUser(users) })
    }
  )

  app.get(
    "/get-user/:userId",
    validate({
      params: { userId: idValidator.required() },
      body: {
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { hasRight } = req.locals.body
      const { userId } = req.locals.params

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const user = await UserModel.query().findById(userId)

      if (!user) {
        res.send({ result: "User doesn't exist" })

        return
      }

      res.send({ result: sanitizeUser(user) })
    }
  )

  app.patch(
    "/update-user/:userId",
    validate({
      params: { userId: idValidator.required() },
      body: {
        firstName: firstNameValidator,
        lastName: lastNameValidator,
        email: emailValidator,
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { firstName, lastName, email, hasRight } = req.locals.body
      const { userId } = req.locals.params

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const user = await UserModel.query().findById(userId)

      if (!user) {
        res.send({ result: "User doesn't exist" })

        return
      }

      const updatedUser = await UserModel.query().updateAndFetchById(userId, {
        ...(firstName ? { firstName } : {}),
        ...(lastName ? { lastName } : {}),
        ...(email ? { email } : {}),
      })

      res.send({ result: sanitizeUser(updatedUser) })
    }
  )

  app.delete(
    "/delete-user/:userId",
    validate({
      params: { userId: idValidator.required() },
      body: {
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { userId } = req.locals.params
      const { hasRight } = req.locals.body

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const user = await UserModel.query().findById(userId)

      if (!user) {
        res.send({ result: "User doesn't exist" })

        return
      }

      await UserModel.query().deleteById(userId)

      res.send({ result: "User deleted" })
    }
  )
}

export default prepareUserRoutes
