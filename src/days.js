// ---- Days: "YYYY-MM-DD" keys in the time zone of the profile -------------
import { WEEKDAYS } from "./kinds-day.js";

export const DAY_FMT = {};
export const dayKey = (ms, tz) =>
  (DAY_FMT[tz || ""] ??= new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", ...(tz ? { timeZone: tz } : {}) })).format(ms);
export const keyMs = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
export const addDays = (key, n) => new Date(keyMs(key) + n * 86400e3).toISOString().slice(0, 10);
export const diffDays = (from, to) => Math.round((keyMs(to) - keyMs(from)) / 86400e3);
export const weekday = (key) => WEEKDAYS[new Date(keyMs(key)).getUTCDay()];
export const isKey = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

export const FMT = {};
export const fmt = (locale, name, opts) => (FMT[`${locale}|${name}`] ??= new Intl.DateTimeFormat(locale, opts));
// A day, written in UTC from its key (no time zone shift): "Monday 16 November", "Fri 25 Dec".
export const fmtDay = (key, locale) => fmt(locale, "long", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(keyMs(key) + 43200e3);
export const fmtWeekday = (key, locale) => fmt(locale, "wd", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(keyMs(key) + 43200e3);
// A time of day, with Home Assistant's time format: "12", "24", else the language's (`language`, `system`).
export const fmtTime = (ms, locale, tz, format) =>
  fmt(locale, `time|${tz || ""}|${format || ""}`, {
    hour: "numeric",
    minute: "2-digit",
    ...(format === "12" ? { hour12: true } : format === "24" ? { hourCycle: "h23" } : {}),
    ...(tz ? { timeZone: tz } : {}),
  }).format(ms);
export const REL = {};
// "today", "tomorrow", "in 12 days", in the language of the card.
export const fmtRel = (days, locale) => (REL[locale] ??= new Intl.RelativeTimeFormat(locale, { numeric: "auto" })).format(days, "day");
// Weekday names of the editor ("mon" → "Monday"), from a known Monday (2024-01-01).
export const weekdayName = (d, locale) => fmt(locale, "wdl", { weekday: "long", timeZone: "UTC" }).format(Date.UTC(2024, 0, (WEEKDAYS.indexOf(d) + 6) % 7 + 1, 12));
export const upperFirst = (s, locale) => (s ? s.charAt(0).toLocaleUpperCase(locale) + s.slice(1) : s);
