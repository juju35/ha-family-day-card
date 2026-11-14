// Mock Home Assistant registries, states and calendars, used to render the screenshots and by the tests: a Workday
// sensor, the Holiday integration's calendar (English names), a school holidays calendar shaped like the French
// education ministry's ICS (names in English for the captures) and the Pronote timetables of two children with neutral
// names. Entity ids are in French on purpose (the cards never rely on them).
// Every scenario is a fixed instant (UTC, the screenshot page's time zone): the captures never change from one day to
// the next.
export const SCENARIOS = {
  // Friday evening: the weekend tomorrow.
  friday: Date.UTC(2026, 10, 13, 17, 30),
  // Sunday evening: school tomorrow at 8:00, the Christmas holidays in 34 days.
  sunday: Date.UTC(2026, 10, 15, 19, 0),
  // The eve of Armistice Day (a Wednesday): a public holiday tomorrow.
  armistice_eve: Date.UTC(2026, 10, 10, 18, 0),
  // Thursday evening: tomorrow is a day off for Workday (a bridge day of its own), in no calendar.
  day_off: Date.UTC(2026, 10, 19, 18, 0),
  // Friday before the Christmas holidays: the holidays start tomorrow.
  holidays_eve: Date.UTC(2026, 11, 18, 18, 0),
  // In the middle of the Christmas holidays.
  holidays: Date.UTC(2026, 11, 28, 9, 0),
};

// Days the Workday integration counts as off on top of the public holidays (its `add_holidays`).
export const WORKDAY_OFF = ["2026-11-20"];

export const IDS = {
  workday: "binary_sensor.jour_ouvre",
  school: "calendar.vacances_scolaires",
  pub: "calendar.jours_feries",
  birthdays: "calendar.anniversaires",
  waste: "calendar.collecte_dechets",
};

// School holidays (Zone B, 2026–2027), as the ministry's ICS gives them: the end is the day back at school.
export const SCHOOL_EVENTS = [
  ["2026-07-04", "2026-09-01", "Summer holidays"],
  ["2026-08-31", "2026-09-01", "Summer holidays (teachers' pre-term day)"],
  ["2026-10-17", "2026-11-02", "Autumn holidays"],
  ["2026-12-19", "2027-01-04", "Christmas holidays"],
  ["2027-02-20", "2027-03-08", "Winter holidays"],
  ["2027-04-17", "2027-05-03", "Spring holidays"],
  ["2027-05-07", "2027-05-08", "Ascension bridge"],
  ["2027-07-03", "2027-09-02", "Summer holidays"],
  ["2027-09-01", "2027-09-02", "Summer holidays (teachers' pre-term day)"],
];

// French public holidays, as the Holiday integration names them in English.
export const PUBLIC_EVENTS = [
  ["2026-07-14", "Bastille Day"],
  ["2026-08-15", "Assumption Day"],
  ["2026-11-01", "All Saints' Day"],
  ["2026-11-11", "Armistice Day"],
  ["2026-12-25", "Christmas Day"],
  ["2027-01-01", "New Year's Day"],
  ["2027-03-29", "Easter Monday"],
  ["2027-05-01", "Labour Day"],
  ["2027-05-06", "Ascension Day"],
  ["2027-05-08", "Victory in Europe Day"],
  ["2027-05-17", "Whit Monday"],
  ["2027-07-14", "Bastille Day"],
].map(([d, name]) => [d, addDays(d, 1), name]);

// Birthdays, one event a year (as a local calendar repeats them), the birth year in the description for the age.
const BIRTHDAYS = [
  ["11-15", "Emma's birthday", 2017],
  ["11-16", "Lucas", null],
  ["12-28", "Grandma's birthday", 1956],
];
export const BIRTHDAY_EVENTS = [2026, 2027].flatMap((y) =>
  BIRTHDAYS.map(([md, summary, born]) => [`${y}-${md}`, addDays(`${y}-${md}`, 1), summary, born ? `Born in ${born}` : ""]),
);

// Bin collections, as Waste Collection Schedule's calendar gives them: recycling on Mondays, household waste on
// Thursdays.
export const WASTE_EVENTS = (() => {
  const out = [];
  for (let key = "2026-07-01"; key < "2028-01-01"; key = addDays(key, 1)) {
    const wd = new Date(`${key}T12:00:00Z`).getUTCDay();
    if (wd === 1) out.push([key, addDays(key, 1), "Recycling", ""]);
    if (wd === 4) out.push([key, addDays(key, 1), "Household waste", ""]);
  }
  return out;
})();

function addDays(key, n) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d) + n * 86400e3).toISOString().slice(0, 10);
}
const keyOf = (ms) => new Date(ms).toISOString().slice(0, 10);
const inside = (list, key) => list.some(([s, e, name]) => s <= key && key < e && !/teachers/.test(name));
const weekday = (key) => new Date(`${key}T12:00:00Z`).getUTCDay();

// What the Workday integration says of a day: Monday to Friday, public holidays and its own days off excluded.
export const isWorkday = (key) => weekday(key) >= 1 && weekday(key) <= 5 && !inside(PUBLIC_EVENTS, key) && !WORKDAY_OFF.includes(key);
const isSchoolDay = (key) => isWorkday(key) && !inside(SCHOOL_EVENTS, key);

// The REST answer of `calendars/<id>?start=…&end=…` (all-day events: { date }).
export const calendarEvents = (id, start, end) => {
  const list = { [IDS.school]: SCHOOL_EVENTS, [IDS.pub]: PUBLIC_EVENTS, [IDS.birthdays]: BIRTHDAY_EVENTS, [IDS.waste]: WASTE_EVENTS }[id] || [];
  const from = keyOf(Date.parse(start));
  const to = keyOf(Date.parse(end));
  return list
    .filter(([s, e]) => e > from && s < to)
    .map(([s, e, summary, description = `${summary} - Zone B`]) => ({ start: { date: s }, end: { date: e }, summary, description, location: null, uid: null, recurrence_id: null, rrule: null }));
};

// Pronote lessons of a child on a school day: [start hour, end hour, subject, canceled].
const PLANS = {
  alex: (wd) =>
    wd === 3
      ? [
          [8, 9, "MATHEMATICS"],
          [9, 10, "ENGLISH"],
          [10.25, 12, "HISTORY-GEOGRAPHY"],
        ]
      : [
          [8, 9, "FRENCH"],
          [9, 10, "MATHEMATICS"],
          [10.25, 12, "PHYSICS-CHEMISTRY"],
          [13.5, 14.5, "SPANISH"],
          [14.5, 16.5, "PHYSICAL EDUCATION"],
        ],
  sam: (wd) =>
    wd === 3
      ? [
          [9, 10, "MUSIC"],
          [10, 12, "FRENCH"],
        ]
      : [
          [8, 9, "ART", true],
          [9, 10, "ENGLISH"],
          [10.25, 12, "MATHEMATICS"],
          [13.5, 15.5, "SCIENCE"],
          [15.5, 17, "TECHNOLOGY"],
        ],
};

const at = (key, h) => new Date(Date.parse(`${key}T00:00:00Z`) + h * 3600e3).toISOString();
const hm = (h) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.round((h % 1) * 60)).padStart(2, "0")}`;

// A Pronote timetable sensor (hass-pronote): state = number of lessons, lessons in the attributes.
const timetable = (child, key, label) => {
  const plan = key && isSchoolDay(key) ? PLANS[child](weekday(key)) : [];
  const lessons = plan.map(([s, e, lesson, canceled = false]) => ({
    start_at: at(key, s),
    end_at: at(key, e),
    start_time: hm(s),
    end_time: hm(e),
    lesson,
    classroom: "B12",
    canceled,
    status: canceled ? "Cours annulé" : null,
    background_color: "#7FA3D8",
    teacher_name: "M. TEACHER",
  }));
  const live = lessons.filter((l) => !l.canceled);
  return {
    state: String(lessons.length),
    attributes: {
      updated_at: new Date().toISOString(),
      lessons,
      canceled_lessons_counter: lessons.length - live.length,
      day_start_at: live[0]?.start_at ?? null,
      day_end_at: live.at(-1)?.end_at ?? null,
      friendly_name: `Pronote - MARTIN ${child === "alex" ? "Alex" : "Sam"} ${label}`,
    },
  };
};

// Registries and states of a scenario: { states, entities, devices }.
export const scenario = (now) => {
  const today = keyOf(now);
  let next = addDays(today, 1);
  while (!isSchoolDay(next)) next = addDays(next, 1);
  const states = {};
  const entities = {};
  const devices = {};
  const put = (entity_id, platform, device_id, translation_key, state, attributes) => {
    entities[entity_id] = { entity_id, platform, device_id: device_id ?? null, translation_key: translation_key ?? null };
    const changed = new Date(Date.parse(`${today}T00:00:00Z`)).toISOString();
    states[entity_id] = { entity_id, state, attributes, last_changed: changed, last_updated: changed };
  };
  put(IDS.workday, "workday", "workday", null, isWorkday(today) ? "on" : "off", {
    workdays: ["mon", "tue", "wed", "thu", "fri"],
    excludes: ["sat", "sun", "holiday"],
    days_offset: 0,
    friendly_name: "Workday",
  });
  put(IDS.pub, "holiday", "holiday", null, inside(PUBLIC_EVENTS, today) ? "on" : "off", { friendly_name: "France" });
  put(IDS.school, "remote_calendar", "school", null, inside(SCHOOL_EVENTS, today) ? "on" : "off", { friendly_name: "School holidays" });
  for (const child of ["alex", "sam"]) {
    const name = child === "alex" ? "Alex" : "Sam";
    devices[child] = { id: child, name: `Pronote - MARTIN ${name}`, name_by_user: null, manufacturer: "Pronote", model: `MARTIN ${name}` };
    const id = (k) => `sensor.pronote_martin_${child}_${k}`;
    for (const [slot, tk, label, key] of [
      ["emploi_du_temps_aujourd_hui", "lessons_today", "Today's timetable", today],
      ["emploi_du_temps_demain", "lessons_tomorrow", "Tomorrow's timetable", addDays(today, 1)],
      ["emploi_du_temps_prochain_jour", "lessons_next_day", "Next day's timetable", next],
    ]) {
      const tt = timetable(child, key, label);
      put(id(slot), "pronote", child, tk, tt.state, tt.attributes);
    }
    // Another Pronote sensor, skipped by the cards.
    put(id("moyenne_generale"), "pronote", child, "overall_average", "14.2", {});
  }
  // Birthdays (a local calendar, found by its name) and bin collections (Waste Collection Schedule).
  put(IDS.birthdays, "local_calendar", null, null, "off", { friendly_name: "Birthdays" });
  put(IDS.waste, "waste_collection_schedule", null, null, "off", { friendly_name: "Waste collection" });
  return { states, entities, devices };
};

// The answer of workday.check_date (call_service with return_response).
export const workdayResponse = (msg) => ({ context: {}, response: { [msg.target.entity_id]: { workday: isWorkday(msg.service_data.check_date) } } });
