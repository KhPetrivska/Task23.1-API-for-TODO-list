const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const taskSchema = new Schema({
  task: String,
  completed: Boolean,
});
const Task = model("Task", taskSchema);

const tasks = [{ task: "Task 1" }, { task: "Task 2" }];

tasks.forEach(async (t) => {
  try {
    const task = await Task.findOne({ task: t.task });
    if (task) {
      console.log("Task was added before");
      return;
    }
    const taskEntry = new Task({
      task: t.task,
      completed: true,
    });
    await taskEntry.save();
    console.log("Task has been added");
  } catch (err) {
    console.log("Cannot save task", err);
  }
});

module.exports = Task;
