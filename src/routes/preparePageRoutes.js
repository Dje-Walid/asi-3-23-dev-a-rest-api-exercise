import PageModel from "../db/models/PageModel.js"
import validate from "../middlewares/validate.js"
import { sanitizePage } from "../sanitizers.js"
import {
  titleValidator,
  urlSlugValidator,
  statusValidator,
  limitValidator,
  offsetValidator,
  idValidator,
  boolValidator,
} from "../validators.js"

const preparePageRoutes = ({ app, db }) => {
  app.post(
    "/create-page",
    validate({
      body: {
        title: titleValidator.required(),
        urlSlug: urlSlugValidator.required(),
        status: statusValidator.required(),
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { title, content, urlSlug, status, hasRight } = req.locals.body

      // IL faudrait mettre un if ici qui permet de voir si l'utilisateur a les droits
      // Cependant j'ai eu un soucis avec le middleware et le req.headers et je n'arrive
      // pas a récupérer qui fait quel appel api ni a valider son jwt

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const page = await PageModel.query().findOne({ urlSlug })

      if (page) {
        res.send({ result: "urlSlug already exist" })

        return
      }

      // A cause de mon soucis je considère que toutes les pages vont être modifié/crée par userId = 1
      const creatorId = 1
      const modifiedBy = 1

      await db("pages").insert({
        title,
        content,
        urlSlug,
        status,
        creatorId,
        modifiedBy,
      })

      res.send({ result: "Page created" })
    }
  )

  app.get(
    "/get-pages",
    validate({
      body: {
        limit: limitValidator.required(),
        offset: offsetValidator.required(),
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { limit, offset, hasRight } = req.locals.body

      // Même cas qu'au dessus mais j'ai ajouté hasRight pour simuler les droits

      if (!hasRight) {
        const pages = await PageModel.query()
          .where("status", "published")
          .orderBy("title")
          .limit(limit)
          .offset(offset)

        res.send({ result: sanitizePage(pages) })

        return
      }

      const pages = await PageModel.query()
        .orderBy("title")
        .limit(limit)
        .offset(offset)

      res.send({ result: sanitizePage(pages) })
    }
  )

  app.get(
    "/get-page/:pageId",
    validate({
      params: { pageId: idValidator.required() },
      body: {
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { hasRight } = req.locals.body
      const { pageId } = req.locals.params

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const page = await PageModel.query().findById(pageId)

      if (!page) {
        res.send({ result: "Page doesn't exist" })

        return
      }

      res.send({ result: sanitizePage(page) })
    }
  )

  app.patch(
    "/update-page/:pageId",
    validate({
      params: { pageId: idValidator.required() },
      body: {
        title: titleValidator,
        urlSlug: urlSlugValidator,
        status: statusValidator,
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { title, content, urlSlug, status, hasRight } = req.locals.body
      const { pageId } = req.locals.params

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const page = await PageModel.query().findById(pageId)

      if (!page) {
        res.send({ result: "Page doesn't exist" })

        return
      }

      const pageSlugNotUnique = await PageModel.query().findOne({ urlSlug })

      if (pageSlugNotUnique) {
        res.send({ result: "urlSlug already exist" })

        return
      }

      const updatedAt = new Date()

      const updatedPage = await PageModel.query().updateAndFetchById(pageId, {
        ...(title ? { title } : {}),
        ...(content ? { content } : {}),
        ...(urlSlug ? { urlSlug } : {}),
        ...(status ? { status } : {}),
        ...(updatedAt ? { updatedAt } : {}),
      })

      res.send({ result: sanitizePage(updatedPage) })
    }
  )

  app.delete(
    "/delete-page/:pageId",
    validate({
      params: { pageId: idValidator.required() },
      body: {
        hasRight: boolValidator.required(),
      },
    }),
    async (req, res) => {
      const { pageId } = req.locals.params
      const { hasRight } = req.locals.body

      // Même cas qu'au dessus

      if (!hasRight) {
        res.send({ result: "You don't have the right to do this" })

        return
      }

      const page = await PageModel.query().findById(pageId)

      if (!page) {
        res.send({ result: "Page doesn't exist" })

        return
      }

      await PageModel.query().deleteById(pageId)

      res.send({ result: "Page deleted" })
    }
  )
}

export default preparePageRoutes
