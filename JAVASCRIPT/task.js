const firebaseConfig = {
  apiKey: "AIzaSyC7lu6zwfV2xVAyMU9IFSzlDrOGRRFIHEE",
  authDomain: "learning-hub-fc831.firebaseapp.com",
  databaseURL: "https://learning-hub-fc831-default-rtdb.firebaseio.com",
  projectId: "learning-hub-fc831",
  storageBucket: "learning-hub-fc831.firebasestorage.app",
  messagingSenderId: "769248182402",
  appId: "1:769248182402:web:6855f3c81832790f15749b"
};

const STORAGE_KEY = "learner_tasks";
const defaultTasks = [
  { id: 1, title: "JavaScript Assignment", description: "Complete Challenge 2", category: "JavaScript", priority: "High", status: "In Progress", dueDate: "2026-08-29" },
  { id: 2, title: "HTML Website Design", description: "Create the learner dashboard", category: "HTML", priority: "Medium", status: "Complete", dueDate: "2027-06-30" }
];

let tasks = [];
let editId = null;

function getCurrentUserId() {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    return currentUser && currentUser.uid ? currentUser.uid : "guest-user";
  } catch (error) {
    return "guest-user";
  }
}

function getFirebaseDatabase() {
  const firebaseApi = window.firebase;
  if (!firebaseApi || !firebaseApi.apps || !firebaseApi.initializeApp || !firebaseApi.database) {
    return null;
  }

  if (!firebaseApi.apps.length) {
    firebaseApi.initializeApp(firebaseConfig);
  }

  return firebaseApi.database();
}

async function firebaseRead(path) {
  const db = getFirebaseDatabase();
  if (!db || typeof db.ref !== "function") {
    return null;
  }

  try {
    const snapshot = await db.ref(path).once("value");
    return snapshot && typeof snapshot.val === "function" ? snapshot.val() : null;
  } catch (error) {
    return null;
  }
}

async function firebaseWrite(path, value) {
  const db = getFirebaseDatabase();
  if (!db || typeof db.ref !== "function") {
    return false;
  }

  try {
    await db.ref(path).set(value);
    return true;
  } catch (error) {
    return false;
  }
}

function loadTasksFromStorage() {
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  if (storedTasks) {
    try {
      return JSON.parse(storedTasks);
    } catch (error) {
      console.warn("Could not parse saved tasks.", error);
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
  return defaultTasks;
}

async function syncTasksToFirebase() {
  const userId = getCurrentUserId();
  const path = `users/${userId}/tasks`;
  await firebaseWrite(path, tasks);
}

async function loadTasks() {
  const userId = getCurrentUserId();
  const firebasePath = `users/${userId}/tasks`;
  const firebaseTasks = await firebaseRead(firebasePath);

  if (firebaseTasks) {
    const list = Array.isArray(firebaseTasks) ? firebaseTasks : Object.values(firebaseTasks);
    tasks = list;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return;
  }

  tasks = loadTasksFromStorage();
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  syncTasksToFirebase();
}

function getFilteredTasks() {
  const search = document.getElementById("search").value.trim().toLowerCase();
  const category = document.getElementById("filterCat").value;
  const priority = document.getElementById("filterPri").value;
  const sortBy = document.getElementById("sortBy").value;

  let filtered = [...tasks].filter((task) => {
    const matchesSearch = !search || task.title.toLowerCase().includes(search) || task.description.toLowerCase().includes(search);
    const matchesCategory = category === "All" || task.category === category;
    const matchesPriority = priority === "All" || task.priority === priority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  filtered.sort((a, b) => {
    if (sortBy === "priority") {
      const weight = { High: 3, Medium: 2, Low: 1 };
      return weight[b.priority] - weight[a.priority];
    }

    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    return dateA - dateB;
  });

  return filtered;
}

function renderTasks() {
  const list = document.getElementById("tasksList");
  if (!list) return;

  const filteredTasks = getFilteredTasks();
  list.innerHTML = "";

  if (!filteredTasks.length) {
    list.innerHTML = '<div class="task-card"><p style="text-align:center; color:#64748b;">No tasks found.</p></div>';
    return;
  }

  filteredTasks.forEach((task) => {
    const statusClass = task.status === "Complete" ? "badge-status-complete" : "badge-status-progress";
    const priorityClass = task.priority === "High" ? "badge-priority-high" : task.priority === "Medium" ? "badge-priority-medium" : "badge-priority-low";

    const taskCard = document.createElement("div");
    taskCard.className = "task-card";
    taskCard.innerHTML = `
      <div class="task-header">
        <div class="task-info">
          <div class="task-icon-box">📄</div>
          <div>
            <div class="task-title">${task.title}</div>
            <div class="task-description">${task.description || "No description added."}</div>
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
        <button class="btn btn-delete" onclick="deleteTask(${task.id})">🗑 Delete</button>
      </div>
    `;

    list.appendChild(taskCard);
  });
}

function setFormDefaults() {
  document.getElementById("tTitle").value = "";
  document.getElementById("tDesc").value = "";
  document.getElementById("tCat").value = "JavaScript";
  document.getElementById("tPri").value = "High";
  document.getElementById("tStatus").value = "In Progress";
  document.getElementById("tDate").value = "";
  document.getElementById("error").textContent = "";
}

function openTaskModal(task = null) {
  const modal = document.getElementById("taskModal");
  if (!modal) return;

  if (task) {
    editId = task.id;
    document.getElementById("popupTitle").textContent = "Update Task";
    document.getElementById("tTitle").value = task.title;
    document.getElementById("tDesc").value = task.description;
    document.getElementById("tCat").value = task.category;
    document.getElementById("tPri").value = task.priority;
    document.getElementById("tStatus").value = task.status;
    document.getElementById("tDate").value = task.dueDate;
  } else {
    editId = null;
    document.getElementById("popupTitle").textContent = "Create New Task";
    setFormDefaults();
  }

  modal.classList.add("show");
}

function closeTaskModal() {
  document.getElementById("taskModal").classList.remove("show");
  document.getElementById("error").textContent = "";
}

function saveTask() {
  const title = document.getElementById("tTitle").value.trim();
  const description = document.getElementById("tDesc").value.trim();
  const category = document.getElementById("tCat").value;
  const priority = document.getElementById("tPri").value;
  const status = document.getElementById("tStatus").value;
  const dueDate = document.getElementById("tDate").value;
  const errorText = document.getElementById("error");

  if (!title || !dueDate) {
    errorText.textContent = "Please fill in the task title and date.";
    return;
  }

  const newTask = {
    id: editId || Date.now(),
    title,
    description: description || "No description added.",
    category,
    priority,
    status,
    dueDate
  };

  if (editId) {
    tasks = tasks.map((task) => (task.id === editId ? newTask : task));
  } else {
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  closeTaskModal();
}

function toggleTaskStatus(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, status: task.status === "Complete" ? "In Progress" : "Complete" };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  const shouldDelete = confirm("Delete this task?");
  if (!shouldDelete) return;

  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function bindSidebar() {
  const btn = document.getElementById("btn");
  const sidebar = document.querySelector(".sidebar");

  if (btn && sidebar) {
    btn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }
}

function bindNotifications() {
  const btn = document.getElementById("notifBtn");
  const popup = document.getElementById("notificationPopup");

  if (btn && popup) {
    btn.addEventListener("click", () => {
      popup.classList.toggle("show");
    });
  }
}

async function init() {
  bindSidebar();
  bindNotifications();

  await loadTasks();
  renderTasks();

  document.getElementById("createBtn").addEventListener("click", () => openTaskModal());
  document.getElementById("closePopup").addEventListener("click", closeTaskModal);
  document.getElementById("saveBtn").addEventListener("click", saveTask);
  document.getElementById("search").addEventListener("input", renderTasks);
  document.getElementById("filterCat").addEventListener("change", renderTasks);
  document.getElementById("filterPri").addEventListener("change", renderTasks);
  document.getElementById("sortBy").addEventListener("change", renderTasks);

  document.getElementById("taskModal").addEventListener("click", (event) => {
    if (event.target.id === "taskModal") {
      closeTaskModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeTaskModal();
    }
  });
}

window.toggleTaskStatus = toggleTaskStatus;
window.deleteTask = deleteTask;
window.editTask = function (taskId) {
  const task = tasks.find((item) => item.id === taskId);
  if (task) openTaskModal(task);
};
window.onload = init;
