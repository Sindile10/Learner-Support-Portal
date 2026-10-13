const defaultTasks = [
  { id: 1, title: 'JavaScript Assignment', status: 'pending' },
  { id: 2, title: 'HTML Basics Quiz', status: 'done' },
  { id: 3, title: 'CSS Flexbox Practice', status: 'done' },
  { id: 4, title: 'Build Portfolio Page', status: 'pending' },
  { id: 5, title: 'Git & GitHub Setup', status: 'done' }
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
  btn.addEventListener('click', () => {
    popup.classList.toggle('show');
    if (dot) {
      dot.style.display = popup.classList.contains('show') ? 'none' : 'block';
    }
  });

  const items = getNotificationMessages();
  popup.innerHTML = '<h4>Notifications</h4>' + items.map((item) => '<div class="notification-item">' + item + '</div>').join('');
}

function normalizeStatus(status) {
  const value = String(status || '').trim().toLowerCase();
  if (value === 'complete' || value === 'done') return 'done';
  if (value === 'in progress' || value === 'pending') return 'pending';
  return 'pending';
}

function loadTasks() {
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

function saveTasks() {
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

  const elements = {
    cardTotal: document.getElementById('cardTotal'),
    cardCompleted: document.getElementById('cardCompleted'),
    cardPending: document.getElementById('cardPending'),
    cardProgress: document.getElementById('cardProgress'),
    graphTotalText: document.getElementById('graphTotalText'),
    graphPendingText: document.getElementById('graphPendingText'),
    graphPercentText: document.getElementById('graphPercentText'),
    centerPercent: document.getElementById('centerPercent'),
    ringPending: document.getElementById('ringPending'),
    ringProgress: document.getElementById('ringProgress')
  };

  if (elements.cardTotal) elements.cardTotal.textContent = total;
  if (elements.cardCompleted) elements.cardCompleted.textContent = completed + ' Task';
  if (elements.cardPending) elements.cardPending.textContent = pending + ' Task';
  if (elements.cardProgress) elements.cardProgress.textContent = percentage + '%';
  if (elements.graphTotalText) elements.graphTotalText.textContent = total;
  if (elements.graphPendingText) elements.graphPendingText.textContent = pending;
  if (elements.graphPercentText) elements.graphPercentText.textContent = percentage + '%';
  if (elements.centerPercent) elements.centerPercent.textContent = percentage + '%';

  const pendingCircle = elements.ringPending;
  const progressCircle = elements.ringProgress;
  const pendingFraction = total > 0 ? pending / total : 0;
  const progressFraction = total > 0 ? completed / total : 0;

  if (pendingCircle) {
    pendingCircle.style.strokeDashoffset = 440 - (440 * pendingFraction);
  }

  if (progressCircle) {
    progressCircle.style.strokeDashoffset = 314 - (314 * progressFraction);
  }

  renderTasksList();
}

function renderTasksList() {
  const container = document.getElementById('taskList');
  if (!container) return;

  container.innerHTML = '';

  tasks.forEach((task) => {
    const row = document.createElement('div');
    row.className = 'task-item';

    row.innerHTML = `
      <div>
        <strong>${task.title}</strong>
        <div style="color:#64748b; margin-top: 4px;">${task.status === 'done' ? 'Completed' : 'Pending'}</div>
      </div>
      ${
        task.status === 'done'
          ? '<span style="color:#16a34a; font-weight:700;">Done</span>'
          : '<button class="action-btn" onclick="markAsDone(' + task.id + ')">Mark done</button>'
      }
    `;

    container.appendChild(row);
  });
}

function markAsDone(taskId) {
  tasks = tasks.map((task) => task.id === taskId ? { ...task, status: 'done' } : task);
  saveTasks();
  updateDashboard();
}

window.addEventListener('storage', (event) => {
  if (event.key === STORAGE_KEY) {
    loadTasks();
    updateDashboard();
  }
});

window.onload = () => {
  bindNotifications();
  loadTasks();
  updateDashboard();
  const button = document.getElementById('btn');
  const sidebar = document.querySelector('.sidebar');
  if (button && sidebar) {
    button.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  }
};
