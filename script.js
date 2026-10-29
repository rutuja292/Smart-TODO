// State management
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentFilter = 'all';

// DOM elements
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const priorityInput = document.getElementById('priority-input');
const taskList = document.getElementById('task-list');
const statsText = document.getElementById('stats');
const filterBtns = document.querySelectorAll('.filter-btn');

// Add Task
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const newTask = {
    id: Date.now(),
    text: taskInput.value.trim(),
    priority: priorityInput.value,
    completed: false
  };

  tasks.push(newTask);
  saveAndRender();
  taskInput.value = '';
});

// Toggle Complete or Delete Task
taskList.addEventListener('click', (e) => {
  const id = Number(e.target.closest('li')?.dataset.id);
  
  if (e.target.classList.contains('delete-btn')) {
    tasks = tasks.filter(task => task.id !== id);
  } else if (e.target.tagName === 'INPUT') {
    tasks = tasks.map(task => 
      task.id === id ? { ...task, completed: e.target.checked } : task
    );
  }
  
  saveAndRender();
});

// Filter Buttons
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Save to LocalStorage and Render
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Render Tasks to UI
function renderTasks() {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? 'checked' : ''} />
        <span>${task.text}</span>
        <span class="priority-tag priority-${task.priority}">${task.priority}</span>
      </div>
      <button class="delete-btn">✕</button>
    `;

    taskList.appendChild(li);
  });

  // Update Stats
  const completedCount = tasks.filter(t => t.completed).length;
  statsText.textContent = `Completed: ${completedCount} / Total: ${tasks.length}`;
}

// Initial render
renderTasks();