const inputBox = document.getElementById("input-bx");
const taskList = document.getElementById("list");
const addBtn = document.getElementById("add-btn");
const filterButtons = document.querySelectorAll(".filter-btn");
const taskCountSpan = document.getElementById("task-count");
const completedCountSpan = document.getElementById("completed-count");
const clearCompletedBtn = document.getElementById("clear-completed");
const emptyState = document.getElementById("empty-state");

let currentFilter = "all";
let tasks = [];
const STORAGE_KEY = "todoAppData";


function init() {
  loadTasks();
  renderTasks();
  attachEventListeners();
  updateStats();
}

function attachEventListeners() {
  addBtn.addEventListener("click", addTask);
  inputBox.addEventListener("keypress", (e) => {
    if (e.key === "Enter") addTask();
  });

  taskList.addEventListener("click", handleTaskClick);

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", handleFilterChange);
  });

  clearCompletedBtn.addEventListener("click", clearCompleted);
}


function addTask() {
  const taskText = inputBox.value.trim();

  if (!taskText) {
    showNotification("Please enter a task!");
    inputBox.focus();
    return;
  }

  if (taskText.length > 100) {
    showNotification("Task is too long (max 100 characters)");
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    createdAt: new Date().toLocaleString(),
  };

  tasks.push(newTask);
  inputBox.value = "";
  inputBox.focus();

  saveTasks();
  renderTasks();
  updateStats();
}


function handleTaskClick(e) {
  const target = e.target;
  const taskItem = target.closest("li");

  if (!taskItem) return;

  if (target.tagName === "SPAN") {
    const taskId = parseInt(taskItem.dataset.taskId);
    deleteTask(taskId);
    return;
  }

  const taskId = parseInt(taskItem.dataset.taskId);
  toggleTask(taskId);
}

function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
    updateStats();
  }
}


function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  saveTasks();
  renderTasks();
  updateStats();
}


function clearCompleted() {
  const completedCount = tasks.filter((t) => t.completed).length;
  if (completedCount === 0) {
    showNotification("No completed tasks to clear!");
    return;
  }

  if (confirm(`Delete ${completedCount} completed task(s)?`)) {
    tasks = tasks.filter((t) => !t.completed);
    saveTasks();
    renderTasks();
    updateStats();
  }
}


function getFilteredTasks() {
  switch (currentFilter) {
    case "active":
      return tasks.filter((t) => !t.completed);
    case "completed":
      return tasks.filter((t) => t.completed);
    default:
      return tasks;
  }
}


function renderTasks() {
  const filteredTasks = getFilteredTasks();
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }

  filteredTasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.taskId = task.id;
    li.className = task.completed ? "checked" : "";
    li.setAttribute("role", "listitem");

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;
    li.appendChild(taskText);

    const deleteBtn = document.createElement("span");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = "&#215;";
    deleteBtn.setAttribute("aria-label", "Delete task");
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}


function handleFilterChange(e) {
  filterButtons.forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");

  currentFilter = e.target.dataset.filter;
  renderTasks();
}


function updateStats() {
  taskCountSpan.textContent = tasks.length;
  completedCountSpan.textContent = tasks.filter((t) => t.completed).length;
}


function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks:", error);
    showNotification("Failed to save task!");
  }
}


function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error loading tasks:", error);
    tasks = [];
  }
}


function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 1000;
    animation: slideUp 0.3s ease;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideDown 0.3s ease";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

const style = document.createElement("style");
style.textContent = `
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  @keyframes slideDown {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
  }
`;
document.head.appendChild(style);

init();
