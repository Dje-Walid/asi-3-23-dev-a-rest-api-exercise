import NavigationMenuModel from "../db/models/NavigationMenuModel.js"
import validate from "../middlewares/validate.js"
import { sanitizeMenu } from "../sanitizers.js"
import {
  pathValidator,
  nameValidator,
  boolValidator,
  limitValidator,
  offsetValidator,
  idValidator,
} from "../validators.js"

const prepareNavigationMenuRoutes = ({ app, db }) => {
  app.post(
    "/create-menu",
    validate({
      body: {
        name: nameValidator.required(),
        path: pathValidator.required(),
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { name, path, hasRight } = req.locals.body

      // IL faudrait mettre un if ici qui permet de voir si l'utilisateur a les droits
      // Cependant j'ai eu un soucis avec le middleware et le req.headers et je n'arrive
      // pas a récupérer qui fait quel appel api ni a valider son jwt

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      await db("navigationMenu").insert({
        name,
        path,
      })

      res.send({ result: "Menu created" })
    }
  )

  app.get(
    "/get-menus",
    validate({
      body: {
        limit: limitValidator.required(),
        offset: offsetValidator.required(),
      },
    }),
    async (req, res) => {
      const { limit, offset } = req.locals.body

      const menus = await NavigationMenuModel.query()
        .orderBy("name")
        .limit(limit)
        .offset(offset)

      res.send({ result: sanitizeMenu(menus) })
    }
  )

  app.get(
    "/get-menu/:menuId",
    validate({
      params: { menuId: idValidator.required() },
      body: {
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { hasRight } = req.locals.body
      const { menuId } = req.locals.params

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const menu = await NavigationMenuModel.query().findById(menuId)

      if (!menu) {
        res.send({ result: "This Menu doesn't exist" })

        return
      }

      res.send({ result: sanitizeMenu(menu) })
    }
  )

  app.patch(
    "/update-menu/:menuId",
    validate({
      params: { menuId: idValidator.required() },
      body: {
        name: nameValidator,
        path: pathValidator,
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { name, path, hasRight } = req.locals.body
      const { menuId } = req.locals.params

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const menu = await NavigationMenuModel.query().findById(menuId)

      if (!menu) {
        res.send({ result: "This Menu doesn't exist" })

        return
      }

      const updatedMenu = await NavigationMenuModel.query().updateAndFetchById(
        menuId,
        {
          ...(name ? { name } : {}),
          ...(path ? { path } : {}),
        }
      )

      res.send({ result: sanitizeMenu(updatedMenu) })
    }
  )

  app.delete(
    "/delete-menu/:menuId",
    validate({
      params: { menuId: idValidator.required() },
      body: {
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { menuId } = req.locals.params
      const { hasRight } = req.locals.body

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const page = await NavigationMenuModel.query().findById(menuId)

      if (!page) {
        res.send({ result: "This Menu doesn't exist" })

        return
      }

      await NavigationMenuModel.query().deleteById(menuId)

      res.send({ result: "Menu deleted" })
    }
  )
}

export default prepareNavigationMenuRoutes
