const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 5001;

app.use(cors({ origin: "http://127.0.0.1:5501" }));
app.use(bodyParser.json());

const SECRET_KEY = "birat059";

let users = [];
let todos = [];

const generateToken = (username) => {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
};

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send("Unauthorized");

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.username = decoded.username;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

app.post("/auth/signup", async (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  return res.status(201).json({ message: "User registered successfully" });
});

app.post("/auth/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(username);
  return res.json({ token });
});

app.get("/todos", authenticate, (req, res) => {
  const { page = 1, pageSize = 5 } = req.query;
  const userTodos = todos.filter((todo) => todo.username === req.username);
  const startIndex = (page - 1) * pageSize;
  const paginatedTodos = userTodos.slice(startIndex, startIndex + pageSize);

  return res.json({
    todos: paginatedTodos,
    total: userTodos.length,
  });
});

app.post("/todos", authenticate, (req, res) => {
  const { text } = req.body;
  const newTodo = {
    id: Date.now(),
    username: req.username,
    text,
    completed: false,
  };
  todos.push(newTodo);
  return res.status(201).json(newTodo);
});

app.put("/todos/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const todo = todos.find((t) => t.id == id && t.username === req.username);
  if (!todo) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todo.completed = completed;
  return res.json(todo);
});

app.patch("/todos/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  const todo = todos.find(todo => todo.id == id);

  if (!todo) {
    return res.status(404).json({ message: "To-Do not found" });
  }

  todo.text = text;
  res.status(200).json(todo);
});

app.delete("/todos/:id", authenticate, (req, res) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex((t) => t.id == id && t.username === req.username);

  if (todoIndex === -1) {
    return res.status(404).json({ message: "Todo not found" });
  }

  todos.splice(todoIndex, 1);
  return res.status(204).send();
});

app.listen(PORT, 'localhost', () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
