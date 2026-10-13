const defaultTasks = [
  { id: 1, title: 'JavaScript Assignment', status: 'pending' },
  { id: 2, title: 'HTML Website Design', status: 'done' },
  { id: 3, title: 'CSS Layouts Practice', status: 'done' },
  { id: 4, title: 'Git & GitHub Basics', status: 'pending' },
  { id: 5, title: 'Database Principles', status: 'done' }
];

const STORAGE_KEY = 'learner_tasks';
const SUPPORT_BOOKINGS_KEY = 'learner_support_bookings';
let tasks = [];

function getNotificationMessages() {
  try {
    const bookings = JSON.parse(localStorage.getItem(SUPPORT_BOOKINGS_KEY) || '[]');
    if (Array.isArray(bookings) && bookings.length) {
      return bookings.slice(-3).reverse().map((booking) => `Booked: ${booking.topic || 'Support'} on ${booking.date} at ${booking.time}.`);
    }
  } catch (error) {
    console.warn('Could not load support notifications.', error);
  }

  return [
    'Your support session reminder is ready.',
    'Two tasks still need your attention this week.',
    'Keep pushing your progress forward.'
  ];
}

function bindNotifications() {
  const btn = document.querySelector('.notification-btn');
  if (!btn) return;

  let popup = document.getElementById('notificationPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'notificationPopup';
    popup.className = 'notification-popup';
    document.body.appendChild(popup);
  }

  const dot = btn.querySelector('.notification-dot');
  const updatePopup = () => {
    const items = getNotificationMessages();
    popup.innerHTML = '<h4>Notifications</h4>' + items.map((item) => '<div class="notification-item">' + item + '</div>').join('');
  };

  btn.addEventListener('click', () => {
    popup.classList.toggle('show');
    if (dot) {
      dot.style.display = popup.classList.contains('show') ? 'none' : 'block';
    }
  });

  updatePopup();
}

function normalizeStatus(status) {
  const value = String(status || '').trim().toLowerCase();
  if (value === 'complete' || value === 'done') return 'done';
  if (value === 'in progress' || value === 'pending') return 'pending';
  return 'pending';
}

function loadSharedTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length) {
        tasks = parsed.map((task) => ({
          id: Number(task.id) || Date.now() + Math.random(),
          title: task.title || 'Untitled task',
          status: normalizeStatus(task.status)
        }));
        return;
      }
    }
  } catch (error) {
    console.warn('Could not load shared tasks.', error);
  }

  tasks = defaultTasks.map((task) => ({ ...task, status: normalizeStatus(task.status) }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function saveSharedTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateDashboard() {
  const total = tasks.length;
  let completed = 0;
  let pending = 0;

  tasks.forEach((task) => {
    if (task.status === 'done') completed += 1;
    else pending += 1;
  });

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const cardTotal = document.getElementById('cardTotal');
  const cardCompleted = document.getElementById('cardCompleted');
  const cardPending = document.getElementById('cardPending');
  const cardProgress = document.getElementById('cardProgress');
  const graphTotalText = document.getElementById('graphTotalText');
  const graphPendingText = document.getElementById('graphPendingText');
  const graphPercentText = document.getElementById('graphPercentText');
  const centerPercent = document.getElementById('centerPercent');
  const ringPending = document.getElementById('ringPending');
  const ringProgress = document.getElementById('ringProgress');
  const tblCompleted = document.getElementById('tblCompleted');
  const tblPending = document.getElementById('tblPending');
  const tblOverdue = document.getElementById('tblOverdue');
  const statusBox = document.getElementById('statusMessage');

  if (cardTotal) cardTotal.textContent = total;
  if (cardCompleted) cardCompleted.textContent = completed + ' Task';
  if (cardPending) cardPending.textContent = pending + ' Task';
  if (cardProgress) cardProgress.textContent = percentage + '%';
  if (graphTotalText) graphTotalText.textContent = total;
  if (graphPendingText) graphPendingText.textContent = pending;
  if (graphPercentText) graphPercentText.textContent = percentage + '%';
  if (centerPercent) centerPercent.textContent = percentage + '%';
  if (tblCompleted) tblCompleted.textContent = completed;
  if (tblPending) tblPending.textContent = pending;
  if (tblOverdue) tblOverdue.textContent = '0';

  if (ringPending) {
    const pendingRatio = total > 0 ? pending / total : 0;
    ringPending.style.strokeDashoffset = 440 - (440 * pendingRatio);
  }

  if (ringProgress) {
    const progressRatio = total > 0 ? completed / total : 0;
    ringProgress.style.strokeDashoffset = 314 - (314 * progressRatio);
  }

  if (statusBox) {
    if (percentage >= 80) statusBox.textContent = 'Outstanding progress! You are almost finished with all tasks.';
    else if (percentage >= 50) statusBox.textContent = 'Good progress! Keep working on your remaining tasks.';
    else statusBox.textContent = 'Keep going! Complete more pending tasks to boost your score.';
  }

  saveSharedTasks();
  renderTasksList();
}

function renderTasksList() {
  const listContainer = document.getElementById('taskList');
  if (!listContainer) return;

  listContainer.innerHTML = '';

  tasks.forEach((task) => {
    const row = document.createElement('div');
    row.className = 'task-item';

    row.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <div style="color:#64748b; margin-top:4px;">${task.status === 'done' ? 'Completed' : 'Pending'}</div>
      </div>
      ${
        task.status === 'done'
          ? '<span style="color:#16a34a; font-weight:700;">Done</span>'
          : '<button class="btn btn-complete" type="button" onclick="markTaskDone(' + task.id + ')">Mark done</button>'
      }
    `;

    listContainer.appendChild(row);
  });
}

function addNewTask() {
  const title = prompt('Enter new task title:', 'Python Basics');
  if (!title) return;

  tasks.push({
    id: Date.now(),
    title: title.trim() || 'New task',
    status: 'pending'
  });

  updateDashboard();
}

function markTaskDone(taskId) {
  tasks = tasks.map((task) => task.id === taskId ? { ...task, status: 'done' } : task);
  updateDashboard();
}

document.getElementById('btn')?.addEventListener('click', () => {
  document.querySelector('.sidebar')?.classList.toggle('collapsed');
});

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    loadSharedTasks();
    updateDashboard();
  }
});

window.onload = function () {
  bindNotifications();
  loadSharedTasks();
  updateDashboard();
};
