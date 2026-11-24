// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------
import { ICONS } from "./icons.js";
import { DEFAULT_IGNORE, DEFAULT_SCHOOL_DAYS, WEEKDAYS, binColor, birthdayAge, birthdayName, saintOf } from "./kinds-day.js";
import { esc, intlLocale, lang, svgIcon, t, valid } from "./helpers.js";
import { addDays, dayKey, diffDays, fmtDay, fmtRel, fmtTime, fmtWeekday, upperFirst, weekday } from "./days.js";
import { calendarData, checkDate, covering, parseEvents } from "./calendar-events.js";
import { discover } from "./discovery-through-registries.js";
import { subjectName, timetableOf } from "./pronote-timetables.js";
import { SCENE_STYLE, SCHOOL_ICON, art, fdSceneSvg, isNight } from "./pictures-days.js";
import { ART_STYLE, BASE_STYLE, FULL_STYLE, MINI_STYLE, TWODAY_STYLE } from "./styles.js";
import { holdUnderPress, morph, sameDeps, watchOutside } from "./interaction-helpers.js";

export let fdUid = 0;

// The width of an element's whole text in its own font, in fractional pixels (scrollWidth is rounded).
export let fdTextCtx;
export const fdTextWidth = (el) => {
  const cs = getComputedStyle(el);
  fdTextCtx ??= document.createElement("canvas").getContext?.("2d");
  if (!fdTextCtx) return el.scrollWidth;
  fdTextCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  const pad = (parseFloat(cs.paddingLeft) || 0) + (parseFloat(cs.paddingRight) || 0);
  return Math.max(el.scrollWidth, fdTextCtx.measureText(el.textContent.trim()).width + pad);
};

export class FamilyDayBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._uid = ++fdUid;
    this._html = "";
    this._kinds = {};
    this._ghosts = {};
    this._swaps = {};
    this._loaded = 0;
    this._reload = () => {
      this._loaded++;
      this._update();
    };
    holdUnderPress(this, () => this._update());
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
    // The picture that left has finished its animation: it is dropped.
    this.shadowRoot.addEventListener("animationend", (ev) => {
      const slot = ev.target?.dataset?.ghost;
      if (!slot || !this._ghosts[slot]) return;
      delete this._ghosts[slot];
      this._update();
    });
  }

  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  // What a render reads from hass: the states of its sources, the language, the day and the data loaded.
  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const src = this._sources();
    const ids = [src.workday, src.school_holidays, src.public_holidays, ...src.waste, ...src.birthdays, ...src.children.flatMap((c) => [c.today, c.tomorrow, c.next_day])];
    return [h.entities, h.devices, h.language, h.locale, this._loaded, this._minute, h.themes?.darkMode, ...ids.map((id) => (id ? h.states[id] : undefined))];
  }

  connectedCallback() {
    if (this._hass && this._config) this._update();
    if (!this._fitObserver && typeof ResizeObserver === "function") this._fitObserver = new ResizeObserver(() => this._fitPill());
    this._fitObserver?.observe(this);
    document.fonts?.ready?.then(() => this._fitPill());
    // "Tomorrow" moves at midnight: checked every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / 60000);
      if (this._hass) this.hass = this._hass;
    }, 60000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._fitObserver?.disconnect();
    this._dropPress();
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.children !== undefined && !Array.isArray(config.children)) throw new Error("children must be a list");
    if (config.school_days !== undefined && !Array.isArray(config.school_days)) throw new Error("school_days must be a list of days");
    this._config = { ...config };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this.toggleAttribute?.("hide-subtitle", config.show_subtitle === false);
    this._html = "";
    this._lastDeps = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _tz() {
    const h = this._hass;
    return h?.locale?.time_zone === "server" ? h.config?.time_zone : undefined;
  }

  // The entities read: the options, else what the registries tell (Workday, Holiday, a school holidays calendar,
  // the Pronote children). An option set to false (or an empty list of children) turns a source off.
  _sources() {
    const c = this._config;
    const found = discover(this._hass);
    const pick = (k) => (c[k] === false || c[k] === null ? undefined : c[k] || found[k]);
    const children = (c.children ?? found.children ?? [])
      .filter((ch) => ch && typeof ch === "object")
      .map((ch, i) => ({ name: String(ch.name ?? `#${i + 1}`), today: ch.today, tomorrow: ch.tomorrow ?? ch.entity, next_day: ch.next_day }));
    // Bins and birthdays: one calendar or a list; false turns them off.
    const many = (k) => {
      const v = c[k];
      if (v === false || v === null) return [];
      if (v) return (Array.isArray(v) ? v : [v]).filter((id) => typeof id === "string" && id.startsWith("calendar."));
      return found[k] || [];
    };
    return {
      workday: pick("workday"),
      school_holidays: pick("school_holidays"),
      public_holidays: pick("public_holidays"),
      children,
      waste: c.show_waste === false ? [] : many("waste"),
      birthdays: c.show_birthdays === false ? [] : many("birthdays"),
    };
  }

  _update() {
    if (!this._hass || !this._config) return;
    if (this._pressing) {
      this._dirty = true;
      return;
    }
    this._dirty = false;
    const html = this._render();
    if (html === this._html) return;
    this._html = html;
    const root = this.shadowRoot;
    if (!root.firstChild) root.innerHTML = html;
    else {
      const tpl = document.createElement("template");
      tpl.innerHTML = html;
      morph(root, tpl.content);
    }
    this._fitPill();
  }

  // Tomorrow's status pill, measured after each render and on a new width (in every language): it sits on the title's
  // row, right after the title, only when the whole title (on one line) and the pill's whole label fit there;
  // otherwise it takes a line of its own under the subtitle (.below). When the lines do not fit in the banner above
  // the ground, or the label does not fit its line, the pill shows its dot alone (.dot-only): beside the title when
  // the whole title leaves it room, else under the subtitle, the answer then one line shorter if need be (.tight).
  _fitPill() {
    for (const t of this.shadowRoot?.querySelectorAll?.(".titles") || []) {
      const row = t.querySelector(".title-row");
      const pill = row?.querySelector(":scope > .chip");
      if (!pill?.getBoundingClientRect) continue;
      t.classList.remove("below", "dot-only", "tight");
      const name = row.querySelector(".name");
      const shown = getComputedStyle(name).display !== "none";
      const gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      const room = row.getBoundingClientRect().width;
      const title = shown ? fdTextWidth(name) + gap : 0;
      if (title + pill.getBoundingClientRect().width <= room) continue;
      t.classList.add("below");
      const line = t.querySelector(".pill-line > .chip");
      const banner = t.closest(".banner");
      const floor = banner ? banner.querySelector(".fd-ground").getBoundingClientRect().top : Infinity;
      const box = t.getBoundingClientRect();
      const tx = line?.querySelector(".chip-text");
      const whole = !tx || (tx.scrollWidth <= tx.clientWidth + 0.5 && line.getBoundingClientRect().right <= box.right + 0.5);
      if (whole && box.bottom <= floor + 0.5 && (!banner || box.top >= banner.getBoundingClientRect().top - 0.5)) continue;
      t.classList.add("dot-only");
      if (title + (line || pill).getBoundingClientRect().width <= room) t.classList.remove("below");
      // Still into the ground (a long answer on the narrowest mini card): the answer one line shorter.
      else if (banner && t.querySelector(":scope > .sub") && t.getBoundingClientRect().bottom > floor + 0.5) t.classList.add("tight");
    }
  }

  _onClick(ev) {
    const el = ev.composedPath().find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    const { action, entity } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
    if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  // ---- Data --------------------------------------------------------------

  // Everything a render needs: { today, tomorrow, day (what tomorrow is), school / pub (events, null while loading
  // or without the calendar), children (tomorrow's timetable of each), src, pending (calendar id → still loading) }.
  _model() {
    const h = this._hass;
    const tz = this._tz();
    const today = dayKey(Date.now(), tz);
    const tomorrow = addDays(today, 1);
    const src = this._sources();
    // A calendar that failed to load counts as absent; one still loading leaves tomorrow unknown.
    const pending = {};
    const events = (id, ignore) => {
      if (!id) return null;
      const c = calendarData(h, id, today, this._reload);
      if (!c?.list) {
        pending[id] = !!c?.loading;
        return null;
      }
      return parseEvents(c.list, tz, ignore);
    };
    const ignore = this._config.ignore === undefined ? DEFAULT_IGNORE : this._config.ignore;
    const school = events(src.school_holidays, ignore);
    const pub = events(src.public_holidays, "");
    const loading = Object.values(pending).some(Boolean);
    const day = loading ? { key: tomorrow, kind: "unknown", loading: true } : this._status(tomorrow, school, pub, src);
    const dayToday = loading ? { key: today, kind: "unknown", loading: true } : this._status(today, school, pub, src);
    const children = src.children.map((ch) => ({ name: ch.name, id: ch.tomorrow || ch.next_day || ch.today, day: this._childDay(ch, tomorrow, tz) }));
    return { today, tomorrow, day, dayToday, school, pub, children, src, pending, extras: this._extrasOf(today, tomorrow, src, tz) };
  }

  // The chips under the answer: tomorrow's bin collections ("Recycling tonight"), today's and tomorrow's birthdays,
  // today's and tomorrow's name days. A calendar still loading shows nothing yet (it is never what tomorrow is).
  _extrasOf(today, tomorrow, src, tz) {
    const h = this._hass;
    const read = (id) => {
      const c = calendarData(h, id, today, this._reload);
      return c?.list ? parseEvents(c.list, tz, "") : [];
    };
    const waste = [];
    for (const id of src.waste) {
      for (const e of read(id)) {
        if (e.start === tomorrow && e.summary && !waste.some((w) => w.type === e.summary)) waste.push({ id, type: e.summary, color: binColor(e.summary) });
      }
    }
    const birthdays = [];
    for (const id of src.birthdays) {
      for (const e of read(id)) {
        if (e.start !== today && e.start !== tomorrow) continue;
        const name = birthdayName(e.summary);
        if (name && !birthdays.some((b) => b.name === name)) birthdays.push({ id, name, age: birthdayAge(e), tomorrow: e.start === tomorrow });
      }
    }
    birthdays.sort((a, b) => a.tomorrow - b.tomorrow);
    const c = this._config;
    // Today's name day, and tomorrow's ("St Albert · tomorrow"): the card speaks of tomorrow.
    const saints = (c.show_saint ?? lang(h, c) === "fr")
      ? [saintOf(today), saintOf(tomorrow) && { ...saintOf(tomorrow), tomorrow: true }].filter(Boolean)
      : [];
    return { waste, birthdays, saints };
  }

  // The chips' HTML (none: empty), under the answer on the full card and under the header on the mini card.
  // `extras` (both / today / tomorrow) picks the days to show; on the full card (grouped) the two days are
  // split into labelled groups, on the mini card they stay in one row with a "· tomorrow" cue on the chips.
  // One bin / birthday / name-day chip.
  _xchip(kind, icon, text, title, entity) {
    const attrs = entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(entity)}"` : '"';
    return `<span class="xchip ${kind}${attrs} title="${esc(title)}">${svgIcon(icon)}<span>${esc(text)}</span></span>`;
  }

  _extrasHtml(m, cls = "", grouped = false) {
    const x = m.extras;
    const L = this._locale();
    const raw = this._config.extras;
    const mode = raw === "today" || raw === "tomorrow" ? raw : "both";
    const chip = (kind, icon, text, title, entity) => this._xchip(kind, icon, text, title, entity);
    const years = (n) => new Intl.NumberFormat(L, { style: "unit", unit: "year", unitDisplay: "long" }).format(n);
    // The "· tomorrow" cue only makes sense when both days share one row (the mini card); the labelled
    // groups of the full card carry the day themselves.
    const suf = (tomorrow) => (!grouped && tomorrow ? ` · ${fmtRel(1, L)}` : "");
    const dayChips = (day) => {
      const out = [];
      if (day === 1) out.push(...x.waste.map((w) => chip(`w-${w.color}`, ICONS.trash, this._t("waste_tonight", { type: w.type }), this._t("waste_title"), w.id)));
      out.push(...x.birthdays.filter((b) => !!b.tomorrow === (day === 1)).map((b) =>
        chip("x-birthday", ICONS.cake, [b.name, b.age !== null ? years(b.age) : ""].filter(Boolean).join(" · ") + suf(b.tomorrow), this._t("birthday_title"), b.id),
      ));
      out.push(...x.saints.filter((n) => !!n.tomorrow === (day === 1)).map((n) =>
        chip("x-saint", ICONS.flower, n.name + suf(n.tomorrow), [this._t("saint_title"), n.all.join(", ")].filter(Boolean).join(" : ")),
      ));
      return out;
    };
    const groups = [];
    if (mode !== "tomorrow") { const g = dayChips(0); if (g.length) groups.push({ day: 0, chips: g }); }
    if (mode !== "today") { const g = dayChips(1); if (g.length) groups.push({ day: 1, chips: g }); }
    if (!groups.length) return "";
    if (!grouped) return `<div class="extras${cls}">${groups.flatMap((g) => g.chips).join("")}</div>`;
    // Label a group when both days are shown, or when a lone group is today's (so it is not read as tomorrow).
    const showLabel = (g) => groups.length > 1 || g.day === 0;
    return `<div class="xgroups">${groups.map((g) =>
      `<div class="xgroup">${showLabel(g) ? `<div class="xday">${esc(upperFirst(fmtRel(g.day, L), L))}</div>` : ""}<div class="extras${cls}">${g.chips.join("")}</div></div>`,
    ).join("")}</div>`;
  }

  // ---- Two-day layout (show_today) ---------------------------------------

  // The chips of one section: the bins go to today (put out tonight), birthdays and name day to their own day.
  _sectionChips(m, which) {
    const x = m.extras;
    const L = this._locale();
    const isTom = which === "tomorrow";
    const years = (n) => new Intl.NumberFormat(L, { style: "unit", unit: "year", unitDisplay: "long" }).format(n);
    const out = [];
    if (!isTom) out.push(...x.waste.map((w) => this._xchip(`w-${w.color}`, ICONS.trash, this._t("waste_tonight", { type: w.type }), this._t("waste_title"), w.id)));
    out.push(...x.birthdays.filter((b) => !!b.tomorrow === isTom).map((b) =>
      this._xchip("x-birthday", ICONS.cake, [b.name, b.age !== null ? years(b.age) : ""].filter(Boolean).join(" · "), this._t("birthday_title"), b.id),
    ));
    out.push(...x.saints.filter((n) => !!n.tomorrow === isTom).map((n) =>
      this._xchip("x-saint", ICONS.flower, n.name, [this._t("saint_title"), n.all.join(", ")].filter(Boolean).join(" : ")),
    ));
    return out.length ? `<div class="extras">${out.join("")}</div>` : "";
  }

  // One day block: its picture, its label and date, the answer, the status pill, then its chips (and, for tomorrow,
  // the children's first lessons).
  _daySection(m, which) {
    const L = this._locale();
    const isTom = which === "tomorrow";
    const d = isTom ? m.day : m.dayToday;
    const first = isTom ? this._firstLesson(m) : null;
    const attrs = d.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(d.entity)}"` : '"';
    const pill = esc(this._kindLabel(d.kind));
    const chips = this._sectionChips(m, which);
    const kids = isTom && this._config.show_children !== false && d.kind === "school" ? this._kidsHtml(m) : "";
    const indent = chips || kids ? `<div class="indent">${chips}${kids}</div>` : "";
    return `<div class="daysec k-${d.kind}">
        <div class="dayhead${attrs}>
          <span class="art">${this._glyph(which, d.kind, art)}</span>
          <div class="daylabel">
            <div class="lab">${esc(upperFirst(fmtRel(isTom ? 1 : 0, L), L))} <span class="date">· ${esc(fmtWeekday(d.key, L))}</span></div>
            <div class="ans">${esc(this._answerFor(d, first))}</div>
          </div>
          <span class="chip k-${d.kind}" title="${pill}" aria-label="${pill}"><span class="dot"></span><span class="chip-text">${pill}</span></span>
        </div>
        ${indent}
      </div>`;
  }

  // The header of the two-day card: badge and title only (each day carries its own date and status).
  _headerTwo(m) {
    const c = this._config;
    if (this._illustrated()) return this._banner({ name: c.title || this._t("title_two"), day: m.day });
    return `
      <div class="header">
        <span class="badge">${svgIcon(ICONS.bag)}</span>
        <div class="titles"><div class="name">${esc(c.title || this._t("title_two"))}</div></div>
      </div>`;
  }

  // What a day is: a public holiday, school holidays, a day without school (weekend), a day off for Workday, else
  // a school day: { key, kind, name, entity }.
  _status(key, school, pub, src) {
    const p = covering(pub, key);
    if (p) return { key, kind: "public_holiday", name: p.summary, entity: src.public_holidays };
    const s = covering(school, key);
    if (s) return { key, kind: "holidays", name: s.summary, entity: src.school_holidays };
    const wd = src.workday ? this._hass.states[src.workday] : undefined;
    if (!this._schoolDays(wd).includes(weekday(key))) return { key, kind: "weekend", entity: src.workday };
    if (this._workday(src.workday, wd, key) === false) return { key, kind: "day_off", entity: src.workday };
    return { key, kind: "school", entity: src.workday };
  }

  // Whether Workday counts tomorrow as a working day: its state with `days_offset: 1`, else workday.check_date
  // (true / false, null while loading or without Workday).
  _workday(id, wd, key) {
    if (!id || !wd) return null;
    if (Number(wd.attributes?.days_offset ?? 0) === 1 && valid(wd)) return wd.state === "on";
    return checkDate(this._hass, id, key, this._reload);
  }

  _schoolDays(wd) {
    const c = this._config.school_days;
    if (Array.isArray(c) && c.length) return c.map((d) => String(d).slice(0, 3).toLowerCase());
    const w = wd?.attributes?.workdays;
    if (Array.isArray(w) && w.some((d) => WEEKDAYS.includes(d))) return w.filter((d) => WEEKDAYS.includes(d));
    return DEFAULT_SCHOOL_DAYS;
  }

  // A child's timetable of a day, from whichever of its Pronote sensors is about that day: { id, start, lessons,
  // subject… }; a valid "tomorrow" sensor without lessons means no lessons; null when not known.
  _childDay(ch, key, tz) {
    for (const id of [ch.tomorrow, ch.next_day, ch.today]) {
      const tt = id ? timetableOf(this._hass.states[id], tz) : null;
      if (tt?.day === key) return { id, ...tt };
    }
    const s = ch.tomorrow ? this._hass.states[ch.tomorrow] : undefined;
    if (valid(s) && Array.isArray(s.attributes?.lessons) && !s.attributes.lessons.length) return { id: ch.tomorrow, lessons: 0, start: null, subject: null };
    return null;
  }

  // The earliest first lesson of the children (ms), when Pronote knows it.
  _firstLesson(m) {
    const starts = m.children.map((ch) => ch.day).filter((d) => d?.lessons && d.start !== null);
    return starts.length ? Math.min(...starts.map((d) => d.start)) : null;
  }

  // The school holidays going on today, else the next ones: { event, current }, or null.
  _holidays(m) {
    if (!m.school) return null;
    const cur = covering(m.school, m.today);
    if (cur) return { event: cur, current: true };
    const next = m.school.find((e) => e.start > m.today);
    return next ? { event: next, current: false } : null;
  }

  _kindLabel(kind) {
    return this._t(`kind_${kind}`);
  }

  _time(ms) {
    return fmtTime(ms, this._locale(), this._tz(), this._hass?.locale?.time_format);
  }

  // ---- Parts -------------------------------------------------------------

  // A picture that changes with the kind of day: the new one bounces in, the old one leaves (see the styles). The
  // first answer after loading (unknown before) comes in without it.
  _glyph(slot, kind, inner) {
    const prev = this._kinds[slot];
    if (prev && prev !== "unknown" && prev !== kind) {
      this._ghosts[slot] = prev;
      this._swaps[slot] = this._swaps[slot] === "a" ? "b" : "a";
    }
    this._kinds[slot] = kind;
    const swap = this._swaps[slot] ? ` swap-${this._swaps[slot]}` : "";
    const ghost = this._ghosts[slot];
    return `<span class="glyph${swap}">${inner(kind)}</span>${ghost ? `<span class="glyph ghost k-${ghost}" data-ghost="${slot}">${inner(ghost)}</span>` : ""}`;
  }

  // Badge, title and subtitle, status pill of tomorrow and the mini card's detail button.
  _header({ name, nameCls = "", sub, subCls = "", day }) {
    if (this._illustrated()) return this._banner({ name, nameCls, sub, subCls, day });
    return `
      <div class="header">
        <span class="badge">${svgIcon(ICONS.bag)}</span>
        ${this._titles({ name, nameCls, sub, subCls, day })}
        ${this._zoomButton()}
      </div>`;
  }

  // The title, then tomorrow's status pill right after it (in the colour of the round icon). Where the pill goes is
  // measured (_fitPill): beside the whole title, else on a line of its own under the subtitle (the copy in
  // .pill-line), else only its dot (its text stays in its title and aria-label).
  _titles({ name, nameCls = "", sub, subCls = "", day }) {
    const label = esc(this._kindLabel(day.kind));
    const attrs = day.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(day.entity)}"` : '"';
    const pill = `<span class="chip k-${day.kind}${attrs} title="${label}" aria-label="${label}"><span class="dot"></span><span class="chip-text">${label}</span></span>`;
    return `<div class="titles">
          <div class="title-row"><div class="name${nameCls}" title="${esc(name)}">${esc(name)}</div>${pill}</div>
          ${sub ? `<div class="sub${subCls}" title="${esc(sub)}">${esc(sub)}</div>` : ""}
          <div class="pill-line">${pill}</div>
        </div>`;
  }

  _zoomButton() {
    return "";
  }

  // The illustrated header is on unless `illustration: false` (then the classic header with its pill).
  _illustrated() {
    return this._config.illustration !== false;
  }

  // The illustrated header: tomorrow's scene at the right, the round icon (coloured by tomorrow's kind of day),
  // the title and the subtitle on the sky at the left, the detail button of the mini card at the top right.
  _banner({ name, nameCls = "", sub, subCls = "", day }) {
    const night = isNight(this._hass, this._config);
    const pill = esc(this._kindLabel(day.kind));
    return `
      <div class="banner k-${day.kind}${night ? " night" : ""}">
        ${fdSceneSvg(day.kind, night, this._uid)}
        <div class="htext">
          <span class="badge" role="img" title="${pill}" aria-label="${pill}">${svgIcon(SCHOOL_ICON)}</span>
          ${this._titles({ name, nameCls, sub, subCls, day })}
        </div>
        ${this._zoomButton()}
      </div>`;
  }

  // The illustration's styles, only when it is shown.
  _sceneStyle() {
    return this._illustrated() ? SCENE_STYLE : "";
  }

  _errorCard(text) {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(text)}</div></ha-card>`;
  }

  _noSource(m) {
    const s = m.src;
    return !s.workday && !s.school_holidays && !s.public_holidays && !s.children.length;
  }
}

export class FamilyDayCard extends FamilyDayBase {
  static getConfigElement() {
    return document.createElement("family-day-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _extraStyle() {
    return "";
  }

  _render() {
    const c = this._config;
    const m = this._model();
    if (this._noSource(m)) return this._errorCard(this._t("no_source"));
    const L = this._locale();
    if (c.show_today) {
      return `<style>${BASE_STYLE}${ART_STYLE}${FULL_STYLE}${TWODAY_STYLE}${this._extraStyle()}${this._sceneStyle()}</style>
        <ha-card>
          ${this._headerTwo(m)}
          <div class="content twoday">${this._daySection(m, "today")}${this._daySection(m, "tomorrow")}${this._footer(m)}</div>
        </ha-card>`;
    }
    const d = m.day;
    const kids = c.show_children !== false && d.kind === "school" ? this._kidsHtml(m) : "";
    return `<style>${BASE_STYLE}${ART_STYLE}${FULL_STYLE}${this._extraStyle()}${this._sceneStyle()}</style>
      <ha-card>
        ${this._header({ name: c.title || this._t("title"), sub: upperFirst(fmtDay(m.tomorrow, L), L), day: d })}
        <div class="content">${this._headline(m)}${this._extrasHtml(m, "", true)}${kids}${this._footer(m)}</div>
      </ha-card>`;
  }

  // "School at 8:00" (the earliest first lesson), "School day" without Pronote, "No school — Weekend".
  _answer(m) {
    return this._answerFor(m.day, this._firstLesson(m));
  }

  // The answer for a given day: "School at 8:00" when a first lesson is known, else "School day"; "No school —
  // Weekend" otherwise. `first` is null for today (its first lesson is of little use once the day is under way).
  _answerFor(d, first) {
    if (d.loading) return this._t("loading");
    if (d.kind === "school") return first !== null ? this._t("school_at", { time: this._time(first) }) : this._t("school_day");
    return this._t("no_school", { reason: d.name || this._kindLabel(d.kind) });
  }

  _headline(m) {
    const d = m.day;
    const attrs = d.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(d.entity)}"` : '"';
    return `<div class="headline k-${d.kind}${attrs}>
        <span class="art">${this._glyph("tomorrow", d.kind, art)}</span>
        <span class="answer">${esc(this._answer(m))}</span>
      </div>`;
  }

  // One row per child: "8:00 · Mathematics", "No lessons", "Timetable not known yet".
  _kidsHtml(m) {
    if (!m.children.length) return "";
    const L = this._locale();
    const rows = m.children.map((ch) => {
      const d = ch.day;
      let what;
      if (!d) what = esc(this._t("timetable_unknown"));
      else if (!d.lessons) what = esc(this._t("no_lessons"));
      else what = [d.start !== null ? `<b>${esc(this._time(d.start))}</b>` : "", d.subject ? esc(subjectName(d.subject, L)) : ""].filter(Boolean).join(" · ");
      const id = d?.id || ch.id;
      const attrs = id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"` : '"';
      return `<div class="kid${attrs}><span class="who">${esc(ch.name)}</span><span class="what">${what}</span></div>`;
    });
    return `<div class="kids">${rows.join("")}</div>`;
  }

  _line(kind, icon, text, end, entity, extra = "") {
    const attrs = entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(entity)}"` : '"';
    return `<div class="line k-${kind}${attrs}><div class="top">${svgIcon(icon)}<span class="txt">${text}</span>${end ? `<span class="end">${esc(end)}</span>` : ""}</div>${extra}</div>`;
  }

  // The school holidays going on ("Christmas holidays · back in 5 days", with their progress), else the next
  // ones ("Christmas holidays · in 34 days"); then the next public holiday ("Christmas Day · in 41 days").
  _footer(m) {
    const c = this._config;
    const L = this._locale();
    const lines = [];
    const loading = (id, kind, icon) => this._line(kind, icon, `<span class="muted">${esc(this._t("loading"))}</span>`, "", id);
    if (c.show_holidays !== false && m.src.school_holidays) {
      const h = this._holidays(m);
      const id = m.src.school_holidays;
      if (!m.school) lines.push(m.pending[id] ? loading(id, "holidays", ICONS.holidays) : "");
      else if (h?.current) {
        const e = h.event;
        const total = diffDays(e.start, e.end);
        const done = diffDays(e.start, m.today) + 1;
        const pct = Math.round((done / total) * 100);
        const bar = `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div style="width:${pct}%"></div></div>`;
        const text = `<b>${esc(e.summary)}</b> · ${esc(this._t("back_rel", { rel: fmtRel(diffDays(m.today, e.end), L) }))}`;
        lines.push(this._line("holidays", ICONS.holidays, text, this._t("day_of", { n: done, total }), id, bar));
      } else if (h) {
        const e = h.event;
        lines.push(this._line("holidays", ICONS.holidays, `<b>${esc(e.summary)}</b> · ${esc(fmtRel(diffDays(m.today, e.start), L))}`, upperFirst(fmtWeekday(e.start, L), L), id));
      }
    }
    if (c.show_public_holidays !== false && m.src.public_holidays) {
      const id = m.src.public_holidays;
      const next = m.pub?.find((e) => e.start >= m.today);
      if (!m.pub) lines.push(m.pending[id] ? loading(id, "public_holiday", ICONS.calendar_star) : "");
      else if (next)
        lines.push(this._line("public_holiday", ICONS.calendar_star, `<b>${esc(next.summary)}</b> · ${esc(fmtRel(diffDays(m.today, next.start), L))}`, upperFirst(fmtWeekday(next.start, L), L), id));
    }
    const out = lines.filter(Boolean);
    return out.length ? `<div class="footer">${out.join("")}</div>` : "";
  }
}

// The mini card answers in one line ("Tomorrow: school 8:00 AM", "No school tomorrow") with tomorrow's pill and
// the holidays countdown under it; its detail button (top right, `zoom: false` removes it) unfolds the full card,
// and a click anywhere else on the page folds it back.
export class FamilyDayMiniCard extends FamilyDayCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("family-day-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    if (this._zoomed) {
      this._zoomed = false;
      this._html = "";
    }
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 1;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = !!this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus?.({ preventScroll: true });
  }

  _extraStyle() {
    return MINI_STYLE;
  }

  // "Tomorrow: school 8:00 AM" / "Tomorrow: school" / "No school tomorrow".
  _miniAnswer(m) {
    const d = m.day;
    if (d.loading) return this._t("loading");
    if (d.kind !== "school") return this._t("tomorrow_no_school");
    const first = this._firstLesson(m);
    return first !== null ? this._t("tomorrow_school_at", { time: this._time(first) }) : this._t("tomorrow_school");
  }

  // "Holidays in 34 days" / "Back to school in 5 days".
  _countdown(m) {
    const h = this._holidays(m);
    if (!h) return "";
    const L = this._locale();
    const e = h.event;
    return h.current ? this._t("back_to_school", { rel: fmtRel(diffDays(m.today, e.end), L) }) : this._t("holidays_rel", { rel: fmtRel(diffDays(m.today, e.start), L) });
  }

  _render() {
    if (this._zoomed) return super._render();
    const m = this._model();
    if (this._noSource(m)) return this._errorCard(this._t("no_source"));
    const sub = this._config.show_countdown === false ? "" : this._countdown(m);
    return `<style>${BASE_STYLE}${MINI_STYLE}${this._sceneStyle()}</style>
      <ha-card class="compact${this._illustrated() ? " ill" : ""}">
        ${this._header({ name: this._miniAnswer(m), nameCls: " answer", sub, subCls: " countdown wrap", day: m.day })}
        ${this._extrasHtml(m, " mini")}
      </ha-card>`;
  }
}
