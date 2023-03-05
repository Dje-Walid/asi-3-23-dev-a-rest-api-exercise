import hashPassword from "../hashPassword.js"

export const seed = async (knex) => {
  await knex("navigationMenu").del()
  await knex("pages").del()
  await knex("users").del()
  await knex("roles").del()

  const FLAGS = {
    EDITOR: 1,
    MANAGER: 2,
    ADMIN: 4,
  }

  await knex("roles").insert([
    {
      id: 1,
      name: "admin",
      permission: FLAGS.ADMIN,
    },
    {
      id: 2,
      name: "manager",
      permission: FLAGS.MANAGER,
    },
    {
      id: 3,
      name: "editor",
      permission: FLAGS.EDITOR,
    },
  ])

  const password = "superAdmin"

  const [passwordHash, passwordSalt] = await hashPassword(password)

  await knex("users").insert([
    {
      id: 1,
      firstName: "super",
      lastName: "admin",
      email: "admin@admin.fr",
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      roleId: 1,
    },
  ])
}
