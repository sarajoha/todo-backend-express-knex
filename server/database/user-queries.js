const knex = require("./connection.js");

async function all() {
  return knex("users");
}

async function get(id) {
  const results = await knex("users").where({ id });
  return results[0];
}

async function create(name, email) {
  const results = await knex("users").insert({ name, email }).returning("*");
  return results[0];
}

module.exports = {
  all,
  get,
  create,
};
