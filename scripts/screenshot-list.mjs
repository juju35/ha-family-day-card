// The README screenshots (PNG) and animations (GIF) rendered by scripts/screenshots.mjs.
// Every capture has a twin in the other theme ("-dark" for a light capture, "-light" for a dark one)
// that shows exactly the same state: only the theme differs (checked by test/screenshots.test.mjs).
// `at` is the scenario of scripts/mock-states.mjs (a fixed instant); `next` moves the clock to another one once the
// card is drawn.

const pair = (file, type, width, at, config = {}, extra = {}, first = "light") => {
  const second = first === "light" ? "dark" : "light";
  return [
    { file, type, theme: first, width, at, config, ...extra },
    { file: `${file}-${second}`, type, theme: second, width, at, config, ...extra },
  ];
};

export const shots = [
  // Sunday evening: school tomorrow, each child's first lesson, the Christmas holidays and Christmas Day ahead.
  ...pair("card", "family-day-card", 420, "sunday", { show_saint: true }),
  ...pair("mini-card", "family-day-mini-card", 380, "sunday"),
  // The same Sunday evening with the two-day layout: today (no school) above tomorrow (school at 8:00).
  ...pair("card-today", "family-day-card", 420, "sunday", { show_today: true, show_saint: true }),
  // Friday evening: the weekend tomorrow.
  ...pair("card-weekend", "family-day-card", 420, "friday", {}, {}, "dark"),
  // The eve of a public holiday.
  ...pair("card-public-holiday", "family-day-card", 420, "armistice_eve"),
  // In the middle of the Christmas holidays: their progress and the day back at school.
  ...pair("card-holidays", "family-day-card", 420, "holidays", {}, {}, "dark"),
  ...pair("mini-card-holidays", "family-day-mini-card", 380, "holidays", {}, {}, "dark"),
  ...pair("mini-card-zoom", "family-day-mini-card", 420, "sunday", {}, { clicks: [".zoom"] }),
  // Narrow cards: the full card at 6 of 12 columns of a phone's Sections view (~170 px wide cards are mini cards).
  ...pair("card-narrow", "family-day-card", 238, "sunday"),
  ...pair("mini-card-narrow", "family-day-mini-card", 170, "sunday"),
];

// One looping GIF per distinct animated picture of tomorrow (each one its own keyframes):
//   school          — the backpack swinging
//   weekend         — the sun turning and pulsing
//   holidays        — the beach umbrella swaying over the waves
//   public-holiday  — the party popper throwing confetti
//   day-off         — "z z" rising over the sofa
//   swap            — at midnight, the weekend's sun leaves and the backpack bounces in
// Only the header and the answer are shown (no children nor footer) to keep the files small.
const HERO = { show_children: false, show_holidays: false, show_public_holidays: false };
export const gifs = [
  ...pair("school", "family-day-card", 420, "sunday", HERO),
  ...pair("weekend", "family-day-card", 420, "friday", HERO, {}, "dark"),
  ...pair("holidays", "family-day-card", 420, "holidays", HERO),
  ...pair("public-holiday", "family-day-card", 420, "armistice_eve", HERO, {}, "dark"),
  ...pair("day-off", "family-day-card", 420, "day_off", HERO),
  ...pair("swap", "family-day-card", 420, "friday", HERO, { next: "sunday" }, "dark"),
];
