// 1. Initial tasks array stored in localStorage
let defaultTasks = [
  { id: 1, title: "JavaScript Assignment", status: "pending" },
  { id: 2, title: "HTML Website Design", status: "done" },
  { id: 3, title: "CSS Layouts Practice", status: "done" },
  { id: 4, title: "Git & GitHub Basics", status: "pending" },
  { id: 5, title: "Database Principles", status: "done" }
];

// Load tasks from local storage if available
let tasks = JSON.parse(localStorage.getItem("summary_tasks")) || defaultTasks;

// 2. Toggle Sidebar Open/Close
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 3. Highlight Menu Item in Sidebar
function selectMenuItem(element) {
  let items = document.querySelectorAll(".menu-item");
  for (let i = 0; i < items.length; i++) {
    items[i].classList.remove("active");
  }
  element.classList.add("active");
}

// 4. Update Numbers, Table, and Circular SVG Graph Automatically
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

  let progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update Colored Card Texts
  document.getElementById("cardTotal").textContent = total;
  document.getElementById("cardCompleted").textContent = completed + " Task";
  document.getElementById("cardPending").textContent = pending + " Task";
  document.getElementById("cardProgress").textContent = progressPercent + " %";

  // Update Graph Legend Text
  document.getElementById("legendTotal").textContent = total;
  document.getElementById("legendPending").textContent = pending;
  document.getElementById("legendProgress").textContent = progressPercent + "%";
  document.getElementById("centerPercent").textContent = progressPercent + "%";

  // Update Overview Table
  document.getElementById("tblCompleted").textContent = completed;
  document.getElementById("tblPending").textContent = pending;
  document.getElementById("tblOverdue").textContent = "0";

  // Update Circular SVG Rings
  let ringTotal = document.getElementById("ringTotal");
  ringTotal.style.strokeDashoffset = 0;

  let ringPending = document.getElementById("ringPending");
  let pendingRatio = total > 0 ? (pending / total) : 0;
  ringPending.style.strokeDashoffset = 440 - (440 * pendingRatio);

  let ringProgress = document.getElementById("ringProgress");
  let progressRatio = total > 0 ? (completed / total) : 0;
  ringProgress.style.strokeDashoffset = 314 - (314 * progressRatio);

  // Update Status Banner Message
  let statusMessage = document.getElementById("statusMessage");
  if (progressPercent >= 80) {
    statusMessage.textContent = "Outstanding progress! You are almost finished with all tasks.";
  } else if (progressPercent >= 50) {
    statusMessage.textContent = "Good progress! Keep working on your remaining tasks.";
  } else {
    statusMessage.textContent = "Keep going! Complete more pending tasks to boost your score.";
  }

  // Save changes to browser storage
  localStorage.setItem("summary_tasks", JSON.stringify(tasks));

  // Refresh tasks UI
  renderTasksList();
}

// 5. Render Task List with Action Buttons
function renderTasksList() {
  let listContainer = document.getElementById("taskList");
  listContainer.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let rowDiv = document.createElement("div");
    rowDiv.className = "task-item";

    rowDiv.innerHTML = `
      <span>${task.title} (Status: <strong>${task.status.toUpperCase()}</strong>)</span>
      ${
        task.status === "pending"
          ? `<button class="btn btn-complete" onclick="markTaskDone(${task.id})">Mark Done</button>`
          : `<span style="color:#10b981; font-weight:bold;">Completed</span>`
      }
    `;

    listContainer.appendChild(rowDiv);
  }
}

// 6. Action: Add New Task
function addNewTask() {
  let title = prompt("Enter new task title:", "Python Basics");
  if (title) {
    let newTask = {
      id: Date.now(),
      title: title,
      status: "pending"
    };
    tasks.push(newTask);
    updateDashboard(); // Automatically recalculates and updates graph
  }
}

// 7. Action: Mark Task as Completed
function markTaskDone(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].status = "done";
      break;
    }
  }
  updateDashboard(); // Automatically recalculates and updates graph
}

// Run on page load
window.onload = function() {
  updateDashboard();
};
