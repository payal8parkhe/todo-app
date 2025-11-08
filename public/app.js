// Frontend JavaScript
let todos = [];

async function checkDatabaseStatus() {
    try {
        const response = await fetch('/api/db-status');
        const data = await response.json();
        
        const statusElement = document.getElementById('dbStatus');
        const statusDot = statusElement.querySelector('.status-dot');
        
        if (data.status === 'connected') {
            statusDot.className = 'status-dot connected';
            statusElement.innerHTML = '<span class="status-dot connected"></span> Database: Connected (PostgreSQL)';
        } else {
            statusDot.className = 'status-dot error';
            statusElement.innerHTML = `<span class="status-dot error"></span> Database: Error - ${data.error}`;
        }
    } catch (error) {
        const statusElement = document.getElementById('dbStatus');
        statusElement.innerHTML = '<span class="status-dot error"></span> Database: Connection failed';
    }
}

async function loadTodos() {
    try {
        const response = await fetch('/api/todos');
        todos = await response.json();
        renderTodos();
    } catch (error) {
        console.error('Failed to load todos:', error);
    }
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';
    
    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        todoElement.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   onchange="toggleTodo(${todo.id})">
            <span class="todo-text">${todo.title}</span>
            <small>${new Date(todo.createdAt).toLocaleDateString()}</small>
        `;
        todoList.appendChild(todoElement);
    });
}

async function addTodo() {
    const input = document.getElementById('todoInput');
    const title = input.value.trim();
    
    if (!title) return;
    
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title })
        });
        
        if (response.ok) {
            input.value = '';
            await loadTodos();
        }
    } catch (error) {
        console.error('Failed to add todo:', error);
    }
}

async function toggleTodo(id) {
    try {
        const todo = todos.find(t => t.id === id);
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: !todo.completed })
        });
        
        if (response.ok) {
            await loadTodos();
        }
    } catch (error) {
        console.error('Failed to toggle todo:', error);
    }
}

// Enter key support
document.getElementById('todoInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Initialize
loadTodos();
checkDatabaseStatus();
