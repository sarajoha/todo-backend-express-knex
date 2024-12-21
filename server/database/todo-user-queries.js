const knex = require("./connection.js");

async function create(todo_id, user_id) {
  const results = await knex("todo_users")
    .insert({ todo_id, user_id })
    .returning("*");
  return results[0];
}

async function del(todo_id, user_id) {
  const results = await knex("todo_users")
    .where({ todo_id, user_id })
    .del()
    .returning("*");
  return results[0];
}

module.exports = {
  create,
  del,
};
