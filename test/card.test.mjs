import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { calendarEvents, IDS, SCENARIOS, scenario, workdayResponse } from "../scripts/mock-states.mjs";
import { load } from "./load.mjs";

const flush = () => new Promise((r) => setTimeout(r, 0));

// A fresh sandbox per test: the calendar and Workday caches are shared by the cards of a page.
const setup = (now, extra = {}) => {
  const fd = load();
  fd.setNow(now);
  const sc = scenario(now);
  const calls = { api: [], ws: [] };
  const hass = {
    ...sc,
    language: "en",
    locale: { language: "en", time_zone: "server" },
    config: { time_zone: "UTC" },
    callApi: async (_method, path) => {
      calls.api.push(path);
      const [, id, query] = path.match(/^calendars\/([^?]+)\?(.*)$/);
      const q = new URLSearchParams(query);
      return calendarEvents(id, q.get("start"), q.get("end"));
    },
    callWS: async (msg) => {
      calls.ws.push(msg);
      return workdayResponse(msg);
    },
    ...extra,
  };
  return { fd, hass, calls };
};

const mount = async (fd, hass, config = {}, Card = fd.FamilyDayCard) => {
  const card = new Card();
  card.setConfig(config);
  card.hass = hass;
  for (let i = 0; i < 4; i++) await flush();
  return card;
};
const html = (card) => card.shadowRoot.innerHTML;
const text = (card) =>
  html(card)
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ");

test("days are keys in the profile's time zone, and day arithmetic stays on whole days", () => {
  const fd = load();
  // 23:30 UTC is already the next day in Paris.
  assert.equal(fd.dayKey(Date.UTC(2026, 10, 13, 23, 30), "Europe/Paris"), "2026-11-14");
  assert.equal(fd.dayKey(Date.UTC(2026, 10, 13, 23, 30), "UTC"), "2026-11-13");
  assert.equal(fd.addDays("2026-10-24", 2), "2026-10-26");
  assert.equal(fd.diffDays("2026-11-13", "2026-12-19"), 36);
  assert.equal(fd.weekday("2026-11-14"), "sat");
  assert.equal(fd.weekdayName("mon", "en"), "Monday");
  assert.equal(fd.weekdayName("sun", "fr"), "dimanche");
});

test("calendar events: all-day and timed events, end exclusive, ignored summaries", () => {
  const fd = load();
  assert.deepEqual({ ...fd.eventSpan({ start: { date: "2026-12-19" }, end: { date: "2027-01-04" }, summary: " Vacances de Noël " }, "UTC") }, {
    start: "2026-12-19",
    end: "2027-01-04",
    summary: "Vacances de Noël",
    description: "",
  });
  // A timed event ending at midnight does not cover the next day; a timed one in Paris.
  assert.equal(fd.eventSpan({ start: { dateTime: "2026-12-24T23:00:00Z" }, end: { dateTime: "2026-12-25T23:00:00Z" } }, "Europe/Paris").end, "2026-12-26");
  assert.equal(fd.eventSpan({ start: { dateTime: "2026-12-25T00:00:00+01:00" }, end: { dateTime: "2026-12-26T00:00:00+01:00" } }, "Europe/Paris").end, "2026-12-26");
  // No end: one day.
  assert.equal(fd.eventSpan({ start: "2027-05-07" }, "UTC").end, "2027-05-08");
  assert.equal(fd.eventSpan({ summary: "x" }, "UTC"), null);
  const list = fd.parseEvents(
    [
      { start: { date: "2027-08-31" }, end: { date: "2027-09-01" }, summary: "Vacances d'Été(prérentrée Enseignants)" },
      { start: { date: "2027-07-03" }, end: { date: "2027-09-02" }, summary: "Vacances d'Été" },
      { start: { date: "2027-05-07" }, end: { date: "2027-05-08" }, summary: "Pont de l'Ascension" },
    ],
    "UTC",
    "enseignant|prérentrée|teacher",
  );
  assert.deepEqual(
    list.map((e) => e.summary),
    ["Pont de l'Ascension", "Vacances d'Été"],
  );
  assert.equal(fd.covering(list, "2027-08-31").summary, "Vacances d'Été");
  assert.equal(fd.covering(list, "2027-09-02"), null);
  // A broken pattern ignores nothing instead of failing.
  assert.equal(fd.parseEvents([{ start: { date: "2027-05-07" }, summary: "a" }], "UTC", "(").length, 1);
});

test("sources and children are found through the registries", () => {
  const { fd, hass } = setup(SCENARIOS.friday);
  const found = fd.discover(hass);
  assert.equal(found.workday, IDS.workday);
  assert.equal(found.public_holidays, IDS.pub);
  assert.equal(found.school_holidays, IDS.school);
  assert.deepEqual(
    JSON.parse(JSON.stringify(found.children)),
    ["alex", "sam"].map((c) => ({
      name: c === "alex" ? "Alex" : "Sam",
      today: `sensor.pronote_martin_${c}_emploi_du_temps_aujourd_hui`,
      tomorrow: `sensor.pronote_martin_${c}_emploi_du_temps_demain`,
      next_day: `sensor.pronote_martin_${c}_emploi_du_temps_prochain_jour`,
    })),
  );
  assert.equal(fd.childName({ name: "Pronote - DUPONT Alex Marie" }), "Alex Marie");
  assert.equal(fd.childName({ name: "Pronote - Sam", name_by_user: null }), "Sam");
  assert.equal(fd.childName({ name: "Pronote - DUPONT Alex", name_by_user: "Big kid" }), "Big kid");
});

test("a Pronote timetable gives its day, first lesson and end, cancelled lessons left out", () => {
  const { fd, hass } = setup(SCENARIOS.sunday);
  const tt = fd.timetableOf(hass.states["sensor.pronote_martin_sam_emploi_du_temps_prochain_jour"], "UTC");
  assert.equal(tt.day, "2026-11-16");
  assert.equal(new Date(tt.start).toISOString(), "2026-11-16T09:00:00.000Z");
  assert.equal(new Date(tt.end).toISOString(), "2026-11-16T17:00:00.000Z");
  assert.equal(tt.lessons, 4);
  assert.equal(tt.canceled, 1);
  // The subject of the first lesson that takes place, in plain case.
  assert.equal(tt.subject, "ENGLISH");
  assert.equal(fd.subjectName("HISTORY-GEOGRAPHY", "en"), "History-geography");
  assert.equal(fd.subjectName("Maths", "en"), "Maths");
  // Without day_start_at (older versions): from the lessons.
  const s = structuredClone(hass.states["sensor.pronote_martin_sam_emploi_du_temps_prochain_jour"]);
  delete s.attributes.day_start_at;
  delete s.attributes.day_end_at;
  assert.equal(new Date(fd.timetableOf(s, "UTC").start).toISOString(), "2026-11-16T09:00:00.000Z");
  assert.equal(fd.timetableOf({ state: "0", attributes: { lessons: [] } }, "UTC"), null);
  assert.equal(fd.timetableOf({ state: "unavailable", attributes: {} }, "UTC"), null);
});

test("Sunday evening: school tomorrow at the earliest first lesson, a row per child, the holidays and public holiday ahead", async () => {
  const { fd, hass, calls } = setup(SCENARIOS.sunday);
  const card = await mount(fd, hass);
  const out = text(card);
  // Header: title, tomorrow's date, pill.
  assert.match(out, /Tomorrow Monday, November 16 School/);
  assert.match(out, /School at 8:00 AM/);
  assert.match(out, /Alex 8:00 AM · French/);
  // Sam's first lesson is cancelled: the next one.
  assert.match(out, /Sam 9:00 AM · English/);
  assert.match(out, /Christmas holidays · in 34 days Sat, Dec 19/);
  assert.match(out, /Christmas Day · in 40 days Fri, Dec 25/);
  assert.match(html(card), /class="headline k-school/);
  // Each calendar read once (school and public holidays, birthdays, bins), with a window around today; Workday asked
  // about tomorrow only.
  assert.equal(calls.api.length, 4);
  assert.ok(calls.api.every((p) => /start=2026-08-07/.test(decodeURIComponent(p))));
  assert.deepEqual(
    calls.ws.map((m) => m.service_data.check_date),
    ["2026-11-16"],
  );
});

test("the calendars are read once for every card of the page and not again on each update", async () => {
  const { fd, hass, calls } = setup(SCENARIOS.friday);
  const a = await mount(fd, hass);
  await mount(fd, hass, {}, fd.FamilyDayMiniCard);
  a.hass = { ...hass, states: { ...hass.states } };
  await flush();
  assert.equal(calls.api.length, 4);
});

test("no school tomorrow: weekend, public holiday, day off, holidays — without the children's rows", async () => {
  const cases = [
    [SCENARIOS.friday, /Tomorrow Saturday, November 14 Weekend No school — Weekend/, "weekend"],
    [SCENARIOS.armistice_eve, /Tomorrow Wednesday, November 11 Public holiday No school — Armistice Day/, "public_holiday"],
    [SCENARIOS.day_off, /Tomorrow Friday, November 20 Day off (z z )?No school — Day off/, "day_off"],
    [SCENARIOS.holidays_eve, /Tomorrow Saturday, December 19 Holidays No school — Christmas holidays/, "holidays"],
  ];
  for (const [now, re, kind] of cases) {
    const { fd, hass } = setup(now);
    const card = await mount(fd, hass);
    // Workday's answer for tomorrow comes after the first render.
    card._minute = 1;
    card.hass = { ...hass };
    assert.match(text(card), re);
    assert.match(html(card), new RegExp(`class="headline k-${kind}`));
    assert.doesNotMatch(html(card), /class="kids"/);
  }
  const { fd, hass } = setup(SCENARIOS.holidays_eve);
  assert.match(text(await mount(fd, hass)), /Christmas holidays · tomorrow/);
});

test("during the holidays: progress and day back at school, and the next public holiday", async () => {
  const { fd, hass } = setup(SCENARIOS.holidays);
  const card = await mount(fd, hass);
  const out = text(card);
  assert.match(out, /No school — Christmas holidays/);
  assert.match(out, /Christmas holidays · back in 7 days Day 10 of 16/);
  assert.match(html(card), /aria-valuenow="63"/);
  assert.match(out, /New Year's Day · in 4 days Fri, Jan 1/);
});

test("the options hide the children, the holidays and the public holidays", async () => {
  const { fd, hass } = setup(SCENARIOS.sunday);
  const out = text(await mount(fd, hass, { show_children: false, show_holidays: false, title: "Kids" }));
  assert.doesNotMatch(out, /Alex|Christmas holidays/);
  assert.match(out, /Kids Monday, November 16/);
  assert.match(out, /Christmas Day/);
  const card = await mount(fd, hass, { show_holidays: false, show_public_holidays: false, show_title: false });
  assert.doesNotMatch(html(card), /class="footer"/);
  assert.equal(card.hasAttribute?.("hide-title") ?? true, true);
});

test("the mini card answers for tomorrow in one line, with the holidays countdown", async () => {
  {
    const { fd, hass } = setup(SCENARIOS.sunday);
    const card = await mount(fd, hass, {}, fd.FamilyDayMiniCard);
    assert.match(text(card), /Tomorrow: school 8:00 AM Holidays in 34 days School/);
    assert.doesNotMatch(html(card), /class="headline/);
    // The badge keeps the full size: the same header as the full card.
    assert.match(html(card), /class="badge"/);
  }
  {
    const { fd, hass } = setup(SCENARIOS.friday);
    assert.match(text(await mount(fd, hass, {}, fd.FamilyDayMiniCard)), /No school tomorrow Holidays in 36 days Weekend/);
  }
  {
    const { fd, hass } = setup(SCENARIOS.holidays);
    assert.match(text(await mount(fd, hass, {}, fd.FamilyDayMiniCard)), /No school tomorrow Back to school in 7 days Holidays/);
  }
  {
    const { fd, hass } = setup(SCENARIOS.sunday);
    const out = text(await mount(fd, hass, { show_countdown: false, children: [] }, fd.FamilyDayMiniCard));
    assert.match(out, /Tomorrow: school School/);
    assert.doesNotMatch(out, /Holidays in/);
  }
});

test("the mini card's detail button unfolds the full card, folded back by a click elsewhere or when leaving the page", async () => {
  const { fd, hass } = setup(SCENARIOS.friday);
  const card = await mount(fd, hass, {}, fd.FamilyDayMiniCard);
  assert.doesNotMatch(html(card), /class="headline/);
  assert.match(html(card), /aria-pressed="false"/);
  card._onClick({ composedPath: () => [{ dataset: { action: "zoom" } }], stopPropagation() {} });
  assert.match(html(card), /class="headline/);
  assert.match(html(card), /aria-pressed="true"/);
  card.connectedCallback();
  card._unzoom.tap({ composedPath: () => [] });
  assert.doesNotMatch(html(card), /class="headline/);
  // A click inside the card does not fold it.
  card._setZoom(true);
  card._unzoom.tap({ composedPath: () => [card] });
  assert.match(html(card), /class="headline/);
  card.disconnectedCallback();
  assert.equal(card._zoomed, false);
  assert.doesNotMatch(card._render(), /class="headline/);
  assert.equal(new fd.FamilyDayMiniCard().getGridOptions().columns, 6);
  const plain = await mount(fd, hass, { zoom: false }, fd.FamilyDayMiniCard);
  assert.doesNotMatch(html(plain), /class="zoom"/);
});

test("Workday: check_date for tomorrow, or its state with `days_offset: 1`", async () => {
  // A Monday that Workday counts as a day off (an added holiday of its own), no holiday calendar.
  const now = SCENARIOS.sunday;
  const { fd, hass, calls } = setup(now, {
    callWS: async (msg) => {
      calls.ws.push(msg);
      return { response: { [msg.target.entity_id]: { workday: msg.service_data.check_date !== "2026-11-16" } } };
    },
  });
  const card = await mount(fd, hass, { public_holidays: false, school_holidays: false });
  card._minute = 1;
  card.hass = { ...hass };
  assert.match(text(card), /No school — Day off/);
  assert.ok(calls.ws.every((m) => m.type === "call_service" && m.domain === "workday" && m.service === "check_date" && m.return_response === true));
  assert.equal(calls.ws.length, 1);
  // A Workday sensor about tomorrow: its state, no call.
  const s2 = setup(now);
  const wd = s2.hass.states[IDS.workday];
  s2.hass.states[IDS.workday] = { ...wd, state: "off", attributes: { ...wd.attributes, days_offset: 1 } };
  const out = text(await mount(s2.fd, s2.hass, { public_holidays: false, school_holidays: false }));
  assert.match(out, /No school — Day off/);
  assert.equal(s2.calls.ws.length, 0);
});

test("without Workday, school days are Monday to Friday, or `school_days`", async () => {
  {
    const { fd, hass } = setup(SCENARIOS.friday);
    assert.match(text(await mount(fd, hass, { workday: false, school_days: ["mon", "tue", "thu", "fri", "sat"] })), /Saturday, November 14 School/);
  }
  {
    const { fd, hass } = setup(SCENARIOS.friday);
    assert.match(text(await mount(fd, hass, { workday: false })), /No school — Weekend/);
  }
});

test("children given in YAML replace the ones found, and an empty list turns Pronote off", async () => {
  const { fd, hass } = setup(SCENARIOS.sunday);
  const out = text(
    await mount(fd, hass, {
      children: [
        { name: "Kid", tomorrow: "sensor.pronote_martin_sam_emploi_du_temps_demain" },
        { name: "Nobody", tomorrow: "sensor.none" },
        { name: "Free", tomorrow: "sensor.free" },
      ],
    }),
  );
  assert.match(out, /Kid 9:00 AM · English/);
  assert.match(out, /Nobody Timetable not known yet/);
  assert.doesNotMatch(out, /Alex/);
  const none = text(await mount(fd, hass, { children: [] }));
  assert.match(none, /School day/);
  assert.doesNotMatch(none, /Sam/);
  assert.throws(() => new fd.FamilyDayCard().setConfig({ children: {} }), /children must be a list/);
  // A valid "tomorrow" timetable without any lesson: no lessons.
  const s = setup(SCENARIOS.sunday);
  s.hass.states["sensor.free"] = { state: "0", attributes: { lessons: [] } };
  assert.match(text(await mount(s.fd, s.hass, { children: [{ name: "Free", tomorrow: "sensor.free" }] })), /Free No lessons/);
});

test("no source at all: a message, not an error", async () => {
  const { fd } = setup(SCENARIOS.friday);
  const card = await mount(fd, { states: {}, entities: {}, devices: {}, language: "en" });
  assert.match(text(card), /No source found/);
});

test("a calendar still loading leaves tomorrow unknown; one that fails is left out", async () => {
  {
    const { fd, hass } = setup(SCENARIOS.friday, { callApi: () => new Promise(() => {}) });
    const card = await mount(fd, hass);
    assert.match(text(card), /Unknown Loading…/);
    assert.match(html(card), /class="headline k-unknown/);
  }
  {
    const { fd, hass } = setup(SCENARIOS.friday, { callApi: async () => Promise.reject(new Error("boom")) });
    const out = text(await mount(fd, hass));
    assert.match(out, /No school — Weekend/);
    assert.doesNotMatch(out, /Loading…/);
  }
});

test("the language follows Home Assistant, or the `language` option, and the time format", async () => {
  const { fd, hass } = setup(SCENARIOS.sunday);
  const fr = text(await mount(fd, { ...hass, language: "fr", locale: { language: "fr", time_zone: "server" } }));
  assert.match(fr, /Demain Lundi 16 novembre École/);
  assert.match(fr, /École à 8:00 Recycling ce soir Emma · 9 ans Lucas · demain St Albert Alex 8:00 · French/);
  assert.match(fr, /Christmas holidays · dans 34 jours Sam\. 19 déc\./);
  const de = text(await mount(fd, hass, { language: "de" }));
  assert.match(de, /Morgen Montag, 16. November Schule/);
  const h24 = text(await mount(fd, { ...hass, locale: { language: "en", time_zone: "server", time_format: "24" } }));
  assert.match(h24, /School at 08:00/);
  assert.equal(fd.lang({ language: "pt-BR" }, {}), "pt");
  assert.equal(fd.intlLocale({ language: "pt" }, {}), "pt-PT");
  assert.equal(fd.lang({ language: "sr-Latn" }, {}), "sr-Latn");
});

test("every language has every English text, and the same placeholders", () => {
  const fd = load();
  const keys = Object.keys(fd.STRINGS.en);
  const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join();
  assert.equal(Object.keys(fd.STRINGS).length, 22);
  for (const [l, table] of Object.entries(fd.STRINGS)) {
    assert.deepEqual(Object.keys(table).sort(), [...keys].sort(), l);
    for (const k of keys) assert.equal(ph(table[k]), ph(fd.STRINGS.en[k]), `${l}.${k}`);
  }
});

test("every English text is used by the cards", () => {
  const src = readFileSync(new URL("../src/family-day-card.js", import.meta.url), "utf8");
  const code = src.slice(src.indexOf("// Icons"));
  const fd = load();
  for (const k of Object.keys(fd.STRINGS.en)) {
    const used = code.includes(`"${k}"`) || (k.startsWith("kind_") && code.includes("`kind_${")) || (k.startsWith("opt_") && code.includes("`opt_${")) || (k.startsWith("help_") && code.includes("`help_${"));
    assert.ok(used, k);
  }
});

test("a change of day plays the swap animation once, and the old picture leaves", async () => {
  const { fd, hass } = setup(SCENARIOS.friday);
  const card = await mount(fd, hass);
  assert.doesNotMatch(html(card), /glyph swap-/);
  // Saturday evening: tomorrow was the weekend, it is still the weekend; Sunday evening: school tomorrow.
  fd.setNow(SCENARIOS.sunday);
  card._minute = 1;
  card.hass = { ...hass };
  for (let i = 0; i < 4; i++) await flush();
  card._minute = 2;
  card.hass = { ...hass };
  assert.match(html(card), /glyph swap-a/);
  assert.match(html(card), /glyph ghost k-weekend" data-ghost="tomorrow"/);
  card.shadowRoot.listeners.animationend({ target: { dataset: { ghost: "tomorrow" } } });
  assert.doesNotMatch(html(card), /data-ghost="tomorrow"/);
  assert.match(html(card), /glyph swap-a/);
});

test("clicks open the more-info of the source of what was clicked", async () => {
  const { fd, hass } = setup(SCENARIOS.sunday);
  const card = await mount(fd, hass);
  card._onClick({ composedPath: () => [{ dataset: { entity: IDS.school } }], stopPropagation() {} });
  assert.equal(card.events.at(-1).type, "hass-more-info");
  assert.equal(card.events.at(-1).detail.entityId, IDS.school);
  assert.match(html(card), new RegExp(`data-entity="${IDS.pub}"`));
  assert.match(html(card), new RegExp(`class="headline k-school clickable" role="button" tabindex="0" data-entity="${IDS.workday}"`));
  assert.match(html(card), /data-entity="sensor.pronote_martin_alex_emploi_du_temps_demain"/);
});

test("the editors keep options at their default out of the YAML", () => {
  const fd = load();
  const defaults = Object.fromEntries(fd.FamilyDayCardEditor.toggles);
  assert.deepEqual(
    { ...fd.cleanConfig({ type: "custom:family-day-card", show_children: true, show_holidays: false, school_days: [], title: "", language: "" }, defaults) },
    { type: "custom:family-day-card", show_holidays: false },
  );
  // The mini card's editor offers the full card's options too, plus its own.
  const mini = fd.FamilyDayMiniCardEditor.toggles.map(([n]) => n);
  for (const [n] of fd.FamilyDayCardEditor.toggles) assert.ok(mini.includes(n), n);
  assert.ok(mini.includes("zoom") && mini.includes("show_countdown"));
  const ed = new fd.FamilyDayMiniCardEditor();
  ed.setConfig({});
  ed.hass = { states: {}, entities: {}, devices: {}, language: "en" };
  const names = ed._form.schema.flatMap((s) => (s.schema ? s.schema.map((x) => x.name) : [s.name]));
  for (const n of ["title", "workday", "school_holidays", "public_holidays", "school_days", "show_children", "show_holidays", "show_public_holidays", "show_countdown", "language", "zoom"])
    assert.ok(names.includes(n), n);
  assert.ok(!names.includes("children") && !names.includes("ignore"), "children and ignore stay YAML only");
  assert.equal(ed._form.computeLabel({ name: "workday" }), "Workday sensor");
  assert.equal(ed._form.data.show_countdown, true);
  for (const n of ["waste", "birthdays", "show_waste", "show_birthdays", "show_saint"]) assert.ok(names.includes(n), n);
  // The name day is on by default in French only: the form shows it so, and keeps it out of the YAML at that default.
  assert.equal(ed._form.data.show_saint, false);
  const fr = new fd.FamilyDayCardEditor();
  fr.setConfig({ language: "fr" });
  fr.hass = { states: {}, entities: {}, devices: {}, language: "en" };
  assert.equal(fr._form.data.show_saint, true);
  const sent = [];
  fr.dispatchEvent = (ev) => sent.push(ev.detail.config);
  fr._form.listeners["value-changed"]({ detail: { value: { language: "fr", show_saint: true }, }, stopPropagation() {} });
  assert.deepEqual({ ...sent.at(-1) }, { language: "fr" });
});

test("the cards register their pickers and sizes", () => {
  const fd = load();
  assert.deepEqual(JSON.parse(JSON.stringify(fd.window.customCards.map((c) => c.type))), ["family-day-card", "family-day-mini-card"]);
  assert.deepEqual({ ...new fd.FamilyDayCard().getGridOptions() }, { columns: 12, min_columns: 6 });
});

test("chips: tomorrow's bins, today's and tomorrow's birthdays, today's name day in French (#2)", async () => {
  const { fd, hass } = setup(SCENARIOS.sunday);
  const card = await mount(fd, hass);
  const out = text(card);
  assert.match(out, /School at 8:00 AM Recycling tonight Emma · 9 years Lucas · tomorrow Alex/);
  // The name days are French: off by default in another language, on with show_saint.
  assert.doesNotMatch(out, /St Albert/);
  assert.match(html(card), /class="xchip w-yellow clickable" role="button" tabindex="0" data-entity="calendar.collecte_dechets"/);
  const saint = await mount(fd, hass, { show_saint: true });
  assert.match(text(saint), /Lucas · tomorrow St Albert/);
  assert.match(html(saint), /title="Name day : St Albert le Grand"/);
  const off = text(await mount(fd, hass, { show_waste: false, show_birthdays: false }));
  assert.doesNotMatch(off, /Recycling|Emma/);
  // A calendar set in the options replaces the ones found; false turns them off.
  assert.doesNotMatch(text(await mount(fd, hass, { birthdays: false })), /Emma/);
  // The mini card shows them under its header.
  const mini = await mount(fd, hass, {}, fd.FamilyDayMiniCard);
  assert.match(html(mini), /class="extras mini"/);
  assert.match(text(mini), /Recycling tonight/);
  // A weekend: no collection on Saturday, no birthday.
  const { fd: fd2, hass: h2 } = setup(SCENARIOS.friday);
  assert.doesNotMatch(html(await mount(fd2, h2)), /class="extras/);
});

test("name days, bin colours, birthday names and ages", () => {
  const fd = load();
  const saint = (k) => fd.saintOf(k)?.name;
  assert.equal(saint("2026-11-11"), "St Martin");
  assert.equal(saint("2026-11-22"), "Ste Cécile");
  assert.equal(saint("2026-06-29"), "Sts Pierre et Paul");
  assert.equal(saint("2026-11-01"), "Toussaint");
  assert.equal(saint("2026-02-06"), "St Gaston");
  assert.equal(saint("2028-02-29"), "St Auguste");
  assert.deepEqual([...fd.NAME_DAYS.map((x) => x.length)], [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
  // The tooltip's saints of the day come from data.gouv.fr, May and June put back in place.
  assert.ok(fd.saintOf("2026-05-30").all.includes("Ste Jeanne D'Arc"));
  assert.ok(fd.saintOf("2026-02-06").all.includes("St Paul Miki"));
  assert.deepEqual([...fd.SAINTS.map((x) => x.length)], [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]);
  assert.ok(fd.SAINTS.flat(2).every((n) => n && !/Ã|à®|à«| {2}/.test(n)), "no broken accent");
  assert.equal(fd.binColor("Poubelle jaune"), "yellow");
  assert.equal(fd.binColor("Verre"), "green");
  assert.equal(fd.binColor("Papier / carton"), "blue");
  assert.equal(fd.binColor("Biodéchets"), "brown");
  assert.equal(fd.binColor("Ordures ménagères"), "gray");
  assert.equal(fd.binColor("Encombrants"), "default");
  assert.equal(fd.birthdayName("Anniversaire de Léa"), "Léa");
  assert.equal(fd.birthdayName("Anniversaire d'Inès"), "Inès");
  assert.equal(fd.birthdayName("🎂 Léa (2017)"), "Léa");
  assert.equal(fd.birthdayName("Emma's birthday"), "Emma");
  assert.equal(fd.birthdayAge({ summary: "Léa", description: "née en 2017", start: "2026-11-15" }), 9);
  assert.equal(fd.birthdayAge({ summary: "Léa", description: "", start: "2026-11-15" }), null);
});
