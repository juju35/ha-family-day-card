// ---- Pronote timetables ----------------------------------------------------
import { valid } from "./helpers.js";
import { dayKey, upperFirst } from "./days.js";

// What a Pronote timetable sensor says of its day: { day, start, end, lessons, canceled, subject } (times in ms,
// subject of the first lesson), or null.
export const timetableOf = (s, tz) => {
  if (!valid(s)) return null;
  const a = s.attributes || {};
  const at = (v) => (v ? Date.parse(v) : Number.NaN);
  const lessons = (Array.isArray(a.lessons) ? a.lessons : []).filter((l) => Number.isFinite(at(l?.start_at))).sort((x, y) => at(x.start_at) - at(y.start_at));
  const live = lessons.filter((l) => !l.canceled);
  const start = Number.isFinite(at(a.day_start_at)) ? at(a.day_start_at) : live.length ? at(live[0].start_at) : Number.NaN;
  const end = Number.isFinite(at(a.day_end_at)) ? at(a.day_end_at) : live.length ? at(live[live.length - 1].end_at) : Number.NaN;
  const ref = Number.isFinite(start) ? start : lessons.length ? at(lessons[0].start_at) : Number.NaN;
  if (!Number.isFinite(ref)) return null;
  return {
    day: dayKey(ref, tz),
    start: Number.isFinite(start) ? start : null,
    end: Number.isFinite(end) ? end : null,
    lessons: live.length,
    canceled: lessons.length - live.length,
    subject: live.length ? String(live[0].lesson ?? "").trim() || null : null,
  };
};

// Pronote writes subjects in capitals ("MATHEMATIQUES"): shown as "Mathematiques"; mixed case is kept.
export const subjectName = (s, locale) => {
  const v = String(s ?? "").trim();
  return v && /\p{L}/u.test(v) && v === v.toLocaleUpperCase(locale) ? upperFirst(v.toLocaleLowerCase(locale), locale) : v;
};
