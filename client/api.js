export async function getAllTodos() {
  const resp = await fetch("/list");
  return await resp.json();
}

export async function addTodo(text) {
  const resp = await fetch("/list-item", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  return await resp.text();
}

export async function updateTodo(id, text) {
  const resp = await fetch(`/list-item/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!resp.ok) {
    throw new Error(`Error updating todo: ${resp.statusText}`); 
  }
  return await resp.text();
}

export async function deleteTodo(id) {
  const resp = await fetch(`/list-item/${id}`, {
    method: "DELETE",
  });
  return await resp.text();
}
