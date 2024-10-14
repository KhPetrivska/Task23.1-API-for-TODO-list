"use strict";
import { getAllTodos, addTodo, updateTodo, deleteTodo } from "/api.js"

const todoInputEl = document.querySelector(".todo-input");
const addBtnEl = document.querySelector(".add-todo-btn");
const todoListEl = document.querySelector(".todo-list");
let todoList = []; 

getAllTodos()
.then(list => {
  todoList.push(...list)
  todoList.forEach(todo => {
    createTodoItem (todo, todoListEl)
  })
})

function createTodoItem({text,  id }, parent) {
  const itemEl = document.createElement("li");
  itemEl.className = "todo-list-item";
  itemEl.id = id; 
  itemEl.innerHTML = `<span class="todo-list-item-text">${text}</span>
  <button class="edit-todo-btn">Edit</button>
  <button class="delete-todo-btn">Delete</button>`;

  parent.append(itemEl);
}



addBtnEl.addEventListener("click", async () => {
  const newTaskText = todoInputEl.value.trim(); 
  if (!newTaskText) {
    return;
  }

  const id = await addTodo(newTaskText)
  const newTask = {id, text: newTaskText }
  todoList.push(newTask)

  createTodoItem(newTask, todoListEl);
  todoInputEl.value = "";
});




todoListEl.addEventListener("click", async () => {
  event.stopPropagation();
  const target = event.target;
  const todoItemEl = target.closest(".todo-list-item"); 


  if (!todoItemEl) {
    return; 
  }


  const todoItem = todoList.find(task => task.id === todoItemEl.id);

  switch (target.className) {
    case "delete-todo-btn": {
      const taskText = todoItemEl.querySelector(
        ".todo-list-item-text"
      ).textContent;
      if (confirm(`Are you sure you want to delete task: ${taskText}?`)) {
        await deleteTodo(todoItem.id)
        todoItemEl.remove();
        todoList = todoList.filter(task => task.id !== todoItemEl.id); 
      }
      break;
    }



    case "edit-todo-btn": {
      const taskText = todoItemEl.querySelector(
        ".todo-list-item-text"
      ).textContent;
      todoItemEl.innerHTML = `<input class="todo-list-item-text" value="${taskText}" data-default-value="${taskText}"/>
<button class="save-todo-btn">Save</button>
<button class="cancel-todo-btn">Cancel</button>`;
      break;
    }
    case "save-todo-btn": {
      const updatedTaskText = target.previousElementSibling.value.trim();
  if (!updatedTaskText) {
    return;
  }

  const taskId = todoItemEl.id; // Make sure this is defined
  if (!taskId) {
    console.error('No task ID found for update');
    return;
  }
      await updateTodo(todoItemEl.id, updatedTaskText)
      todoItem.text = updatedTaskText; 
      todoItemEl.innerHTML = `<span class="todo-list-item-text">${updatedTaskText}</span>
<button class="edit-todo-btn">Edit</button>
<button class="delete-todo-btn">Delete</button>`;
      break;
    }
    case "cancel-todo-btn": {
      todoItemEl.innerHTML = `<span class="todo-list-item-text">${todoItem.text}</span>
<button class="edit-todo-btn">Edit</button>
<button class="delete-todo-btn">Delete</button>`;
      break;
    }
  }
});