const _ = require("lodash");
const todos = require("./database/todo-queries.js");
const users = require("./database/user-queries.js");
const user_todos = require("./database/todo-user-queries.js");

/// Todo routes
function createToDo(req, data) {
  const protocol = req.protocol,
    host = req.get("host"),
    id = data.id;

  return {
    title: data.title,
    order: data.order,
    completed: data.completed || false,
    url: `${protocol}://${host}/${id}`,
  };
}

async function getAllTodos(req, res) {
  const allEntries = await todos.all();
  return res.send(allEntries.map(_.curry(createToDo)(req)));
}

async function getTodo(req, res) {
  const todo = await todos.get(req.params.id);
  return res.send(todo);
}

async function postTodo(req, res) {
  const created = await todos.create(req.body.title, req.body.order);
  return res.send(createToDo(req, created));
}

async function patchTodo(req, res) {
  const patched = await todos.update(req.params.id, req.body);
  return res.send(createToDo(req, patched));
}

async function deleteAllTodos(req, res) {
  const deletedEntries = await todos.clear();
  return res.send(deletedEntries.map(_.curry(createToDo)(req)));
}

async function deleteTodo(req, res) {
  const deleted = await todos.delete(req.params.id);
  return res.send(createToDo(req, deleted));
}

/// User routes
function createUser(req, data) {
  return {
    name: data.name,
    email: data.email,
  };
}

async function getAllUsers(req, res) {
  const allEntries = await users.all();
  return res.send(allEntries.map(_.curry(createUser)(req)));
}

async function getUser(req, res) {
  const user = await users.get(req.params.id);
  return res.send(user);
}

async function postUser(req, res) {
  const created = await users.create(req.body.name, req.body.email);
  return res.send(createUser(req, created));
}

// Assign and Unassign todos
function createUserTodo(req, data) {
  return {
    user_id: data.user_id,
    todo_id: data.todo_id,
  };
}

async function assignTodo(req, res) {
  const { todoId, userId } = req.params;
  const created = await user_todos.create(todoId, userId);
  return res.send(createUserTodo(req, created));
}

async function unassignTodo(req, res) {
  const { todoId, userId } = req.params;
  const deleted = await user_todos.del(todoId, userId);
  return res.send(createUserTodo(req, deleted));
}

/// Util
function addErrorReporting(func, message) {
  return async function (req, res) {
    try {
      return await func(req, res);
    } catch (err) {
      console.log(`${message} caused by: ${err}`);

      // Not always 500, but for simplicity's sake.
      res.status(500).send(`Opps! ${message}.`);
    }
  };
}

const toExport = {
  getAllTodos: {
    method: getAllTodos,
    errorMessage: "Could not fetch all todos",
  },
  getTodo: { method: getTodo, errorMessage: "Could not fetch todo" },
  postTodo: { method: postTodo, errorMessage: "Could not post todo" },
  patchTodo: { method: patchTodo, errorMessage: "Could not patch todo" },
  deleteAllTodos: {
    method: deleteAllTodos,
    errorMessage: "Could not delete all todos",
  },
  deleteTodo: { method: deleteTodo, errorMessage: "Could not delete todo" },
  /// users
  getAllUsers: {
    method: getAllUsers,
    errorMessage: "Could not fetch all users",
  },
  getUser: { method: getUser, errorMessage: "Could not fetch user" },
  postUser: { method: postUser, errorMessage: "Could not post user" },
  /// assign and unassign users to todos
  assignTodo: {
    method: assignTodo,
    errorMessage: "Could not assign Todo to User",
  },
  unassignTodo: {
    method: unassignTodo,
    errorMessage: "Could not unassign Todo to User",
  },
};

for (let route in toExport) {
  toExport[route] = addErrorReporting(
    toExport[route].method,
    toExport[route].errorMessage
  );
}

module.exports = toExport;
