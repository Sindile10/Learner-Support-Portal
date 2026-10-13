// Dashboard 1: local functional behaviors without external services
const defaultName = 'John';

function getAccountPreferences() {
    try {
        const saved = localStorage.getItem('accountPreferences') || localStorage.getItem('Account Preferences') || '{}';
        return JSON.parse(saved) || {};
    } catch (error) {
        return {};
    }
}

function getActiveUserName() {
    try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
        const currentName = currentUser && (currentUser.name || currentUser.username || currentUser.displayName);
        if (currentName) {
            return String(currentName).trim();
        }
    } catch (error) {
        // Ignore malformed current user data and fall back to stored username.
    }

    const preferences = getAccountPreferences();
    if (preferences.name) {
        return String(preferences.name).trim();
    }

    const storedName = localStorage.getItem('username');
    if (storedName) {
        return String(storedName).trim();
    }

    return defaultName;
}

const welcomeName = document.getElementById('welcomeName');
const userNameTop = document.getElementById('userNameTop');
const countEl = document.getElementById('count');
const statusEl = document.getElementById('status');
const notifBtn = document.getElementById('notifBtn');
const notifPopup = document.getElementById('notifPopup');
const notifList = document.getElementById('notifList');
const closeNotif = document.getElementById('closeNotif');
const userTop = document.getElementById('userTop');
const inboxEl = document.getElementById('assessorInbox');

function readSupportBookings() {
    const keys = ['supportBookings', 'learner_support_bookings'];
    const merged = [];
    const seen = new Set();

    keys.forEach((key) => {
        try {
            const raw = localStorage.getItem(key);
            if (!raw) return;

            const parsed = JSON.parse(raw);
            const list = Array.isArray(parsed) ? parsed : Object.values(parsed || {});
            list.forEach((booking) => {
                if (!booking || typeof booking !== 'object') return;
                const identity = booking.id || (booking.topic || 'support') + '|' + (booking.date || booking.sentAt || '') + '|' + (booking.description || booking.message || booking.notes || '');
                if (!seen.has(identity)) {
                    seen.add(identity);
                    merged.push(booking);
                }
            });
        } catch (error) {
            // Ignore malformed local storage values.
        }
    });

    if (merged.length) {
        localStorage.setItem('supportBookings', JSON.stringify(merged));
    }

    return merged;
}

function renderInboxBookings() {
    const bookings = readSupportBookings();
    if (!inboxEl) return bookings;

    if (!bookings.length) {
        inboxEl.innerHTML = '<p class="empty-state">Waiting for new booking requests...</p>';
        return bookings;
    }

    inboxEl.innerHTML = bookings
        .slice()
        .reverse()
        .map((booking) => {
            const learner = booking.learner || booking.name || booking.student || 'Learner';
            const topic = booking.topic || booking.course || 'Support Request';
            const detail = booking.message || booking.notes || booking.description || 'No details provided.';
            const dateText = booking.date || booking.sentAt || 'Just now';
            const when = dateText && !Number.isNaN(Date.parse(dateText)) ? new Date(dateText).toLocaleString() : dateText;

            return `
                <div class="message-card">
                    <strong>${topic} from ${learner}</strong>
                    <div class="message-meta">${booking.email || 'Learner'} • ${when}</div>
                    <p>${detail}</p>
                </div>
            `;
        })
        .join('');

    return bookings;
}

function updateUserNameDisplay() {
    const activeName = getActiveUserName();
    if (welcomeName) welcomeName.textContent = activeName;
    if (userNameTop) userNameTop.textContent = activeName.toUpperCase();
}

updateUserNameDisplay();

function refreshDashboardState() {
    updateUserNameDisplay();
    const bookings = readSupportBookings();
    const tasks = JSON.parse(localStorage.getItem('learnerTasks') || '[]');
    const total = bookings.length + tasks.length;
    if (countEl) countEl.textContent = String(total);
    if (statusEl) statusEl.textContent = 'You have ' + bookings.length + ' booking(s) and ' + tasks.length + ' task(s) to review.';
    renderInboxBookings();
}

refreshDashboardState();

if (document.getElementById('goSupport')) {
    document.getElementById('goSupport').addEventListener('click', function () {
        window.location.href = 'support-bookings.html';
    });
}

if (document.getElementById('goTask')) {
    document.getElementById('goTask').addEventListener('click', function () {
        window.location.href = 'task.html';
    });
}

if (notifBtn) {
    notifBtn.addEventListener('click', function () {
        const messages = [
            '3 support booking updates are waiting for review.',
            '2 learner tasks still need progress updates.',
            'Your next support session reminder is ready.'
        ];

        notifList.innerHTML = messages
            .map((item) => '<p>• ' + item + '</p>')
            .join('');

        notifPopup.classList.remove('hidden');
    });
}

if (closeNotif) {
    closeNotif.addEventListener('click', function () {
        notifPopup.classList.add('hidden');
    });
}

if (userTop) {
    userTop.addEventListener('click', function () {
        const confirmLogout = confirm('Logout?');
        if (confirmLogout) {
            localStorage.removeItem('username');
            window.location.href = 'login.html';
        }
    });
}

if (window && typeof window.addEventListener === 'function') {
    window.addEventListener('storage', refreshDashboardState);
    window.addEventListener('support-booking-updated', refreshDashboardState);
}
