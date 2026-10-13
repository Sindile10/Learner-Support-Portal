const firebaseConfig = {
  apiKey: "AIzaSyC7lu6zwfV2xVAyMU9IFSzlDrOGRRFIHEE",
  authDomain: "learning-hub-fc831.firebaseapp.com",
  databaseURL: "https://learning-hub-fc831-default-rtdb.firebaseio.com",
  projectId: "learning-hub-fc831",
  storageBucket: "learning-hub-fc831.firebasestorage.app",
  messagingSenderId: "769248182402",
  appId: "1:769248182402:web:6855f3c81832790f15749b"
};

function getFirebaseDatabase() {
  const firebaseApi = typeof window !== "undefined" ? window.firebase : null;
  if (!firebaseApi || typeof firebaseApi.initializeApp !== "function") {
    return null;
  }

  const apps = firebaseApi.apps || [];
  if (!apps.length) {
    firebaseApi.initializeApp(firebaseConfig);
  }

  if (typeof firebaseApi.database !== "function") {
    return null;
  }

  return firebaseApi.database();
}

async function firebaseRead(path) {
  const database = getFirebaseDatabase();
  if (!database || typeof database.ref !== "function") {
    return null;
  }

  try {
    const snapshot = await database.ref(path).once("value");
    return snapshot && typeof snapshot.val === "function" ? snapshot.val() : null;
  } catch (error) {
    console.warn("Firebase read failed.", error);
    return null;
  }
}

async function firebaseWrite(path, value) {
  const database = getFirebaseDatabase();
  if (!database || typeof database.ref !== "function") {
    return false;
  }

  try {
    await database.ref(path).set(value);
    return true;
  } catch (error) {
    console.warn("Firebase write failed.", error);
    return false;
  }
}

const tasks = [
  { id: 1, title: "JavaScript Project", dueDate: "22 Jun, 10:00", status: "pending" },
  { id: 2, title: "HTML Assignment", dueDate: "25 Aug, 10:00", status: "pending" },
  { id: 3, title: "CSS Flexbox Layout Practice", dueDate: "10 May, 14:00", status: "done" },
  { id: 4, title: "Build a To-Do List with JavaScript", dueDate: "12 Jul, 11:00", status: "pending" },
  { id: 5, title: "Tailwind CSS Landing Page", dueDate: "18 Sep, 09:00", status: "pending" },
  { id: 6, title: "JavaScript Arrays and Loops Exercise", dueDate: "01 May, 15:00", status: "done" },
  { id: 7, title: "Responsive Navbar with HTML and CSS", dueDate: "15 Apr, 16:30", status: "done" },
  { id: 8, title: "DOM Manipulation Quiz", dueDate: "20 May, 10:00", status: "done" },
  { id: 9, title: "Git and GitHub Basics", dueDate: "05 Jun, 13:00", status: "done" },
  { id: 10, title: "Debug a Broken JavaScript Function", dueDate: "30 Oct, 12:00", status: "pending" },
  { id: 11, title: "Form Validation with JavaScript", dueDate: "14 Feb, 09:30", status: "done" },
  { id: 12, title: "Build a Calculator App", dueDate: "28 Mar, 11:15", status: "done" }
];

const safeStorage = typeof localStorage !== "undefined"
  ? localStorage
  : { getItem: () => null, setItem: () => {}, removeItem: () => {} };

function getAccountPreferences() {
  try {
    const saved = safeStorage.getItem("accountPreferences") || safeStorage.getItem("Account Preferences") || "{}";
    return JSON.parse(saved) || {};
  } catch (error) {
    return {};
  }
}

function getCurrentDashboardName() {
  try {
    const currentUser = JSON.parse(safeStorage.getItem("currentUser") || "null");
    if (currentUser && currentUser.name) {
      return currentUser.name;
    }
  } catch (error) {
    // Ignore malformed user state.
  }

  const prefs = getAccountPreferences();
  if (prefs.name) {
    return prefs.name;
  }

  const username = safeStorage.getItem("username");
  if (username) {
    return username;
  }

  return "Learner";
}

function applySavedTheme() {
  const preferences = getAccountPreferences();
  const themeName = localStorage.getItem("portalTheme") || preferences.theme || "light";
  const selectedTheme = themeName === "dark" ? "dark" : "light";

  if (typeof document !== "undefined" && document.body) {
    document.body.classList.remove("theme-dark", "theme-light");
    document.body.classList.add(selectedTheme === "dark" ? "theme-dark" : "theme-light");
  }
}

function updateDashboardGreeting() {
  const heading = document.getElementById("dashboardWelcomeTitle");
  if (!heading) return;

  const displayName = getCurrentDashboardName();
  heading.textContent = `Welcome back, ${displayName}!`;
}

const currentUser = JSON.parse(safeStorage.getItem("currentUser") || "null");
const currentUserId = currentUser?.uid || "guest-user";
const DASHBOARD_STATE_KEY = "learner_dashboard_state";
const SHARED_TASKS_KEY = "learner_tasks";
const SUPPORT_BOOKINGS_KEY = "learner_support_bookings";
const DASHBOARD_FB_PATH = `users/${currentUserId}/dashboard`;

let bookings = [];
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
let picker = { day: 7, monthIndex: 9, year: 2026, hour: 10, minute: 0, ampm: "AM" };

function normalizeTaskStatus(status) {
  if (!status) return "pending";
  const value = String(status).trim().toLowerCase();
  if (value === "complete" || value === "done") return "done";
  if (value === "in progress" || value === "pending") return "pending";
  if (value === "cancelled") return "cancelled";
  return value;
}

function normalizeDashboardTask(task) {
  if (!task || typeof task !== "object") return null;

  return {
    id: Number(task.id) || Date.now() + Math.random(),
    title: task.title || "Untitled task",
    dueDate: task.dueDate || "No date set",
    status: normalizeTaskStatus(task.status),
    description: task.description || ""
  };
}

function loadSharedTasks() {
  try {
    const rawValue = safeStorage.getItem(SHARED_TASKS_KEY);
    if (!rawValue) {
      const fallbackTasks = tasks.map((task) => ({ ...task }));
      safeStorage.setItem(SHARED_TASKS_KEY, JSON.stringify(fallbackTasks));
      return fallbackTasks.map(normalizeDashboardTask).filter(Boolean);
    }

    const parsed = JSON.parse(rawValue);
    const sharedTasks = Array.isArray(parsed) ? parsed : Object.values(parsed || {});
    return sharedTasks.map(normalizeDashboardTask).filter(Boolean);
  } catch (error) {
    return tasks.map((task) => ({ ...task })).map(normalizeDashboardTask).filter(Boolean);
  }
}

function syncTasksFromSharedStorage() {
  const sharedTasks = loadSharedTasks();
  if (sharedTasks.length) {
    tasks.splice(0, tasks.length, ...sharedTasks);
    safeStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify({ tasks, bookings }));
  }
}

async function readStoredSupportBookings() {
  try {
    const stored = safeStorage.getItem(SUPPORT_BOOKINGS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function syncBookingsFromStorage() {
  const storedBookings = readStoredSupportBookings();
  if (storedBookings.length) {
    bookings = storedBookings;
    const state = JSON.parse(safeStorage.getItem(DASHBOARD_STATE_KEY) || "{}");
    if (state && typeof state === "object") {
      state.bookings = bookings;
      safeStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify(state));
    }
  }
}

async function loadDashboardState() {
  const sharedTasks = loadSharedTasks();
  if (sharedTasks.length) {
    tasks.splice(0, tasks.length, ...sharedTasks);
  }

  syncBookingsFromStorage();

  const firebaseState = await firebaseRead(DASHBOARD_FB_PATH);
  if (firebaseState) {
    if (Array.isArray(firebaseState.tasks) && firebaseState.tasks.length) {
      tasks.splice(0, tasks.length, ...firebaseState.tasks.map(normalizeDashboardTask).filter(Boolean));
    }
    if (Array.isArray(firebaseState.bookings)) {
      bookings = firebaseState.bookings;
    }
    safeStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify({ tasks, bookings }));
    return;
  }

  const stored = JSON.parse(safeStorage.getItem(DASHBOARD_STATE_KEY) || "{}");
  if (Array.isArray(stored.tasks) && stored.tasks.length) {
    tasks.splice(0, tasks.length, ...stored.tasks.map(normalizeDashboardTask).filter(Boolean));
  }
  if (Array.isArray(stored.bookings)) {
    bookings = stored.bookings;
  }
}

function persistSharedTasks() {
  const sharedTasks = tasks.map((task) => ({
    ...task,
    status: task.status === "pending" ? "In Progress" : task.status === "done" ? "Complete" : task.status || "In Progress"
  }));

  safeStorage.setItem(SHARED_TASKS_KEY, JSON.stringify(sharedTasks));
}

async function saveDashboardState() {
  const state = { tasks, bookings };
  safeStorage.setItem(DASHBOARD_STATE_KEY, JSON.stringify(state));
  persistSharedTasks();
  await firebaseWrite(DASHBOARD_FB_PATH, state);
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", initializeDashboard);
}

async function initializeDashboard() {
  applySavedTheme();
  await loadDashboardState();
  syncTasksFromSharedStorage();
  bindSidebar();
  attachModalCloseHandlers();
  updateDashboardGreeting();
  updateDashboard();
  updatePickerDisplay();
  renderTaskList();
  renderBookingsList();
}

function bindSidebar() {
  if (typeof document === "undefined") return;

  const btn = document.querySelector("#btn");
  const sidebar = document.querySelector(".sidebar");

  if (btn && sidebar) {
    btn.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
    });
  }

  const navLinks = document.querySelectorAll(".sidebar ul li");
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      navLinks.forEach((item) => item.classList.remove("active"));
      this.classList.add("active");
    });
  });
}

function attachModalCloseHandlers() {
  if (typeof document === "undefined") return;

  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (modal.dataset.boundClose === "true") return;

    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        modal.classList.remove("show");
      }
    });

    modal.dataset.boundClose = "true";
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeTasksModal();
      closePickerModal();
    }
  });
}

function setText(elementId, text) {
  if (typeof document === "undefined") return;
  const element = document.getElementById(elementId);
  if (element) {
    element.innerText = text;
    element.textContent = text;
  }
}

function pad(number) {
  return number < 10 ? "0" + number : number;
}

function findTask(taskId) {
  return tasks.find((task) => task.id === taskId) || null;
}

function bookingToText(booking) {
  return booking.day + " " + booking.month + " " + booking.year + ", " + booking.time;
}

function parseDueDate(dateText) {
  if (!dateText) return null;

  const isoMatch = dateText.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{1,2}):(\d{2}))?$/);
  if (isoMatch) {
    const [, year, month, day, hour = "0", minute = "0"] = isoMatch;
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
  }

  const dayMatch = dateText.match(/(\d{1,2})/);
  const monthMatch = dateText.match(/[A-Za-z]{3}/);
  const timeMatch = dateText.match(/(\d{1,2}):(\d{2})/);

  if (!dayMatch || !monthMatch || !timeMatch) return null;

  const day = Number(dayMatch[1]);
  const monthIndex = monthNames.indexOf(monthMatch[0]);
  const hour = Number(timeMatch[1]);
  const minute = Number(timeMatch[2]);

  if (monthIndex === -1 || Number.isNaN(day) || Number.isNaN(hour) || Number.isNaN(minute)) {
    return null;
  }

  const year = new Date().getFullYear();
  const parsed = new Date(year, monthIndex, day, hour, minute);

  if (parsed.getFullYear() !== year || parsed.getMonth() !== monthIndex || parsed.getDate() !== day) {
    return null;
  }

  return parsed;
}

function getUpcomingTasks() {
  const pendingTasks = tasks.filter((task) => task.status === "pending");
  const fallbackDate = new Date(9999, 0, 1);

  return [...pendingTasks].sort((a, b) => {
    const aDate = parseDueDate(a.dueDate) || fallbackDate;
    const bDate = parseDueDate(b.dueDate) || fallbackDate;
    return aDate - bDate;
  });
}

function updateDashboard() {
  if (typeof document === "undefined") return;

  let total = 0;
  let pending = 0;
  let done = 0;

  for (const task of tasks) {
    if (task.status === "cancelled") continue;
    total++;

    if (task.status === "pending") {
      pending++;
    } else if (task.status === "done") {
      done++;
    }
  }

  const percentDone = total > 0 ? Math.round((done / total) * 100) : 0;
  const percentPending = total > 0 ? Math.round((pending / total) * 100) : 0;

  setText("statTotal", total);
  setText("statPending", pending);
  setText("statProgressBadge", percentDone + "%");

  const pendingBar = document.getElementById("barPending");
  const progressBar = document.getElementById("barProgress");
  if (pendingBar) pendingBar.style.width = percentPending + "%";
  if (progressBar) progressBar.style.width = percentDone + "%";

  setText("legendTotal", total);
  setText("legendPending", pending);
  setText("circlePercentText", percentDone + "%");

  const circleBar = document.getElementById("svgCircleBar");
  if (circleBar) {
    circleBar.setAttribute("stroke-dasharray", percentDone + ", 100");
  }

  const upcomingTasks = getUpcomingTasks();
  showUpcomingTask(1, upcomingTasks[0]);
  showUpcomingTask(2, upcomingTasks[1]);

  const nextSession = bookings[bookings.length - 1];
  if (nextSession) {
    const latest = bookingToText(nextSession);
    setText("nextSessionDateText", latest);
    setText("supportNextSessionText", "Next session: " + latest);
  } else {
    setText("nextSessionDateText", "No session booked yet");
    setText("supportNextSessionText", "Next session: none booked yet");
  }
}

function showUpcomingTask(rowNumber, task) {
  if (!task) {
    setText("upcomingTask" + rowNumber + "Title", "Nothing here yet");
    setText("upcomingTask" + rowNumber + "Date", "-");
    return;
  }

  setText("upcomingTask" + rowNumber + "Title", task.title);
  setText("upcomingTask" + rowNumber + "Date", "Due " + task.dueDate);
}

function toggleNotifications() {
  if (typeof document === "undefined") return;

  const popup = document.getElementById("notificationPopup");
  if (popup) {
    popup.classList.toggle("show");
  }

  const dot = document.getElementById("notificationDot");
  if (dot) {
    dot.style.display = "none";
  }
}

function openTasksModal() {
  renderTaskList();
  const tasksModal = document.getElementById("tasksModal");
  if (tasksModal) {
    tasksModal.classList.add("show");
  }
}

function closeTasksModal() {
  const tasksModal = document.getElementById("tasksModal");
  if (tasksModal) {
    tasksModal.classList.remove("show");
  }
  updateDashboard();
}

function renderTaskList() {
  if (typeof document === "undefined") return;

  const container = document.getElementById("tasksListContainer");
  if (!container) return;

  container.innerHTML = "";

  for (const task of tasks) {
    const isDone = task.status === "done";
    const isCancelled = task.status === "cancelled";

    let label = "To do";
    let badgeClass = "badge-pending";
    if (isDone) {
      label = "Done";
      badgeClass = "badge-done";
    } else if (isCancelled) {
      label = "Cancelled";
      badgeClass = "badge-cancelled";
    }

    const checkboxState = (isDone || isCancelled ? "checked" : "") + (isCancelled ? " disabled" : "");
    const cancelButton = isCancelled ? "" : '<button class="btn-cancel-task" onclick="cancelTask(' + task.id + ')">Cancel</button>';

    const row = document.createElement("div");
    row.className = "task-list-item";
    row.innerHTML = `
      <div class="task-info">
        <input type="checkbox" class="task-checkbox" ${checkboxState} onchange="toggleTaskDone(${task.id})">
        <div>
          <div class="task-title-text ${isCancelled ? "task-text-cancelled" : ""}">${task.title}</div>
          <div class="task-date-text">Due: ${task.dueDate}</div>
        </div>
      </div>
      <div>
        <span class="status-badge ${badgeClass}">${label}</span>
        ${cancelButton}
      </div>
    `;

    container.appendChild(row);
  }
}

async function toggleTaskDone(taskId) {
  const task = findTask(taskId);
  if (!task || task.status === "cancelled") return;

  task.status = task.status === "done" ? "pending" : "done";
  await saveDashboardState();
  renderTaskList();
  updateDashboard();
}

async function cancelTask(taskId) {
  const safe = confirm("Cancel this task? You can't undo this.");
  if (!safe) return;

  const task = findTask(taskId);
  if (task) {
    task.status = "cancelled";
  }

  await saveDashboardState();
  renderTaskList();
  updateDashboard();
}

function openPickerModal() {
  resetPicker();
  renderBookingsList();
  const modal = document.getElementById("pickerModal");
  if (modal) {
    modal.classList.add("show");
  }
}

function closePickerModal() {
  const modal = document.getElementById("pickerModal");
  if (modal) {
    modal.classList.remove("show");
  }
}

function resetPicker() {
  const today = new Date();
  picker.day = today.getDate();
  picker.monthIndex = today.getMonth();
  picker.year = today.getFullYear();
  picker.hour = 10;
  picker.minute = 0;
  picker.ampm = "AM";
  updatePickerDisplay();
}

function resetPickerToToday() {
  resetPicker();
}

function changePickerVal(type, change) {
  if (type === "day") {
    picker.day = wrap(picker.day + change, 1, 31);
  } else if (type === "month") {
    picker.monthIndex = wrap(picker.monthIndex + change, 0, 11);
  } else if (type === "year") {
    picker.year = wrap(picker.year + change, 2024, 2030);
  } else if (type === "hour") {
    picker.hour = wrap(picker.hour + change, 1, 12);
  } else if (type === "minute") {
    picker.minute = wrap(picker.minute + change, 0, 55);
  } else if (type === "ampm") {
    picker.ampm = picker.ampm === "AM" ? "PM" : "AM";
  }

  updatePickerDisplay();
}

function wrap(value, min, max) {
  if (value < min) return max;
  if (value > max) return min;
  return value;
}

function updatePickerDisplay() {
  if (typeof document === "undefined") return;

  setText("dayPrev", pad(wrap(picker.day - 1, 1, 31)));
  setText("dayCurr", pad(picker.day));
  setText("dayNext", pad(wrap(picker.day + 1, 1, 31)));

  setText("monthPrev", monthNames[wrap(picker.monthIndex - 1, 0, 11)]);
  setText("monthCurr", monthNames[picker.monthIndex]);
  setText("monthNext", monthNames[wrap(picker.monthIndex + 1, 0, 11)]);

  setText("yearPrev", String(picker.year - 1));
  setText("yearCurr", String(picker.year));
  setText("yearNext", String(picker.year + 1));

  setText("hourPrev", pad(wrap(picker.hour - 1, 1, 12)));
  setText("hourCurr", pad(picker.hour));
  setText("hourNext", pad(wrap(picker.hour + 1, 1, 12)));

  setText("minutePrev", pad(wrap(picker.minute - 5, 0, 55)));
  setText("minuteCurr", pad(picker.minute));
  setText("minuteNext", pad(wrap(picker.minute + 5, 0, 55)));

  const otherOne = picker.ampm === "AM" ? "PM" : "AM";
  setText("ampmPrev", otherOne);
  setText("ampmCurr", picker.ampm);
  setText("ampmNext", otherOne);
}

async function saveBooking() {
  const booking = {
    id: Date.now(),
    day: pad(picker.day),
    month: monthNames[picker.monthIndex],
    year: picker.year,
    time: pad(picker.hour) + ":" + pad(picker.minute) + " " + picker.ampm
  };

  bookings.push(booking);
  await saveDashboardState();
  renderBookingsList();
  updateDashboard();
  closePickerModal();
  alert("You're booked in for " + bookingToText(booking) + ".");
}

function renderBookingsList() {
  if (typeof document === "undefined") return;

  const container = document.getElementById("bookingsListContainer");
  if (!container) return;

  container.innerHTML = "";

  if (bookings.length === 0) {
    container.innerHTML = '<div style="font-size: 0.8rem; color: #737373;">You have no bookings yet.</div>';
    return;
  }

  for (const booking of bookings) {
    const row = document.createElement("div");
    row.className = "booking-item-row";
    row.innerHTML = `
      <span>${bookingToText(booking)}</span>
      <button class="btn-remove-booking" onclick="removeBooking(${booking.id})">Remove</button>
    `;
    container.appendChild(row);
  }
}

async function removeBooking(bookingId) {
  bookings = bookings.filter((booking) => booking.id !== bookingId);
  await saveDashboardState();
  renderBookingsList();
  updateDashboard();
}

if (typeof window !== "undefined") {
  if (typeof window.addEventListener === "function") {
    window.addEventListener("storage", (event) => {
      if (event.key === SHARED_TASKS_KEY || event.key === SUPPORT_BOOKINGS_KEY || event.key === DASHBOARD_STATE_KEY) {
        syncTasksFromSharedStorage();
        syncBookingsFromStorage();
        updateDashboard();
      }
    });

    window.addEventListener("focus", () => {
      syncTasksFromSharedStorage();
      updateDashboard();
    });
  }

  if (typeof window.setInterval === "function") {
    window.setInterval(() => {
      syncTasksFromSharedStorage();
      updateDashboard();
    }, 2000);
  }

  window.onload = initializeDashboard;
  window.toggleTaskDone = toggleTaskDone;
  window.cancelTask = cancelTask;
  window.removeBooking = removeBooking;
  window.saveBooking = saveBooking;
  window.openTasksModal = openTasksModal;
  window.closeTasksModal = closeTasksModal;
  window.openPickerModal = openPickerModal;
  window.closePickerModal = closePickerModal;
  window.changePickerVal = changePickerVal;
  window.resetPickerToToday = resetPickerToToday;
  window.syncTasksFromSharedStorage = syncTasksFromSharedStorage;
}
