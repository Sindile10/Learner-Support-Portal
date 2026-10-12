// 1. Initial default tasks
let defaultTasks = [
  {
    id: 1,
    title: "JavaScript Assignment",
    description: "Complete Challenge 2",
    dueDate: "29 August 2026",
    status: "In Progress",
    priority: "High",
    category: "JavaScript"
  },
  {
    id: 2,
    title: "HTML Website Design",
    description: "Create the learner dashboard",
    dueDate: "30 June 2027",
    status: "Complete",
    priority: "Medium",
    category: "HTML"
  }
];

// 2. Load saved tasks from localStorage (or load default tasks if empty)
function loadTasksFromStorage() {
  let storedTasks = localStorage.getItem("learner_tasks");
  if (storedTasks) {
    return JSON.parse(storedTasks);
  } else {
    return defaultTasks;
  }
}

// 3. Save tasks array into localStorage
function saveTasksToStorage() {
  localStorage.setItem("learner_tasks", JSON.stringify(tasks));
}

// Initialize tasks array from browser storage
let tasks = loadTasksFromStorage();

// 4. Sidebar Functionality: Toggle Collapse/Expand
function toggleSidebar() {
  let sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("collapsed");
}

// 5. Sidebar Navigation: Switch Active Page View
function switchView(viewName, clickedElement) {
  let navItems = document.querySelectorAll(".nav-item");
  for (let i = 0; i < navItems.length; i++) {
    navItems[i].classList.remove("active");
  }
  clickedElement.classList.add("active");

  let myTasksView = document.getElementById("view-My Tasks");
  let genericView = document.getElementById("view-Generic");

  if (viewName === "My Tasks") {
    myTasksView.style.display = "block";
    genericView.style.display = "none";
  } else {
    myTasksView.style.display = "none";
    genericView.style.display = "block";

    document.getElementById("genericTitle").textContent = viewName;
    document.getElementById("genericSubtitle").textContent = viewName;
  }
}

// 6. Logout Action
function handleLogout() {
  let confirmLogout = confirm("Are you sure you want to log out?");
  if (confirmLogout) {
    alert("Logged out successfully.");
  }
}

// 7. Render tasks to the screen
function renderTasks(taskListToDisplay) {
  let taskListContainer = document.getElementById("taskList");
  taskListContainer.innerHTML = "";

  for (let i = 0; i < taskListToDisplay.length; i++) {
    let task = taskListToDisplay[i];

    let statusClass = task.status === "In Progress" ? "badge-status-progress" : "badge-status-complete";
    let priorityClass = task.priority === "High" ? "badge-priority-high" : "badge-priority-medium";

    let taskCardHTML = `
      <div class="task-card">
        <div class="task-header">
          <div class="task-info-left">
            <div class="task-icon-box">📄</div>
            <div>
              <div class="task-title">${task.title}</div>
              <div class="task-description">${task.description}</div>
              <div class="task-due-date">📅 Due: ${task.dueDate}</div>
            </div>
          </div>
          <div class="task-tags">
            <span class="badge ${statusClass}">${task.status}</span>
            <span class="badge ${priorityClass}">Priority: ${task.priority}</span>
          </div>
        </div>
        <div class="task-footer">
          <button class="btn btn-update" onclick="toggleTaskStatus(${task.id})">✓ Update Status</button>
          <button class="btn btn-delete" onclick="deleteTask(${task.id})">🗑 Delete Task</button>
        </div>
      </div>
    `;

    taskListContainer.innerHTML += taskCardHTML;
  }
}

// 8. Search and filter function
function filterTasks() {
  let searchText = document.getElementById("searchInput").value.toLowerCase();
  let selectedCategory = document.getElementById("categoryFilter").value;
  let selectedPriority = document.getElementById("priorityFilter").value;

  let filtered = tasks.filter(function(task) {
    let matchesSearch = task.title.toLowerCase().includes(searchText) || task.description.toLowerCase().includes(searchText);
    let matchesCategory = selectedCategory === "All" || task.category === selectedCategory;
    let matchesPriority = selectedPriority === "All" || task.priority === selectedPriority;

    return matchesSearch && matchesCategory && matchesPriority;
  });

  renderTasks(filtered);
}

// 9. Toggle Task Status (In Progress <-> Complete)
function toggleTaskStatus(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].status = tasks[i].status === "In Progress" ? "Complete" : "In Progress";
      break;
    }
  }
  saveTasksToStorage(); // Save updated status
  filterTasks();
}

// 10. Delete Task from list
function deleteTask(taskId) {
  tasks = tasks.filter(function(task) {
    return task.id !== taskId;
  });
  saveTasksToStorage(); // Save after deleting
  filterTasks();
}

// 11. Create New Task and Save
function createNewTask() {
  let title = prompt("Enter Task Title:", "CSS Grid Practice");
  if (!title) return;

  let description = prompt("Enter Task Description:", "Practice layout design");
  let category = prompt("Enter Category (JavaScript, HTML, CSS):", "CSS");
  let priority = prompt("Enter Priority (High, Medium, Low):", "Medium");

  let newTask = {
    id: Date.now(),
    title: title,
    description: description || "New task created by learner",
    dueDate: "20 October 2026",
    status: "In Progress",
    priority: priority || "Medium",
    category: category || "General"
  };

  tasks.push(newTask);
  saveTasksToStorage(); // Persist to local storage
  filterTasks();
}

// Render tasks on initial page load
window.onload = function() {
  renderTasks(tasks);
};

