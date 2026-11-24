// Evaluates the bundled card source (test/source.mjs) (a classic script, bundled as is by scripts/build.mjs) in a sandbox with
// minimal DOM stand-ins and returns the names the tests need. No dependency, no browser.
import vm from "node:vm";
import { source } from "./source.mjs";


// Shadow root stand-in: keeps the HTML it is given and the listeners it gets.
const fakeRoot = () => ({
  innerHTML: "",
  listeners: {},
  addEventListener(type, fn) {
    this.listeners[type] = fn;
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
});

// Plain element stand-in (ha-form of the editors): children, listeners and remove() from its parent.
const fakeNode = (tag) => ({
  tagName: String(tag).toUpperCase(),
  style: {},
  dataset: {},
  attributes: {},
  children: [],
  setAttribute(name, value) {
    this.attributes[name] = String(value);
  },
  getAttribute(name) {
    return name in this.attributes ? this.attributes[name] : null;
  },
  hasAttribute(name) {
    return name in this.attributes;
  },
  focus() {
    (this.focused ||= 0);
    this.focused++;
  },
  listeners: {},
  parentNode: null,
  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  },
  addEventListener(type, fn) {
    this.listeners[type] = fn;
  },
  remove() {
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter((c) => c !== this);
    this.parentNode = null;
  },
});

export const load = () => {
  const registry = new Map();
  class HTMLElement {
    attachShadow() {
      this.shadowRoot = fakeRoot();
      return this.shadowRoot;
    }
    dispatchEvent(ev) {
      (this.events ||= []).push(ev);
    }
    appendChild() {}
  }
  class CustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail;
    }
  }
  const sandbox = {
    HTMLElement,
    CustomEvent,
    Intl,
    console: { info() {}, warn() {} },
    customElements: { get: (t) => registry.get(t), define: (t, c) => registry.set(t, c) },
    document: {
      createElement: (t) => (registry.has(t) ? new (registry.get(t))() : fakeNode(t)),
      addEventListener() {},
      removeEventListener() {},
      body: fakeNode("body"),
    },
    setTimeout,
    clearTimeout,
    // Intervals are not run: kept in `intervals` (id → callback) for the tests to fire by hand.
    intervals: new Map(),
    setInterval(fn) {
      const id = Symbol("interval");
      sandbox.intervals.set(id, fn);
      return id;
    },
    clearInterval(id) {
      sandbox.intervals.delete(id);
    },
  };
  // window-level listeners, fired by hand with fire(type, ev).
  const winListeners = {};
  sandbox.addEventListener = (type, fn) => (winListeners[type] ||= new Set()).add(fn);
  sandbox.removeEventListener = (type, fn) => winListeners[type]?.delete(fn);
  sandbox.fire = (type, ev) => {
    for (const fn of [...(winListeners[type] || [])]) fn(ev);
  };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  // The cards read Date.now(): the tests set the instant with setNow(ms).
  vm.runInContext("{ const real = Date.now; Date.now = () => globalThis.__now ?? real(); }", sandbox);
  sandbox.setNow = (ms) => {
    sandbox.__now = ms;
  };
  return vm.runInContext(
    `${source}
    ({ STRINGS, KINDS, esc, lang, intlLocale, dayKey, addDays, diffDays, weekday, eventSpan, parseEvents, covering, discover, childName,
       timetableOf, subjectName, cleanConfig, weekdayName, CAL_CACHE, WORKDAY_CACHE, checkDate, SAINTS, NAME_DAYS, saintOf, binColor, birthdayName, birthdayAge, FamilyDayCard: customElements.get("family-day-card"),
       FamilyDayMiniCard: customElements.get("family-day-mini-card"), FamilyDayCardEditor: customElements.get("family-day-card-editor"),
       FamilyDayMiniCardEditor: customElements.get("family-day-mini-card-editor"), window, document, setNow })`,
    sandbox,
  );
};
