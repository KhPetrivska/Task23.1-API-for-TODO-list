const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const dbUrl = "mongodb+srv://kristinpetrivska:uD9SgHENyxeqSgYK@cluster23todolist.dggb9.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster23ToDoList";

// Connect to MongoDB and handle connection errors
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connected"))
  .catch(err => console.error("DB connection error:", err));

const db = mongoose.connection;

db.on("error", () => {
  console.log("DB Error");
});

db.once("open", () => {
  console.log("DB opened");
});

const app = express();

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, "../client")));
app.use(express.json());

// Serve index.html on root path
app.get("/", (req, res) => {
  const indexPath = path.join(__dirname, "../client/index.html");
  res.sendFile(indexPath);
});

// Serve index.js
app.get("/index.js", (req, res) => {
  const indexPath = path.join(__dirname, "../client/index.js");
  res.sendFile(indexPath);
});

// Serve styles.css
app.get("/styles.css", (req, res) => {
  const indexPath = path.join(__dirname, "../client/styles.css");
  res.sendFile(indexPath);
});

// Load the Todo model dynamically
let Todo;
const loadTodoModel = async () => {
  Todo = (await import('./Todo.mjs')).default;
};

loadTodoModel();

// GET all todo items
app.get("/list", (req, res) => {
  Todo.find()
    .then(todoList => res.send(todoList))
    .catch(err => {
      console.log('Error reading todo list', err);
      return res.status(500).send(err);
    });
});

// POST a new todo item
app.post("/list-item", (req, res) => {
  const { text } = req.body;
  
  // Validate the text field
  if (!text) {
    return res.status(400).send("Task text is required");
  }

  const todoItem = new Todo({
    text: text 
  });

  return todoItem.save()
    .then(todo => {
      console.log('Todo created', todo);
      return res.send(todo._id);
    })
    .catch(err => {
      console.log('Error creating todo list item', err);
      return res.status(500).send(err);
    });
});

// PUT to update an existing todo item
app.put("/list-item/:id", async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid ID");
  }
  
  try {
    const todo = await Todo.findByIdAndUpdate(new ObjectId(id), { text });
    if (!todo) {
      return res.status(404).send("Todo item not found");
    }
    console.log('Todo is updated', todo);
    return res.send(todo._id);
  } catch (err) {
    console.log('Error updating todo list item', err);
    return res.status(500).send(err);
  }
});

  
// DELETE a todo item
app.delete("/list-item/:id", async (req, res) => {
  const { id } = req.params;

  // Validate the ObjectId
  if (!ObjectId.isValid(id)) {
    return res.status(400).send("Invalid todo item ID");
  }

  try {
    const result = await Todo.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      return res.status(404).send("Todo item not found");
    }
    console.log("Todo was deleted", result);
    return res.send({ success: true });
  } catch (err) {
    console.log("Error deleting todo item", err);
    return res.status(500).send(err);
  }
});

// Set the server to listen on a specific port
const port = process.env.PORT || 5556;
const host = process.env.HOST || "localhost";

app.listen(port, host, () => {
  console.log(`Server started on ${host}:${port}`);
});