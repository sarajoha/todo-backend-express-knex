const app = require("./server-config.js");
const routes = require("./server-routes.js");

const port = process.env.PORT || 5000;

/// Todos
app.get("/todos/", routes.getAllTodos);
app.get("/todos/:id", routes.getTodo);

app.post("/todos/", routes.postTodo);
app.patch("/todos/:id", routes.patchTodo);

app.delete("/todos/", routes.deleteAllTodos);
app.delete("/todos/:id", routes.deleteTodo);

/// Users
app.get("/users/", routes.getAllUsers);
app.get("/users/:id", routes.getUser);

app.post("/users/", routes.postUser);

/// Assign todos
app.post("/todos/:todoId/users/:userId/", routes.assignTodo);
app.delete("/todos/:todoId/users/:userId/", routes.unassignTodo);

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => console.log(`Listening on port ${port}`));
}

module.exports = app;
