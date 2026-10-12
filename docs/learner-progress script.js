// 1. Initial tasks list (stored in localStorage)
let defaultTasks = [
  { id: 1, title: "JavaScript Assignment", status: "pending" },
  { id: 2, title: "HTML Basics Quiz", status: "done" },
  { id: 3, title: "CSS Flexbox Practice", status: "done" },
  { id: 4, title: "Build Portfolio Page", status: "pending" },
  { id: 5, title: "Git & GitHub Setup", status: "done" }
];

// Load from local storage or default
let tasks = JSON.parse(localStorage.getItem("report_tasks")) || defaultTasks;

// 2. Toggle Sidebar Visibility
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 3. Switch Sidebar Nav Item
function switchTab(element) {
  let items = document.querySelectorAll(".nav-item");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
  element.classList.add("active");
}

// 4. Update Stats and Circular Graph Rings
function updateDashboard() {
  let total = tasks.length;
  let completed = 0;
  let pending = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "done") {
      completed++;
    } else {
      pending++;
    }
  }

  let percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update Card Text
  document.getElementById("cardTotal").textContent = total;
  document.getElementById("cardCompleted").textContent = completed + " Task";
  document.getElementById("cardPending").textContent = pending + " Task";
  document.getElementById("cardProgress").textContent = percentage + " %";

  // Update Graph Legend Text
  document.getElementById("graphTotalText").textContent = total;
  document.getElementById("graphPendingText").textContent = pending;
  document.getElementById("graphPercentText").textContent = percentage + "%";
  document.getElementById("centerPercent").textContent = percentage + "%";

  // Update SVG Circular Ring Dashoffsets
  // Ring Total (Radius 90, circumference ~565)
  let ringTotal = document.getElementById("ringTotal");
  ringTotal.style.strokeDashoffset = 0; // 100% full

  // Ring Pending (Radius 70, circumference ~440)
  let ringPending = document.getElementById("ringPending");
  let pendingPercent = total > 0 ? (pending / total) : 0;
  ringPending.style.strokeDashoffset = 440 - (440 * pendingPercent);

  // Ring Progress (Radius 50, circumference ~314)
  let ringProgress = document.getElementById("ringProgress");
  let progressPercent = total > 0 ? (completed / total) : 0;
  ringProgress.style.strokeDashoffset = 314 - (314 * progressPercent);

  // Save to localStorage
  localStorage.setItem("report_tasks", JSON.stringify(tasks));

  // Render Task List
  renderTasksList();
}

// 5. Render Interactive Task List
function renderTasksList() {
  let listContainer = document.getElementById("taskList");
  listContainer.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let itemDiv = document.createElement("div");
    itemDiv.className = "task-item";

    itemDiv.innerHTML = `
      <span>${task.title} - <strong>${task.status.toUpperCase()}</strong></span>
      ${
        task.status === "pending"
          ? `<button class="action-btn btn-complete" onclick="markAsDone(${task.id})">Mark Done</button>`
          : `<span style="color: #10b981; font-weight: bold;">Completed</span>`
      }
    `;

    listContainer.appendChild(itemDiv);
  }
}

// 6. Action: Add New Task
function addNewTask() {
  let taskName = prompt("Enter new task title:", "React Basics");
  if (taskName) {
    let newTask = {
      id: Date.now(),
      title: taskName,
      status: "pending"
    };
    tasks.push(newTask);
    updateDashboard();
  }
}

// 7. Action: Mark Task as Completed
function markAsDone(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].status = "done";
      break;
    }
  }
  updateDashboard();
}

// Run on initial page load
window.onload = function() {
  updateDashboard();
};