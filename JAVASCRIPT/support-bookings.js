(function (global) {
    const defaultBooking = {
        id: 'demo-1',
        learner: 'Sindile',
        topic: 'JavaScript',
        date: '2016-08-20',
        notes: 'I need help with login function',
        status: 'In Progress',
        email: 'sindile@learner.com',
        course: 'JavaScript'
    };

    const storageKey = 'supportBooking';
    const bookingsKey = 'supportBookings';
    const pendingKey = 'pendingSupportRequest';
    const firebaseConfig = {
        apiKey: 'AIzaSyC7lu6zwfV2xVAyMU9IFSzlDrOGRRFIHEE',
        authDomain: 'learning-hub-fc831.firebaseapp.com',
        databaseURL: 'https://learning-hub-fc831-default-rtdb.firebaseio.com',
        projectId: 'learning-hub-fc831',
        storageBucket: 'learning-hub-fc831.firebasestorage.app',
        messagingSenderId: '769248182402',
        appId: '1:769248182402:web:6855f3c81832790f15749b'
    };

    function safeStorage() {
        try {
            return typeof localStorage !== 'undefined' ? localStorage : null;
        } catch (error) {
            return null;
        }
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

    function readJSON(key, fallback = null, storage = safeStorage()) {
        if (!storage) {
            return fallback;
        }

        const value = storage.getItem(key);
        if (!value) {
            return fallback;
        }

        try {
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function normalizeBooking(rawBooking, fallback = defaultBooking) {
        const source = rawBooking && typeof rawBooking === 'object' ? rawBooking : {};
        return {
            id: source.id || fallback.id || 'demo-1',
            learner: source.learner || source.name || fallback.learner || 'Sindile',
            topic: source.topic || source.course || fallback.topic || 'JavaScript',
            date: source.date || fallback.date || '2016-08-20',
            notes: source.notes || source.message || fallback.notes || 'I need help with login function',
            status: source.status || fallback.status || 'In Progress',
            email: source.email || fallback.email || 'sindile@learner.com',
            course: source.course || source.topic || fallback.course || 'JavaScript'
        };
    }

    function toBookingList(value) {
        if (!value) return [];
        if (Array.isArray(value)) {
            return value.map((item) => normalizeBooking(item, defaultBooking)).filter(Boolean);
        }
        if (typeof value === 'object') {
            return Object.values(value).map((item) => normalizeBooking(item, defaultBooking)).filter(Boolean);
        }
        return [];
    }

    function getRequestFromUrl() {
        if (typeof URLSearchParams === 'undefined' || typeof window === 'undefined') {
            return null;
        }

        const params = new URLSearchParams(window.location.search);
        const request = {};
        const learner = params.get('learner') || params.get('name') || params.get('student');
        const topic = params.get('topic') || params.get('course');
        const date = params.get('date') || params.get('bookingDate');
        const notes = params.get('notes') || params.get('message');
        const status = params.get('status');
        const email = params.get('email');

        if (learner) request.learner = learner;
        if (topic) request.topic = topic;
        if (date) request.date = date;
        if (notes) request.notes = notes;
        if (status) request.status = status;
        if (email) request.email = email;

        return Object.keys(request).length ? request : null;
    }

    function resolveCurrentBooking(storage = safeStorage()) {
        const pendingRequest = readJSON(pendingKey, null, storage);
        const savedRequests = readJSON(bookingsKey, [], storage);
        const storedRequest = readJSON(storageKey, null, storage);
        const queryRequest = getRequestFromUrl();
        const candidates = [pendingRequest, queryRequest, ...(Array.isArray(savedRequests) ? savedRequests : []), storedRequest];
        const selectedRequest = candidates.find((item) => item && typeof item === 'object' && (
            item.learner || item.name || item.topic || item.course || item.notes || item.message
        ));

        return normalizeBooking(selectedRequest || storedRequest || defaultBooking, defaultBooking);
    }

    function formatDate(dateText) {
        const date = new Date(dateText);
        if (Number.isNaN(date.getTime())) {
            return '20 AUG 2016';
        }

        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }).toUpperCase();
    }

    function persistBooking(booking, storage = safeStorage()) {
        if (!storage) {
            return booking;
        }

        const normalized = normalizeBooking(booking, defaultBooking);
        storage.setItem(storageKey, JSON.stringify(normalized));

        const savedBookings = readJSON(bookingsKey, [], storage);
        const list = Array.isArray(savedBookings) ? savedBookings : [];
        const existingIndex = list.findIndex((item) => item && item.id === normalized.id);

        if (existingIndex >= 0) {
            list[existingIndex] = normalized;
        } else {
            list.push(normalized);
        }

        storage.setItem(bookingsKey, JSON.stringify(list));
        storage.setItem(pendingKey, JSON.stringify(normalized));
        return normalized;
    }

    async function syncToFirebase(bookings) {
        const database = getFirebaseDatabase();
        if (!database || typeof database.ref !== 'function') {
            return false;
        }

        try {
            const bookingMap = {};
            bookings.forEach((booking) => {
                const key = booking.id || `${Date.now()}-${Math.random()}`;
                bookingMap[key] = normalizeBooking(booking, defaultBooking);
            });
            await database.ref('supportBookings').set(bookingMap);
            return true;
        } catch (error) {
            return false;
        }
    }

    async function loadBookingsFromFirebase() {
        const database = getFirebaseDatabase();
        if (!database || typeof database.ref !== 'function') {
            return toBookingList(readJSON(bookingsKey, []));
        }

        try {
            const snapshot = await database.ref('supportBookings').once('value');
            const values = snapshot && typeof snapshot.val === 'function' ? snapshot.val() : null;
            const list = toBookingList(values || readJSON(bookingsKey, []));
            if (list.length) {
                localStorage.setItem(bookingsKey, JSON.stringify(list));
                localStorage.setItem(pendingKey, JSON.stringify(list[list.length - 1]));
            }
            return list;
        } catch (error) {
            return toBookingList(readJSON(bookingsKey, []));
        }
    }

    const api = {
        defaultBooking,
        normalizeBooking,
        resolveCurrentBooking,
        getRequestFromUrl,
        persistBooking,
        formatDate,
        storageKey,
        bookingsKey,
        pendingKey,
        loadBookingsFromFirebase,
        syncToFirebase
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    }

    global.supportBookingUtils = api;

    if (typeof document !== 'undefined') {
        let currentBooking = resolveCurrentBooking();

        const topName = safeStorage() ? (safeStorage().getItem('username') || 'JOHN') : 'JOHN';
        const topUserEl = document.getElementById('topName');
        if (topUserEl) {
            topUserEl.innerHTML = '<i class="bx bx-user-circle"></i> <span>' + topName + '</span> <i class="bx bx-chevron-down"></i>';
        }

        function renderBooking() {
            const booking = currentBooking || defaultBooking;
            const reqName = document.getElementById('reqName');
            const typeName = document.getElementById('typeName');
            const topicName = document.getElementById('topicName');
            const dateName = document.getElementById('dateName');
            const notesText = document.getElementById('notesText');
            const currentStatus = document.getElementById('currentStatus');
            const statusSelect = document.getElementById('statusSelect');
            const pName = document.getElementById('pName');
            const msg = document.getElementById('msg');

            if (reqName) reqName.textContent = 'LEARNER';
            if (typeName) typeName.textContent = booking.learner || 'SINDILE';
            if (topicName) topicName.textContent = booking.topic || 'JAVASCRIPT';
            if (dateName) dateName.textContent = formatDate(booking.date || '2016-08-20');
            if (notesText) notesText.textContent = booking.notes || 'I need help with login function';
            if (currentStatus) currentStatus.textContent = booking.status || 'In Progress';
            if (statusSelect) statusSelect.value = booking.status || 'In Progress';
            if (pName) pName.textContent = booking.learner || 'Sindile';
            const countEl = document.getElementById('pCount');
            if (countEl) countEl.textContent = '1';
            if (msg) msg.textContent = 'Support request received and loaded successfully.';
        }

        function persistCurrentBooking() {
            currentBooking = persistBooking(currentBooking, safeStorage());
            const stored = readJSON(bookingsKey, []);
            const list = Array.isArray(stored) ? stored : [];
            const index = list.findIndex((item) => item && item.id === currentBooking.id);
            if (index >= 0) {
                list[index] = currentBooking;
            } else {
                list.push(currentBooking);
            }
            localStorage.setItem(bookingsKey, JSON.stringify(list));
            syncToFirebase(list);
            renderBooking();
        }

        async function refreshBookingFromFirebase() {
            const bookings = await loadBookingsFromFirebase();
            if (bookings.length) {
                currentBooking = bookings[bookings.length - 1];
                persistBooking(currentBooking, safeStorage());
                renderBooking();
            }
        }

        renderBooking();

        const database = getFirebaseDatabase();
        if (database && typeof database.ref === 'function') {
            database.ref('supportBookings').on('value', (snapshot) => {
                const values = snapshot && typeof snapshot.val === 'function' ? snapshot.val() : null;
                const list = toBookingList(values || readJSON(bookingsKey, []));
                if (list.length) {
                    currentBooking = list[list.length - 1];
                    localStorage.setItem(bookingsKey, JSON.stringify(list));
                    localStorage.setItem(pendingKey, JSON.stringify(currentBooking));
                    renderBooking();
                }
            });
        }

        const statusSelect = document.getElementById('statusSelect');
        if (statusSelect) {
            statusSelect.addEventListener('change', function () {
                currentBooking.status = this.value;
                document.getElementById('currentStatus').textContent = this.value;
                persistCurrentBooking();
                const msg = document.getElementById('msg');
                if (msg) msg.textContent = 'Status updated to ' + this.value;
            });
        }

        const closeBtn = document.getElementById('closeBtn');
        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                const shouldClose = confirm('Close this booking?');
                if (!shouldClose) return;

                currentBooking = { ...defaultBooking, status: 'Closed', id: currentBooking.id || defaultBooking.id };
                persistCurrentBooking();
                const msg = document.getElementById('msg');
                if (msg) msg.textContent = 'Booking closed successfully.';
                alert('Booking closed');
            });
        }

        const viewBtn = document.getElementById('viewBtn');
        if (viewBtn) {
            viewBtn.addEventListener('click', function () {
                const booking = currentBooking || defaultBooking;
                const pName = document.getElementById('pName');
                const countEl = document.getElementById('pCount');
                if (pName) pName.textContent = booking.learner || 'Sindile';
                if (countEl) countEl.textContent = '1';
                const profilePopup = document.getElementById('profilePopup');
                if (profilePopup) profilePopup.classList.remove('hidden');
            });
        }

        const closeProfile = document.getElementById('closeProfile');
        if (closeProfile) {
            closeProfile.addEventListener('click', function () {
                const profilePopup = document.getElementById('profilePopup');
                if (profilePopup) profilePopup.classList.add('hidden');
            });
        }

        const notifBtn = document.getElementById('notifBtn');
        if (notifBtn) {
            notifBtn.addEventListener('click', function () {
                const list = document.getElementById('notifList');
                const msgs = [
                    'Support booking needs attention.',
                    'Learner has updated the notes for this session.',
                    'A follow-up booking reminder is ready.'
                ];

                if (list) list.innerHTML = msgs.map((msg) => '<p>• ' + msg + '</p>').join('');
                const popup = document.getElementById('notifPopup');
                if (popup) popup.classList.remove('hidden');
            });
        }

        const closeNotif = document.getElementById('closeNotif');
        if (closeNotif) {
            closeNotif.addEventListener('click', function () {
                const popup = document.getElementById('notifPopup');
                if (popup) popup.classList.add('hidden');
            });
        }

        const topUser = document.getElementById('topName');
        if (topUser) {
            topUser.addEventListener('click', function () {
                const confirmLogout = confirm('Logout?');
                if (confirmLogout) {
                    const storage = safeStorage();
                    if (storage) {
                        storage.removeItem('username');
                    }
                    window.location.href = 'login.html';
                }
            });
        }

        refreshBookingFromFirebase();
    }

    return api;
})(typeof window !== 'undefined' ? window : globalThis);