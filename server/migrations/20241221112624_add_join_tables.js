exports.up = function (knex) {
  return knex.schema
    .createTable("project_users", function (table) {
      table.increments("id");
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("project_id")
        .unsigned()
        .references("id")
        .inTable("projects")
        .onDelete("CASCADE");
      table.timestamps(true, true);
      table.unique(["user_id", "project_id"]);
    })
    .createTable("todo_users", function (table) {
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("CASCADE");
      table
        .integer("todo_id")
        .unsigned()
        .references("id")
        .inTable("todos")
        .onDelete("CASCADE");
      table.timestamps(true, true);
      table.unique(["user_id", "todo_id"]);
    })
    .createTable("comments", function (table) {
      table.increments("id");
      table.text("text").notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("id")
        .inTable("users")
        .onDelete("SET NULL");
      table
        .integer("todo_id")
        .unsigned()
        .references("id")
        .inTable("todos")
        .onDelete("CASCADE");
      table.timestamps(true, true);
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable("comments")
    .dropTable("todo_users")
    .dropTable("project_users");
};
