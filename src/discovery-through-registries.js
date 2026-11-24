// ---- Discovery through the registries -------------------------------------
import { BIRTHDAY_RE, WASTE_RE } from "./kinds-day.js";

export const _discovery = new WeakMap();
// A calendar of school holidays, from its id or name. Swedish "lov" (sportlov, höstlov) only at the end of a word, so
// that "lovelace" or "glove" is not taken for one.
export const SCHOOL_HOLIDAYS_RE = /vacances|scolaire|school|ferien|vacaciones|vacanze|vakantie|ferie|lov(?![a-zåäö])/i;
export const regEntities = (hass) => Object.values(hass?.entities || {});
export const discover = (hass) => {
  if (!hass?.entities) return {};
  const cached = _discovery.get(hass.entities);
  if (cached) return cached;
  const list = regEntities(hass);
  const name = (e) => String(hass.states[e.entity_id]?.attributes?.friendly_name ?? e.name ?? e.entity_id);
  const workday = list.find((e) => e.platform === "workday" && e.entity_id.startsWith("binary_sensor."))?.entity_id;
  const pub = list.find((e) => e.platform === "holiday" && e.entity_id.startsWith("calendar."))?.entity_id;
  const school = list.find(
    (e) =>
      e.entity_id.startsWith("calendar.") &&
      !["holiday", "workday"].includes(e.platform) &&
      SCHOOL_HOLIDAYS_RE.test(`${e.entity_id} ${name(e)}`),
  )?.entity_id;
  // Bin collections: the calendars of Waste Collection Schedule, or named after the bins; birthdays: by their name.
  const calendars = list.filter((e) => e.entity_id.startsWith("calendar.") && e.entity_id !== pub && e.entity_id !== school && !e.hidden);
  const birthdays = calendars.filter((e) => BIRTHDAY_RE.test(`${e.entity_id} ${name(e)}`)).map((e) => e.entity_id);
  const waste = calendars
    .filter((e) => !birthdays.includes(e.entity_id) && (e.platform === "waste_collection_schedule" || WASTE_RE.test(`${e.entity_id} ${name(e)}`)))
    .map((e) => e.entity_id);
  // Pronote: the timetables of each child (one device per child).
  const byDevice = new Map();
  for (const e of list) {
    if (e.platform !== "pronote" || !e.device_id) continue;
    const slot = { lessons_today: "today", lessons_tomorrow: "tomorrow", lessons_next_day: "next_day" }[e.translation_key];
    if (!slot) continue;
    if (!byDevice.has(e.device_id)) byDevice.set(e.device_id, {});
    byDevice.get(e.device_id)[slot] = e.entity_id;
  }
  const children = [...byDevice.entries()].map(([dev, ents]) => ({ name: childName(hass.devices?.[dev]), ...ents }));
  const out = { workday, public_holidays: pub, school_holidays: school, children, waste, birthdays };
  _discovery.set(hass.entities, out);
  return out;
};

// "Pronote - DUPONT Alex" → "Alex": the device name without the integration prefix, and without the family name
// when Pronote writes it in capitals.
export const childName = (dev) => {
  const raw = String(dev?.name_by_user || dev?.name || "").replace(/^pronote\s*[-–:]\s*/i, "").trim();
  if (dev?.name_by_user) return raw;
  const words = raw.split(/\s+/);
  const given = words.filter((w) => w !== w.toLocaleUpperCase() || !/\p{L}/u.test(w));
  return given.length && given.length < words.length ? given.join(" ") : raw;
};
