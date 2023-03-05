export const up = async (knex) => {
  await knex.schema.createTable("roles", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.integer("permission").notNullable()
  })
  await knex.schema.createTable("users", (table) => {
    table.increments("id")
    table.text("firstName").notNullable()
    table.text("lastName").notNullable()
    table.text("email").notNullable().unique()
    table.text("passwordHash").notNullable()
    table.text("passwordSalt").notNullable()
    table.integer("roleId").references("id").inTable("roles")
  })
  await knex.schema.createTable("pages", (table) => {
    table.increments("id")
    table.text("title").notNullable()
    table.text("content").notNullable()
    table.text("urlSlug").notNullable().unique()
    table.timestamps(true, true, true)
    table.text("status").notNullable()
    table.integer("creatorId").notNullable().references("id").inTable("users")
    table.integer("modifiedBy").notNullable().references("id").inTable("users")
  })
  await knex.schema.createTable("navigationMenu", (table) => {
    table.increments("id")
    table.text("name").notNullable()
    table.text("path").notNullable()
  })
}

export const down = async (knex) => {
  await knex.schema.dropTable("navigationMenu")
  await knex.schema.dropTable("pages")
  await knex.schema.dropTable("users")
  await knex.schema.dropTable("roles")
}
