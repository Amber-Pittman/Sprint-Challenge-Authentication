exports.up = async function(knex) {
  await knex.schema.createTable("users", (table) => {
    table.increments();

    table
      .string('username', 255)
      .notNullable()
      .unique();
      table.string('password', 255).notNullable();
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists("users");
};
