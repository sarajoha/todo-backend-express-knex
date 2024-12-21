exports.up = function (knex) {
  return knex.schema
    .createTable("users", function (table) {
      table.increments("id");
      table.string("name");
      table.string("email").unique().notNullable();
      table.timestamps(true, true);
    })
    .createTable("projects", function (table) {
      table.increments("id");
      table.string("name").notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users").dropTable("projects");
};
