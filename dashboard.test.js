const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const script = fs.readFileSync('./JAVASCRIPT/dashboard.js', 'utf8');

function createElement(id = '') {
  return {
    id,
    innerText: '',
    textContent: '',
    innerHTML: '',
    style: {},
    dataset: {},
    classList: {
      add() {},
      remove() {},
      toggle() { return true; }
    },
    setAttribute() {},
    appendChild() {},
    addEventListener() {},
    getAttribute() { return null; }
  };
}

function createDocument() {
  const map = new Map();
  const document = {
    addEventListener() {},
    querySelector() { return null; },
    querySelectorAll() { return []; },
    createElement(tagName) {
      return createElement(tagName);
    },
    getElementById(id) {
      if (!map.has(id)) {
        map.set(id, createElement(id));
      }
      return map.get(id);
    }
  };
  return { document, map };
}

function createLocalStorage() {
  const store = new Map();
  return {
    getItem(key) { return store.has(key) ? store.get(key) : null; },
    setItem(key, value) { store.set(String(key), String(value)); },
    removeItem(key) { store.delete(key); },
    clear() { store.clear(); }
  };
}

function loadDashboard(storage = createLocalStorage()) {
  const { document } = createDocument();
  const sandbox = {
    document,
    window: { onload: null },
    console,
    alert: () => {},
    confirm: () => true,
    Date,
    setTimeout,
    clearTimeout,
    localStorage: storage
  };
  vm.runInNewContext(script, sandbox);
  return sandbox;
}

const sandbox = loadDashboard();

assert.strictEqual(typeof vm.runInContext('getUpcomingTasks', sandbox), 'function');
assert.strictEqual(typeof vm.runInContext('updateDashboard', sandbox), 'function');

const upcoming = vm.runInContext('getUpcomingTasks().map(task => task.title).slice(0, 2)', sandbox);
assert.deepStrictEqual(Array.from(upcoming), ['JavaScript Project', 'Build a To-Do List with JavaScript']);

const storage = createLocalStorage();
const liveSandbox = loadDashboard(storage);
storage.setItem('learner_tasks', JSON.stringify([
  { id: 55, title: 'New Assignment', status: 'In Progress', dueDate: '2026-11-12' },
  { id: 56, title: 'Finished Reading', status: 'Complete', dueDate: '2026-11-14' }
]));
vm.runInContext('syncTasksFromSharedStorage(); updateDashboard();', liveSandbox);
assert.strictEqual(vm.runInContext('tasks.length', liveSandbox), 2);
assert.strictEqual(vm.runInContext('document.getElementById("statTotal").innerText', liveSandbox), 2);
assert.strictEqual(vm.runInContext('document.getElementById("statPending").innerText', liveSandbox), 1);
assert.strictEqual(vm.runInContext('document.getElementById("statProgressBadge").innerText', liveSandbox), '50%');

const dashboardOneScript = fs.readFileSync('./JAVASCRIPT/dashboard 1.js', 'utf8');
const dashboardOneElements = {};
for (const id of ['welcomeName', 'userNameTop', 'count', 'status', 'notifBtn', 'notifPopup', 'notifList', 'closeNotif', 'userTop', 'assessorInbox']) {
  dashboardOneElements[id] = createElement(id);
}
const dashboardOneStorage = createLocalStorage();
dashboardOneStorage.setItem('username', 'Assessor');
dashboardOneStorage.setItem('learner_support_bookings', JSON.stringify([
  { id: 7, topic: 'JavaScript', date: '2026-10-13', description: 'Need help with forms' }
]));
const dashboardOneListeners = {};
const dashboardOneSandbox = {
  document: {
    getElementById(id) {
      if (!dashboardOneElements[id]) {
        dashboardOneElements[id] = createElement(id);
      }
      return dashboardOneElements[id];
    },
    querySelector() { return null; }
  },
  localStorage: dashboardOneStorage,
  window: {
    location: { href: '' },
    addEventListener(event, callback) {
      dashboardOneListeners[event] = dashboardOneListeners[event] || [];
      dashboardOneListeners[event].push(callback);
    }
  },
  console,
  alert: () => {},
  confirm: () => true,
  Date,
  setTimeout,
  clearTimeout
};
vm.runInNewContext(dashboardOneScript, dashboardOneSandbox);
assert.strictEqual(dashboardOneElements.count.textContent, '1');
assert.match(dashboardOneElements.assessorInbox.innerHTML, /Need help with forms/);

dashboardOneStorage.setItem('username', 'Jane');
dashboardOneListeners.storage[0]();
assert.strictEqual(dashboardOneElements.welcomeName.textContent, 'Mr Jane');
assert.strictEqual(dashboardOneElements.userNameTop.textContent, 'JANE');

const loginScript = fs.readFileSync('./JAVASCRIPT/login.js', 'utf8');
const loginStorage = createLocalStorage();
loginStorage.setItem('registeredUsers', JSON.stringify([
  { uid: 'assessor-1', name: 'Ava Assessor', email: 'assessor@test.com', password: 'Password1', role: 'assessor' },
  { uid: 'learner-1', name: 'Ben Learner', email: 'learner@test.com', password: 'Password2', role: 'learner' }
]));
const loginElements = {};
loginElements.authForm = {
  addEventListener(event, handler) {
    if (event === 'submit') {
      this.submitHandler = handler;
    }
  }
};
for (const id of ['email', 'password', 'submitBtn', 'emailError', 'passError', 'usernameError', 'roleError']) {
  loginElements[id] = createElement(id);
}
loginElements.email.value = 'assessor@test.com';
loginElements.password.value = 'Password1';
loginElements.submitBtn.textContent = 'Login';
loginElements.submitBtn.disabled = false;
const loginSandbox = {
  document: {
    getElementById(id) {
      return loginElements[id] || null;
    }
  },
  localStorage: loginStorage,
  window: { location: { href: '' } },
  console,
  alert: () => {},
  setTimeout(fn) { fn(); return 0; },
  clearTimeout() {}
};
vm.runInNewContext(loginScript, loginSandbox);
loginElements.authForm.submitHandler({ preventDefault() {} });
assert.strictEqual(loginSandbox.window.location.href, 'assessor-dashboard.html?role=assessor');
assert.strictEqual(JSON.parse(loginStorage.getItem('currentUser')).role, 'assessor');

const learnerTaskScript = fs.readFileSync('./JAVASCRIPT/learner-task.js', 'utf8');
const learnerTaskElements = {};
for (const id of ['topName', 'search', 'dateRange', 'tableBody', 'showText', 'msg', 'notifCount', 'actionPopup', 'popupLearner', 'popupDate', 'btnClose', 'btnDelete', 'btnComplete', 'notifBtn', 'userTop']) {
  learnerTaskElements[id] = createElement(id);
}
learnerTaskElements.search.value = '';
learnerTaskElements.dateRange.value = 'All';
const learnerTaskStorage = createLocalStorage();
learnerTaskStorage.setItem('username', 'John');
learnerTaskStorage.setItem('learner_dashboard_state', JSON.stringify({
  tasks: [{ id: 21, title: 'Dashboard task', status: 'In Progress', dueDate: '2026-10-14' }],
  bookings: [{ id: 11, learner: 'Sihle', topic: 'JavaScript', date: '2026-10-13', status: 'NEW', message: 'Need help with the form' }]
}));
learnerTaskStorage.setItem('supportBookings', JSON.stringify([
  { id: 11, learner: 'Sihle', topic: 'JavaScript', date: '2026-10-13', status: 'NEW', message: 'Need help with the form' }
]));
const learnerTaskListeners = {};
const learnerTaskSandbox = {
  document: {
    readyState: 'complete',
    addEventListener() {},
    getElementById(id) {
      if (!learnerTaskElements[id]) {
        learnerTaskElements[id] = createElement(id);
      }
      return learnerTaskElements[id];
    }
  },
  localStorage: learnerTaskStorage,
  window: {
    location: { href: '' },
    addEventListener(event, callback) {
      learnerTaskListeners[event] = learnerTaskListeners[event] || [];
      learnerTaskListeners[event].push(callback);
    },
    firebase: {
      apps: [],
      initializeApp() {},
      database() {
        return {
          ref() {
            return {
              on() {},
              once() {
                return Promise.resolve({ val: () => null });
              }
            };
          }
        };
      }
    }
  },
  alert: () => {},
  confirm: () => true,
  console,
  Date,
  Promise,
  setTimeout,
  clearTimeout
};
vm.runInNewContext(learnerTaskScript, learnerTaskSandbox);
learnerTaskStorage.setItem('username', 'Alex');
learnerTaskListeners.storage[0]();
assert.strictEqual(learnerTaskElements.topName.textContent, 'ALEX');
assert.match(learnerTaskElements.tableBody.innerHTML, /Dashboard task|Need help with the form|booked support/i);
assert.strictEqual(learnerTaskElements.notifCount.textContent, '2');

console.log('dashboard regression tests passed');
