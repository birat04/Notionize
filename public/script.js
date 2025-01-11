const apiUrl = "http://localhost:5001"; 
let authToken = localStorage.getItem("authToken") || null;

document.addEventListener("DOMContentLoaded", () => {
  if (authToken) {
    showTodoContainer();
    fetchTodos();
  }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch(`${apiUrl}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      alert('Sign up successful!');
      document.getElementById("signupForm").reset();
    } else {
      alert('Sign up failed! Please try again.');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

document.getElementById('signinForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signinUsername').value;
  const password = document.getElementById('signinPassword').value;

  try {
    const response = await fetch(`${apiUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      authToken = data.token; 
      localStorage.setItem("authToken", authToken);
      alert('Sign in successful!');
      showTodoContainer();
      fetchTodos();
      document.getElementById('signinForm').reset();
    } else {
      alert('Sign in failed! Check your username and password.');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

function showTodoContainer() {
  document.getElementById('todoContainer').style.display = 'block';
  document.getElementById('signinForm').style.display = 'none';
  document.getElementById('signupForm').style.display = 'none';
}

function showLoading(isLoading) {
  const loadingIndicator = document.getElementById("loadingIndicator");
  if (isLoading) {
    if (!loadingIndicator) {
      const loader = document.createElement("div");
      loader.id = "loadingIndicator";
      loader.textContent = "Loading.....";
      loader.style.color = "blue";
      document.body.appendChild(loader);
    }
  } else if (loadingIndicator) {
    loadingIndicator.remove();
  }
}

async function fetchTodos(page = 1, pageSize = 5) {
  showLoading(true);
  try {
    const response = await fetch(`${apiUrl}/todos?page=${page}&pageSize=${pageSize}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.ok) {
      const { todos, total } = await response.json();
      displayTodos(todos);
      setupPagination(total, pageSize, page);
    } else {
      alert("Failed to fetch todos.");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  } finally {
    showLoading(false);
  }
}

function displayTodos(todos) {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.classList.add(todo.completed ? 'done' : 'pending');
    li.innerHTML = `
      <span>${todo.text}</span>
      <button class="markDoneButton" onclick="markTodoDone(${todo.id})">Mark as Done</button>
      <button class="editButton" onclick="editTodo(${todo.id}, '${todo.text}')">Edit</button>
      <button class="deleteButton" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(li);
  });
}

function setupPagination(total, pageSize, currentPage) {
  const paginationContainer = document.getElementById("pagination");
  paginationContainer.innerHTML = "";

  const totalPages = Math.ceil(total / pageSize);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    if (i === currentPage) pageButton.disabled = true;
    pageButton.addEventListener("click", () => fetchTodos(i));
    paginationContainer.appendChild(pageButton);
  }
}

document.getElementById('addTodoButton').addEventListener('click', async () => {
  const todoText = document.getElementById('todoText').value;

  if (!todoText) {
    alert('Please enter a task!');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ text: todoText })
    });

    if (response.ok) {
      const newTodo = await response.json();
      displayTodos([newTodo]);
      document.getElementById('todoText').value = '';
    } else {
      alert('Failed to add todo');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
});

function editTodo(id, currentText) {
  const newText = prompt('Edit your todo:', currentText);
  
  if (newText) {
    updateTodo(id, newText);  
  }
}

async function updateTodo(id, newText) {
  try {
    const response = await fetch(`${apiUrl}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ text: newText })
    });

    if (response.ok) {
      fetchTodos();
    } else {
      alert('Failed to update todo');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function markTodoDone(id) {
  try {
    const response = await fetch(`${apiUrl}/todos/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ completed: true })
    });

    if (response.ok) {
      fetchTodos();
    } else {
      alert('Failed to mark todo as done');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function deleteTodo(id) {
  try {
    const response = await fetch(`${apiUrl}/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      fetchTodos();
    } else {
      alert('Failed to delete todo');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

document.getElementById('logoutButton').addEventListener('click', () => {
  authToken = null;
  alert('Logged out successfully');
  
  document.getElementById('todoContainer').style.display = 'none';
  document.getElementById('signinForm').style.display = 'block';
  document.getElementById('signupForm').style.display = 'block';
  localStorage.removeItem("authToken");
});
