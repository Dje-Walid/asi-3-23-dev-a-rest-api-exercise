import * as yup from "yup"

// generic
export const boolValidator = yup.bool().default(true)
export const stringValidator = yup.string()

export const idValidator = yup.number().integer().min(1)

// pages
export const titleValidator = yup.string().min(1).max(300)

export const urlSlugValidator = yup.string().min(1)

export const statusValidator = yup
  .string()
  .lowercase()
  .oneOf(["draft", "published"])

// users
export const firstNameValidator = yup.string().min(1)

export const lastNameValidator = yup.string().min(1)

export const emailValidator = yup.string().email()

export const passwordValidator = yup.string().min(8)

// navigation menu
export const nameValidator = yup.string().min(1)

export const pathValidator = yup.string().min(1)

// collection (pagination, order, etc.)
export const limitValidator = yup.number().integer().min(1).default(100)

export const offsetValidator = yup.number().integer().min(0).default(0)
