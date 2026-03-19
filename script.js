// ===== TASK TRACKER - JavaScript =====

// 1. Get references to HTML elements (so we can use them in code)
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const clearBtn = document.getElementById('clearBtn');

// 2. Load saved tasks from localStorage when page opens
//    localStorage = browser's built-in storage (data stays even after closing browser)
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// 3. When page loads, show all saved tasks
renderTasks();

// 4. Let user press "Enter" key to add a task (not just clicking the button)
taskInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    addTask();
  }
});

// ===== FUNCTION: Add a new task =====
function addTask() {
  // Get the text from input and remove extra spaces
  const text = taskInput.value.trim();

  // If input is empty, don't add anything
  if (text === '') {
    taskInput.focus();    // put cursor back in input box
    return;
  }

  // Create a task object with: text, completed status, and unique id
  const task = {
    id: Date.now(),       // unique id using current timestamp
    text: text,
    completed: false
  };

  // Add to our tasks array
  tasks.push(task);

  // Save to localStorage and refresh the display
  saveTasks();
  renderTasks();

  // Clear the input box and focus it for next task
  taskInput.value = '';
  taskInput.focus();
}

// ===== FUNCTION: Toggle task complete/incomplete =====
function toggleTask(id) {
  // Find the task by id and flip its completed status
  tasks = tasks.map(function(task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

// ===== FUNCTION: Delete a single task =====
function deleteTask(id) {
  // Keep only tasks that DON'T match the id we want to delete
  tasks = tasks.filter(function(task) {
    return task.id !== id;
  });

  saveTasks();
  renderTasks();
}

// ===== FUNCTION: Clear all tasks =====
function clearAllTasks() {
  if (tasks.length === 0) return;

  // Ask user to confirm before deleting everything
  if (confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// ===== FUNCTION: Save tasks to localStorage =====
function saveTasks() {
  // Convert tasks array to a string and store it
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ===== FUNCTION: Display all tasks on screen =====
function renderTasks() {
  // Clear the current list
  taskList.innerHTML = '';

  // Loop through each task and create HTML for it
  tasks.forEach(function(task) {
    // Create <li> element
    const li = document.createElement('li');

    // Add 'completed' class if task is done (for strikethrough styling)
    if (task.completed) {
      li.classList.add('completed');
    }

    // Build the inside of each task item:
    //   [checkbox] [task text] [delete button]
    li.innerHTML =
      '<input type="checkbox" ' + (task.completed ? 'checked' : '') +
      ' onchange="toggleTask(' + task.id + ')">' +
      '<span class="task-text">' + escapeHTML(task.text) + '</span>' +
      '<button class="delete-btn" onclick="deleteTask(' + task.id + ')">&#10005;</button>';

    taskList.appendChild(li);
  });

  // Update the task counter text
  updateTaskCount();
}

// ===== FUNCTION: Update the counter text =====
function updateTaskCount() {
  const total = tasks.length;
  const completed = tasks.filter(function(t) { return t.completed; }).length;

  if (total === 0) {
    taskCount.textContent = 'No tasks yet. Add one above!';
  } else {
    taskCount.textContent = total + ' task' + (total !== 1 ? 's' : '') +
      ' total, ' + completed + ' completed';
  }
}

// ===== FUNCTION: Prevent XSS (security) =====
// Converts special characters so users can't inject HTML/scripts
function escapeHTML(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}