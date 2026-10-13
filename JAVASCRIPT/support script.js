const times = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];
const SUPPORT_BOOKINGS_KEY = 'learner_support_bookings';

function readSupportBookings() {
  try {
    const stored = localStorage.getItem(SUPPORT_BOOKINGS_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeSupportBookings(bookings) {
  localStorage.setItem(SUPPORT_BOOKINGS_KEY, JSON.stringify(bookings));

  try {
    const dashboardState = JSON.parse(localStorage.getItem('learner_dashboard_state') || '{}');
    dashboardState.bookings = bookings;
    localStorage.setItem('learner_dashboard_state', JSON.stringify(dashboardState));
  } catch (error) {
    console.warn('Could not sync dashboard booking state.', error);
  }
}

function getNotificationMessages() {
  const bookings = readSupportBookings();

  if (bookings.length) {
    return bookings.slice(-3).reverse().map((booking) => {
      return `Booked: ${booking.topic || 'Support'} on ${booking.date} at ${booking.time}.`;
    });
  }

  return [
    'Your support session reminder is ready.',
    'Two tasks still need your attention this week.',
    'Keep pushing your progress forward.'
  ];
}

function ensureNotificationPopup() {
  const btn = document.querySelector('.notification-btn');
  if (!btn) return null;

  let popup = document.getElementById('notificationPopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'notificationPopup';
    popup.className = 'notification-popup';
    document.body.appendChild(popup);
  }

  return popup;
}

function updateNotificationPopup() {
  const btn = document.querySelector('.notification-btn');
  const popup = ensureNotificationPopup();
  if (!btn || !popup) return;

  const dot = btn.querySelector('.notification-dot') || document.getElementById('notificationDot');
  const items = getNotificationMessages();
  popup.innerHTML = '<h4>Notifications</h4>' + items.map((item) => '<div class="notification-item">' + item + '</div>').join('');

  if (dot) {
    dot.style.display = 'block';
  }
}

function bindNotifications() {
  const btn = document.querySelector('.notification-btn');
  if (!btn) return;

  const popup = ensureNotificationPopup();
  if (!popup) return;

  const dot = btn.querySelector('.notification-dot') || document.getElementById('notificationDot');
  btn.addEventListener('click', () => {
    popup.classList.toggle('show');
    if (dot) {
      dot.style.display = popup.classList.contains('show') ? 'none' : 'block';
    }
  });

  updateNotificationPopup();
}

function populateTimes() {
  const select = document.getElementById('sessionTime');
  if (!select) return;

  select.innerHTML = times
    .map((time) => `<option value="${time}">${time}</option>`)
    .join('');
}

function clearForm() {
  const form = document.getElementById('topicSelect');
  const description = document.getElementById('problemDescription');
  const date = document.getElementById('sessionDate');
  const time = document.getElementById('sessionTime');

  if (form) form.value = 'JavaScript';
  if (description) description.value = '';
  if (date) date.value = '';
  if (time) time.value = times[0];
}

function bookSession() {
  const topic = document.getElementById('topicSelect')?.value || 'JavaScript';
  const description = document.getElementById('problemDescription')?.value.trim() || 'No extra details provided.';
  const date = document.getElementById('sessionDate')?.value;
  const time = document.getElementById('sessionTime')?.value || times[0];

  if (!date) {
    alert('Please choose a date before booking your session.');
    return;
  }

  const booking = {
    id: Date.now(),
    topic,
    date,
    time,
    description
  };

  const bookings = readSupportBookings();
  bookings.push(booking);
  writeSupportBookings(bookings);
  updateNotificationPopup();

  alert('Support request booked for ' + topic + ' on ' + date + ' at ' + time + '.\n\nIssue: ' + description);
  clearForm();
  window.dispatchEvent(new CustomEvent('support-booking-updated', { detail: bookings }));
}

window.addEventListener('DOMContentLoaded', () => {
  populateTimes();
  clearForm();
  bindNotifications();

  const btn = document.getElementById('btn');
  const sidebar = document.querySelector('.sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  }
});
