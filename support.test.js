const fs = require('fs');
const assert = require('assert');
const vm = require('vm');

const script = fs.readFileSync('./JAVASCRIPT/support.js', 'utf8');

function createElement(id = '') {
  return {
    id,
    value: '',
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      add() {},
      remove() {},
      toggle() { return true; }
    },
    addEventListener() {},
    appendChild() {},
    setAttribute() {},
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

const storage = createLocalStorage();
const { document } = createDocument();
const sandbox = {
  document,
  window: { addEventListener() {} },
  console,
  alert: () => {},
  Date,
  localStorage: storage,
  setTimeout,
  clearTimeout
};

vm.runInNewContext(script, sandbox);

assert.strictEqual(typeof vm.runInContext('readAssessorMessages', sandbox), 'function');
assert.strictEqual(typeof vm.runInContext('sendMessageToAssessor', sandbox), 'function');

const result = vm.runInContext(`
  const message = { id: 1, topic: 'JavaScript', message: 'I need help with variables.', sentAt: '2026-10-13T10:00:00.000Z' };
  writeAssessorMessages([message]);
  readAssessorMessages()[0].message;
`, sandbox);

assert.strictEqual(result, 'I need help with variables.');
console.log('support regression tests passed');
