// 4. Update Stats, Progress Bar, and Render Tasks
function updateDashboard() {
  let totalTasks = tasks.length;
  let completedCount = 0;
  let outstandingCount = 0;

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].status === "complete") {
      completedCount++;
    } else {
      outstandingCount++;
    }
  }

  // Calculate Percentage
  let progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Update Progress Bar
  document.getElementById("progressPercentText").textContent = progressPercent + "%";
  document.getElementById("progressBarFill").style.width = progressPercent + "%";

  // Update Summary Stats Numbers
  document.getElementById("statTotalTasks").textContent = totalTasks;
  document.getElementById("statCompletedTasks").textContent = completedCount;
  document.getElementById("statOutstandingTasks").textContent = outstandingCount;

  // Save to Local Storage
  localStorage.setItem("hub_learner_tasks", JSON.stringify(tasks));

  // Render Tasks List
  renderTasksList();
}

// 5. Render Recent Tasks List
function renderTasksList() {
  let listContainer = document.getElementById("recentTasksList");
  listContainer.innerHTML = "";

  for (let i = 0; i < tasks.length; i++) {
    let task = tasks[i];
    let itemDiv = document.createElement("div");
    itemDiv.className = "list-item";

    if (task.status === "complete") {
      itemDiv.innerHTML = `
        <div>
          <div class="item-title">${task.title}</div>
          <div class="item-date">${task.date}</div>
        </div>
        <span class="badge badge-complete">COMPLETE</span>
      `;
    } else {
      itemDiv.innerHTML = `
        <div>
          <div class="item-title">${task.title}</div>
          <div class="item-date">${task.date}</div>
        </div>
        <button class="btn-mark" onclick="markTaskComplete(${task.id})">Mark Complete</button>
      `;
    }

    listContainer.appendChild(itemDiv);
  }
}

// 6. Action: Add New Task
function addNewTask() {
  let taskTitle = prompt("Enter new task title:", "CSS Grid Practice");
  if (taskTitle) {
    let newTask = {
      id: Date.now(),
      title: taskTitle,
      date: "20 AUG 2026",
      status: "pending"
    };
    tasks.push(newTask);
    updateDashboard(); // Automatically recalculates progress bar and task counts
  }
}

// 7. Action: Mark Task as Complete
function markTaskComplete(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === taskId) {
      tasks[i].status = "complete";
      break;
    }
  }
  updateDashboard(); // Automatically recalculates progress bar and task counts
}

// Initial render on page load
window.onload = function() {
  updateDashboard();
};
