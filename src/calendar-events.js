// ---- Calendar events ------------------------------------------------------
import { AHEAD_DAYS, CALENDAR_REFRESH_MS, PAST_DAYS } from "./kinds-day.js";
import { addDays, dayKey, diffDays, isKey, keyMs } from "./days.js";

// A calendar event (REST `calendars/<id>`: start/end as { date } or { dateTime }) as the days it covers:
// { start, end (exclusive), summary }, or null.
export const eventSpan = (ev, tz) => {
  const read = (v) => (v && typeof v === "object" ? (v.date ?? v.dateTime) : v);
  const s = read(ev?.start);
  const e = read(ev?.end);
  if (!s) return null;
  const start = isKey(s) ? s : Number.isFinite(Date.parse(s)) ? dayKey(Date.parse(s), tz) : null;
  if (!start) return null;
  let end = null;
  if (isKey(e)) end = e;
  else if (e && Number.isFinite(Date.parse(e))) end = addDays(dayKey(Date.parse(e) - 1, tz), 1);
  if (!end || end <= start) end = addDays(start, 1);
  return { start, end, summary: String(ev.summary ?? "").trim(), description: String(ev.description ?? "").trim() };
};

export const parseEvents = (list, tz, ignore) => {
  const re = ignore ? safeRegExp(ignore) : null;
  return (Array.isArray(list) ? list : [])
    .map((ev) => eventSpan(ev, tz))
    .filter((e) => e && !re?.test(e.summary))
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : b.end < a.end ? -1 : 1));
};

export const safeRegExp = (src) => {
  try {
    return new RegExp(src, "i");
  } catch (_e) {
    return null;
  }
};

// The longest event covering a day.
export const covering = (events, key) => {
  let best = null;
  for (const e of events || []) if (e.start <= key && key < e.end && (!best || diffDays(e.start, e.end) > diffDays(best.start, best.end))) best = e;
  return best;
};

// Calendar events, shared by every card of the page: read once per calendar for the window around today, again
// after CALENDAR_REFRESH_MS, when the calendar's state changes (an event starts or ends) or on another day.
export const CAL_CACHE = new Map();
export const calendarData = (hass, id, today, onLoad) => {
  const st = hass.states[id];
  const stamp = `${today}|${st?.last_changed ?? ""}`;
  let c = CAL_CACHE.get(id);
  const stale = !c || c.stamp !== stamp || Date.now() - c.at > CALENDAR_REFRESH_MS;
  if (stale && !c?.loading && typeof hass.callApi === "function") {
    const ticket = { stamp, at: Date.now(), loading: true, list: c?.list ?? null, error: false, waiting: new Set([onLoad]) };
    CAL_CACHE.set(id, ticket);
    const start = new Date(keyMs(addDays(today, -PAST_DAYS))).toISOString();
    const end = new Date(keyMs(addDays(today, AHEAD_DAYS))).toISOString();
    Promise.resolve(hass.callApi("GET", `calendars/${id}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`))
      .then((list) => Object.assign(ticket, { list: Array.isArray(list) ? list : [], loading: false, at: Date.now() }))
      .catch(() => Object.assign(ticket, { loading: false, error: true, at: Date.now() }))
      .finally(() => {
        for (const fn of ticket.waiting) fn();
        ticket.waiting.clear();
      });
    c = ticket;
  } else if (c?.loading) c.waiting.add(onLoad);
  return c;
};

// workday.check_date answers, shared by every card: entity|day → { at, workday (true / false / null while loading) }.
export const WORKDAY_CACHE = new Map();
export const checkDate = (hass, id, key, onLoad) => {
  const k = `${id}|${key}`;
  const c = WORKDAY_CACHE.get(k);
  if (c && (c.loading || Date.now() - c.at < CALENDAR_REFRESH_MS)) {
    if (c.loading) c.waiting.add(onLoad);
    return c.workday;
  }
  if (typeof hass.callWS !== "function") return null;
  const ticket = { at: Date.now(), loading: true, workday: c?.workday ?? null, waiting: new Set([onLoad]) };
  // One entry per sensor and day: the days gone by (answers older than two refreshes) are dropped.
  for (const [key2, old] of WORKDAY_CACHE) if (!old.loading && Date.now() - old.at > 2 * CALENDAR_REFRESH_MS) WORKDAY_CACHE.delete(key2);
  WORKDAY_CACHE.set(k, ticket);
  Promise.resolve(
    hass.callWS({
      type: "call_service",
      domain: "workday",
      service: "check_date",
      service_data: { check_date: key },
      target: { entity_id: id },
      return_response: true,
    }),
  )
    .then((res) => {
      const r = res?.response?.[id]?.workday;
      ticket.workday = typeof r === "boolean" ? r : null;
    })
    .catch(() => {
      ticket.workday = null;
    })
    .finally(() => {
      ticket.loading = false;
      ticket.at = Date.now();
      for (const fn of ticket.waiting) fn();
      ticket.waiting.clear();
    });
  return ticket.workday;
};
