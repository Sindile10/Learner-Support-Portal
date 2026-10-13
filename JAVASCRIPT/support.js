const times = [
  '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM',
  '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
];
const SUPPORT_BOOKINGS_KEY = 'learner_support_bookings';
const ASSESSOR_MESSAGES_KEY = 'learner_assessor_messages';
const firebaseConfig = {
  apiKey: 'AIzaSyC7lu6zwfV2xVAyMU9IFSzlDrOGRRFIHEE',
  authDomain: 'learning-hub-fc831.firebaseapp.com',
  databaseURL: 'https://learning-hub-fc831-default-rtdb.firebaseio.com',
  projectId: 'learning-hub-fc831',
  storageBucket: 'learning-hub-fc831.firebasestorage.app',
  messagingSenderId: '769248182402',
  appId: '1:769248182402:web:6855f3c81832790f15749b'
};

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || 'null') || { uid: 'guest-user', name: 'Guest Learner' };
  } catch (error) {
    return { uid: 'guest-user', name: 'Guest Learner' };
  }
}

function getCurrentUserId() {
  return getCurrentUser().uid || 'guest-user';
}

function getCurrentUserName() {
  return getCurrentUser().name || 'Guest Learner';
}

function getFirebaseDatabase() {
  const firebaseApi = typeof window !== 'undefined' ? window.firebase : null;
  if (!firebaseApi || typeof firebaseApi.initializeApp !== 'function') {
    return null;
  }

  const apps = firebaseApi.apps || [];
  if (!apps.length) {
    firebaseApi.initializeApp(firebaseConfig);
  }

  if (typeof firebaseApi.database !== 'function') {
    return null;
  }

  return firebaseApi.database();
}

async function firebaseRead(path) {
  const database = getFirebaseDatabase();
  if (!database || typeof database.ref !== 'function') {
    return null;
  }

  try {
    const snapshot = await database.ref(path).once('value');
    return snapshot && typeof snapshot.val === 'function' ? snapshot.val() : null;
  } catch (error) {
    return null;
  }
}

async function firebaseWrite(path, value) {
  const database = getFirebaseDatabase();
  if (!database || typeof database.ref !== 'function') {
    return false;
  }

  try {
    await database.ref(path).set(value);
    return true;
  } catch (error) {
    return false;
  }
}

async function syncSupportMessagesToFirebase(messages) {
  const userId = getCurrentUserId();
  const payload = Array.isArray(messages) ? messages : [];
  const messageMap = {};
  payload.forEach((message) => {
    const id = message.id || Date.now() + Math.random();
    messageMap[id] = message;
  });

  const result1 = firebaseWrite('supportMessages', messageMap);
  const result2 = firebaseWrite(`users/${userId}/supportMessages`, messageMap);
  return Promise.all([result1, result2]);
}

async function syncSupportBookingsToFirebase(bookings) {
  const userId = getCurrentUserId();
  const payload = Array.isArray(bookings) ? bookings : [];
  const bookingMap = {};
  payload.forEach((booking) => {
    const id = booking.id || Date.now() + Math.random();
    bookingMap[id] = booking;
  });

  const result1 = firebaseWrite('supportBookings', bookingMap);
  const result2 = firebaseWrite(`users/${userId}/supportBookings`, bookingMap);
  return Promise.all([result1, result2]);
}

async function loadSupportMessagesFromFirebase() {
  const userId = getCurrentUserId();
  const firebaseMessages = await firebaseRead('supportMessages');
  const userMessages = await firebaseRead(`users/${userId}/supportMessages`);

  const source = firebaseMessages || userMessages || {};
  const normalized = Array.isArray(source)
    ? source
    : Object.values(source);

  if (normalized.length) {
    writeAssessorMessages(normalized);
    renderAssessorMessages();
  }

  return normalized;
}

async function loadSupportBookingsFromFirebase() {
  const userId = getCurrentUserId();
  const firebaseBookings = await firebaseRead('supportBookings');
  const userBookings = await firebaseRead(`users/${userId}/supportBookings`);

  const source = firebaseBookings || userBookings || {};
  const normalized = Array.isArray(source)
    ? source
    : Object.values(source);

  if (normalized.length) {
    writeSupportBookings(normalized);
  }

  return normalized;
}

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
}

function readAssessorMessages() {
  try {
    const stored = localStorage.getItem(ASSESSOR_MESSAGES_KEY);
    const parsed = stored ? JSON.parse(stored) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeAssessorMessages(messages) {
  localStorage.setItem(ASSESSOR_MESSAGES_KEY, JSON.stringify(messages));
}

async function saveSupportMessageToFirebase(messages) {
  await syncSupportMessagesToFirebase(messages);
}

function renderAssessorMessages() {
  const container = document.getElementById('assessorMessagesList');
  if (!container) return;

  const messages = readAssessorMessages();

  if (!messages.length) {
    container.innerHTML = '<p class="empty-state">No messages sent yet.</p>';
    return;
  }

  container.innerHTML = messages
    .slice()
    .reverse()
    .map((message) => `
      <div class="message-item">
        <strong>${message.topic || 'Support'}:</strong>
        <p>${message.message || 'No message provided.'}</p>
        <small>${message.sentAt ? new Date(message.sentAt).toLocaleString() : 'Just now'}</small>
      </div>
    `)
    .join('');
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
  const message = document.getElementById('assessorMessage');
  const date = document.getElementById('sessionDate');
  const time = document.getElementById('sessionTime');
  const status = document.getElementById('supportMessageStatus');

  if (form) form.value = 'JavaScript';
  if (description) description.value = '';
  if (message) message.value = '';
  if (date) date.value = '';
  if (time) time.value = times[0];
  if (status) status.textContent = '';
}

function saveSupportMessage(topic, messageText) {
  const cleanMessage = (messageText || '').trim();
  if (!cleanMessage) {
    return null;
  }

  const messageEntry = {
    id: Date.now(),
    topic,
    message: cleanMessage,
    learnerId: getCurrentUserId(),
    learnerName: getCurrentUserName(),
    sentAt: new Date().toISOString()
  };

  const messages = readAssessorMessages();
  messages.push(messageEntry);
  writeAssessorMessages(messages);
  saveSupportMessageToFirebase(messages);
  renderAssessorMessages();
  return messageEntry;
}

function sendMessageToAssessor() {
  const topic = document.getElementById('topicSelect')?.value || 'JavaScript';
  const message = document.getElementById('assessorMessage')?.value.trim();
  const description = document.getElementById('problemDescription')?.value.trim();
  const finalMessage = message || description;

  if (!finalMessage) {
    alert('Please write a message before sending it to the assessor.');
    return;
  }

  const savedMessage = saveSupportMessage(topic, finalMessage);
  alert('Your message has been sent to the assessor.\n\nTopic: ' + topic + '\nMessage: ' + finalMessage);
  clearForm();

  const status = document.getElementById('supportMessageStatus');
  if (status && savedMessage) {
    status.textContent = 'Your message has been sent to the assessor.';
  }

  if (window && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('assessor-message-sent', { detail: savedMessage }));
  }
}

function bookSession() {
  const topic = document.getElementById('topicSelect')?.value || 'JavaScript';
  const description = document.getElementById('problemDescription')?.value.trim();
  const message = document.getElementById('assessorMessage')?.value.trim();
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
    description: description || message || 'No extra details provided.'
  };

  const bookings = readSupportBookings();
  bookings.push(booking);
  writeSupportBookings(bookings);
  syncSupportBookingsToFirebase(bookings);

  if (description || message) {
    saveSupportMessage(topic, message || description);
  }

  alert('Support request booked for ' + topic + ' on ' + date + ' at ' + time + '.\n\nIssue: ' + (description || message || 'No extra details provided.'));
  clearForm();

  const status = document.getElementById('supportMessageStatus');
  if (status) {
    status.textContent = 'Support session booked and message sent to the assessor.';
  }

  if (window && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new CustomEvent('support-booking-updated', { detail: bookings }));
  }
}

window.addEventListener('DOMContentLoaded', async () => {
  populateTimes();
  clearForm();
  await loadSupportBookingsFromFirebase();
  await loadSupportMessagesFromFirebase();
  renderAssessorMessages();

  const btn = document.getElementById('btn');
  const sidebar = document.querySelector('.sidebar');
  if (btn && sidebar) {
    btn.addEventListener('click', () => sidebar.classList.toggle('collapsed'));
  }
});
