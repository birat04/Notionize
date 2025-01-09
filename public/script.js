const apiUrl = "http://localhost:5001"; 
let authToken = null;  
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
    } else {
      alert('Sign up failed!');
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
      alert('Sign in successful!');
      document.getElementById('signinForm').reset();
      showTodoContainer(); 
      fetchTodos(); 
    } else {
      alert('Sign in failed!');
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
async function fetchTodos() {
  try {
    const response = await fetch(`${apiUrl}/todos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}` 
      }
    });

    if (response.ok) {
      const todos = await response.json();
      displayTodos(todos);
    } else {
      alert('Failed to fetch to-dos');
    }
  } catch (error) {
    alert('Error: ' + error.message);
  }
}
function displayTodos(todos) {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = ''; 

  todos.forEach(todo => {
    const li = document.createElement('li');
    li.classList.add(todo.done ? 'done' : 'pending');
    li.innerHTML = `
      <span>${todo.text}</span>
      <button class="markDoneButton" onclick="markTodoDone(${todo.id})">Mark as Done</button>
      <button class="editButton" onclick="editTodo(${todo.id}, '${todo.text}')">Edit</button>
      <button class="deleteButton" onclick="deleteTodo(${todo.id})">Delete</button>
    `;
    todoList.appendChild(li);
  });
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
      body: JSON.stringify({ done: true })
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
});
