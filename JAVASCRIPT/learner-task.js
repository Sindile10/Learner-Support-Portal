(function () {
    const firebaseConfig = {
        apiKey: 'AIzaSyC7lu6zwfV2xVAyMU9IFSzlDrOGRRFIHEE',
        authDomain: 'learning-hub-fc831.firebaseapp.com',
        databaseURL: 'https://learning-hub-fc831-default-rtdb.firebaseio.com',
        projectId: 'learning-hub-fc831',
        storageBucket: 'learning-hub-fc831.firebasestorage.app',
        messagingSenderId: '769248182402',
        appId: '1:769248182402:web:6855f3c81832790f15749b'
    };

    const demoData = [
        { id: 'demo-1', date: '2026-08-10', time: '09:24 AM', learner: 'SINDILE', activity: 'COMPLETED TASK', status: 'COMPLETE', type: 'demo' },
        { id: 'demo-2', date: '2026-08-10', time: '08:17 AM', learner: 'RIXONGILE', activity: 'BOOKED SUPPORT', status: 'NEW', type: 'demo' },
        { id: 'demo-3', date: '2026-08-10', time: '07:52 AM', learner: 'KHETHELO', activity: 'UPDATED TASK', status: 'UPDATED', type: 'demo' }
    ];

    let allData = [];
    let filtered = [];
    let selectedId = null;
    let selectedType = null;

    function safeStorage() {
        try {
            return typeof localStorage !== 'undefined' ? localStorage : null;
        } catch (error) {
            return null;
        }
    }

    function readJSON(key, fallback) {
        const storage = safeStorage();
        if (!storage) return fallback;

        try {
            const value = storage.getItem(key);
            if (!value) return fallback;
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        const storage = safeStorage();
        if (!storage) return;
        storage.setItem(key, JSON.stringify(value));
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

    function normalizeTaskItem(item) {
        if (!item || typeof item !== 'object') return null;
        return {
            id: item.id || item.taskId || Date.now() + Math.random(),
            date: item.date || item.dueDate || item.createdAt || new Date().toISOString(),
            time: item.time || '09:24 AM',
            learner: item.learner || item.userId || item.name || 'SINDILE',
            activity: item.activity || item.title || 'TASK',
            status: item.status || 'COMPLETE',
            type: 'task',
            raw: item
        };
    }

    function normalizeBookingItem(item) {
        if (!item || typeof item !== 'object') return null;
        return {
            id: item.id || item.bookingId || Date.now() + Math.random(),
            date: item.date || item.sentAt || item.bookingDate || new Date().toISOString(),
            time: item.time || '08:17 AM',
            learner: item.learner || item.student || item.name || 'RIXONGILE',
            activity: item.activity || item.message || item.notes || item.description || item.topic || item.course || 'BOOKED SUPPORT',
            status: item.status || 'NEW',
            type: 'booking',
            raw: item
        };
    }

    function readTaskItems() {
        const taskSources = [
            readJSON('learner_tasks', []),
            readJSON('learner_dashboard_state', { tasks: [] }).tasks || []
        ];

        const merged = [];
        const seen = new Set();

        taskSources.forEach((source) => {
            const items = Array.isArray(source) ? source : Object.values(source || {});
            items.forEach((item) => {
                const normalized = normalizeTaskItem(item);
                if (!normalized) return;
                const identity = normalized.id || `${normalized.learner}-${normalized.date}-${normalized.activity}`;
                if (!seen.has(identity)) {
                    seen.add(identity);
                    merged.push(normalized);
                }
            });
        });

        if (!merged.length) {
            const state = readJSON('learner_dashboard_state', { tasks: [] });
            if (Array.isArray(state.tasks)) {
                return state.tasks.map(normalizeTaskItem).filter(Boolean);
            }
        }

        return merged;
    }

    function readBookingItems() {
        const merged = [];
        const keys = ['supportBookings', 'learner_support_bookings', 'supportBooking', 'pendingSupportRequest'];
        const seen = new Set();

        keys.forEach((key) => {
            const raw = readJSON(key, []);
            const values = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];

            values.forEach((item) => {
                const normalized = normalizeBookingItem(item);
                if (!normalized) return;
                const identity = normalized.id || item?.title || `${normalized.learner}-${normalized.activity}-${normalized.date}`;
                if (!seen.has(identity)) {
                    seen.add(identity);
                    merged.push(normalized);
                }
            });
        });

        return merged;
    }

    function buildDataSet() {
        const tasks = readTaskItems();
        const bookings = readBookingItems();
        const data = [...tasks, ...bookings];

        if (!data.length) {
            return demoData.map((item) => ({ ...item }));
        }

        return data.sort((a, b) => new Date(b.date) - new Date(a.date));
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

        const savedName = localStorage.getItem('username');
        return savedName ? String(savedName).trim() : 'JOHN';
    }

    function updateName() {
        const topName = document.getElementById('topName');
        if (!topName) return;
        const myName = getActiveUserName();
        topName.textContent = myName.toUpperCase();
    }

    function showTable() {
        const tbody = document.getElementById('tableBody');
        const searchInput = document.getElementById('search');
        const dateFilter = document.getElementById('dateRange');
        const showText = document.getElementById('showText');
        const msg = document.getElementById('msg');
        const notifCount = document.getElementById('notifCount');

        if (!tbody) return;

        const search = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const filter = dateFilter ? dateFilter.value : 'All';

        filtered = allData.filter((item) => {
            const learnerName = (item.learner || '').toLowerCase();
            if (search && !learnerName.includes(search)) return false;

            if (filter === 'today') {
                const today = new Date().toDateString();
                return new Date(item.date).toDateString() === today;
            }

            return true;
        });

        tbody.innerHTML = filtered
            .map((item) => {
                const date = new Date(item.date);
                const dateStr = Number.isNaN(date.getTime())
                    ? item.date
                    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

                const badgeClass = item.status === 'NEW' ? 'blue' : item.status === 'UPDATED' ? 'light' : 'green';
                const icon = item.status === 'NEW' ? '🕒' : item.status === 'UPDATED' ? '🔄' : '✓';

                return `
                    <tr>
                        <td><b>${dateStr}</b><br><span style="color:gray; font-size:10px;">${item.time || '09:00 AM'}</span></td>
                        <td><div class="learner"><div class="pic">👤</div> ${item.learner || 'SINDILE'}</div></td>
                        <td>${item.activity || 'Support request'}</td>
                        <td><span class="badge ${badgeClass}">${icon} ${item.status || 'COMPLETE'}</span></td>
                        <td><span class="dots" onclick="openTaskMenu('${item.id}', '${item.type || 'task'}')">⋮</span></td>
                    </tr>
                `;
            })
            .join('');

        if (showText) {
            showText.textContent = `Showing 1 - ${filtered.length || 0} of ${filtered.length || 0}`;
        }

        if (msg) {
            msg.textContent = `Loaded ${allData.length} activities from saved data.`;
        }

        if (notifCount) {
            notifCount.textContent = String(filtered.length || 0);
        }
    }

    function openTaskMenu(id, type) {
        selectedId = id;
        selectedType = type || 'task';
        const item = allData.find((entry) => String(entry.id) === String(id));
        if (!item) return;

        const popupLearner = document.getElementById('popupLearner');
        const popupDate = document.getElementById('popupDate');
        const popup = document.getElementById('actionPopup');

        if (popupLearner) popupLearner.textContent = item.learner || 'Learner';
        if (popupDate) popupDate.textContent = `${item.date} - ${item.activity}`;
        if (popup) popup.classList.remove('hidden');
    }

    function refreshFromStorage() {
        allData = buildDataSet();
        showTable();
    }

    function syncDashboardTaskState(tasksList) {
        const storage = safeStorage();
        if (!storage) return;

        const dashboardState = readJSON('learner_dashboard_state', { tasks: [], bookings: [] });
        dashboardState.tasks = Array.isArray(tasksList) ? tasksList : [];
        dashboardState.bookings = readBookingItems();
        storage.setItem('learner_dashboard_state', JSON.stringify(dashboardState));
        storage.setItem('learner_tasks', JSON.stringify(tasksList));
    }

    function handleDelete() {
        const type = selectedType || 'task';
        const id = selectedId;
        if (!id) return;

        if (type === 'task') {
            const tasks = readTaskItems().filter((item) => String(item.id) !== String(id));
            syncDashboardTaskState(tasks);
        } else {
            const bookings = readBookingItems().filter((item) => String(item.id) !== String(id));
            writeJSON('supportBookings', bookings);
            writeJSON('learner_support_bookings', bookings);
        }

        const popup = document.getElementById('actionPopup');
        if (popup) popup.classList.add('hidden');
        refreshFromStorage();
    }

    function handleComplete() {
        const type = selectedType || 'task';
        const id = selectedId;
        if (!id) return;

        if (type === 'task') {
            const tasks = readTaskItems().map((item) => (String(item.id) === String(id) ? { ...item, status: 'COMPLETE' } : item));
            syncDashboardTaskState(tasks);
        } else {
            const bookings = readBookingItems().map((item) => (String(item.id) === String(id) ? { ...item, status: 'COMPLETE' } : item));
            writeJSON('supportBookings', bookings);
            writeJSON('learner_support_bookings', bookings);
        }

        const popup = document.getElementById('actionPopup');
        if (popup) popup.classList.add('hidden');
        refreshFromStorage();
    }

    function bindEvents() {
        const search = document.getElementById('search');
        if (search) {
            search.onkeyup = showTable;
        }

        const range = document.getElementById('dateRange');
        if (range) {
            range.onchange = showTable;
        }

        const closeBtn = document.getElementById('btnClose');
        if (closeBtn) {
            closeBtn.onclick = () => {
                const popup = document.getElementById('actionPopup');
                if (popup) popup.classList.add('hidden');
            };
        }

        const deleteBtn = document.getElementById('btnDelete');
        if (deleteBtn) {
            deleteBtn.onclick = () => {
                if (confirm('Delete this activity?')) {
                    handleDelete();
                }
            };
        }

        const completeBtn = document.getElementById('btnComplete');
        if (completeBtn) {
            completeBtn.onclick = handleComplete;
        }

        const notifBtn = document.getElementById('notifBtn');
        if (notifBtn) {
            notifBtn.onclick = () => {
                alert('You have ' + filtered.length + ' activities to review.');
            };
        }

        const userTop = document.getElementById('userTop');
        if (userTop) {
            userTop.onclick = () => {
                const confirmLogout = confirm('Logout?');
                if (confirmLogout) {
                    const storage = safeStorage();
                    if (storage) {
                        storage.removeItem('username');
                    }
                    window.location.href = 'login.html';
                }
            };
        }
    }

    function attachRealtimeListener() {
        const database = getFirebaseDatabase();
        if (!database || typeof database.ref !== 'function') return;

        database.ref('supportBookings').on('value', (snapshot) => {
            const values = snapshot && typeof snapshot.val === 'function' ? snapshot.val() : null;
            const list = Array.isArray(values) ? values : values ? Object.values(values) : [];
            if (list.length) {
                writeJSON('supportBookings', list);
                writeJSON('learner_support_bookings', list);
            }
            refreshFromStorage();
        });
    }

    function initialize() {
        updateName();
        bindEvents();
        refreshFromStorage();
        attachRealtimeListener();

        if (window && typeof window.addEventListener === 'function') {
            window.addEventListener('storage', () => {
                updateName();
                refreshFromStorage();
            });
            window.addEventListener('support-booking-updated', () => {
                updateName();
                refreshFromStorage();
            });
        }
    }

    window.openTaskMenu = openTaskMenu;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();
