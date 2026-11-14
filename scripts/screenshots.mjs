// Renders the cards with mock data (scripts/mock-states.mjs) and saves the README screenshots.
// Usage: npm run build && npm run screenshots   (CHROMIUM_PATH=/path/to/chrome to use an installed browser)
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { calendarEvents, IDS, isWorkday, SCENARIOS, scenario } from "./mock-states.mjs";
import { unchanged } from "./pixels.mjs";
import { gifs, shots } from "./screenshot-list.mjs";

const root = fileURLToPath(new URL("..", import.meta.url));
mkdirSync(`${root}screenshots`, { recursive: true });

// Every capture is rendered to a temporary file and copied over screenshots/<file> only when its decoded pixels
// differ (scripts/pixels.mjs): a run that draws the same pictures changes no file, so the workflow commits nothing.
const work = mkdtempSync(join(tmpdir(), "fd-shots-"));
const keep = (fresh, name) => {
  const target = `${root}screenshots/${name}`;
  if (unchanged(fresh, target)) return console.log(`screenshots/${name} (unchanged)`);
  copyFileSync(fresh, target);
  console.log(`screenshots/${name}`);
};
const cardJs = readFileSync(`${root}dist/family-day-card.js`, "utf8");

// Every uncaught page error is collected here; the script exits non-zero when any occurred.
const pageErrors = [];

const THEMES = {
  light: {
    "--primary-background-color": "#e8eaed",
    "--secondary-background-color": "#ececec",
    "--card-background-color": "#ffffff",
    "--primary-text-color": "#212121",
    "--secondary-text-color": "#727272",
    "--divider-color": "rgba(0,0,0,.12)",
  },
  dark: {
    "--primary-background-color": "#111111",
    "--secondary-background-color": "#282828",
    "--card-background-color": "#1c1c1c",
    "--primary-text-color": "#e1e1e1",
    "--secondary-text-color": "#9b9b9b",
    "--divider-color": "rgba(225,225,225,.12)",
  },
};

// Minimal stand-in for Home Assistant's <ha-card>.
const HA_CARD = `customElements.define("ha-card", class extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }).innerHTML =
      "<style>:host{display:block;background:var(--card-background-color);border-radius:12px;" +
      "border:1px solid var(--divider-color);color:var(--primary-text-color);overflow:hidden}</style><slot></slot>";
  }
});`;

const pageHtml = (theme, width) => `<!doctype html><html lang="en"><head><meta charset="utf-8">
<style>
  :root { ${Object.entries(THEMES[theme])
    .map(([k, v]) => `${k}:${v};`)
    .join("")} }
  body { margin: 0; padding: 16px; background: var(--primary-background-color); color: var(--primary-text-color);
         font-family: Roboto, "Segoe UI", Helvetica, Arial, sans-serif; width: ${width}px; }
</style></head><body><div id="root"></div></body></html>`;

// The calendars and Workday answers of the mock, for the page (a year around every scenario).
const CALENDARS = Object.fromEntries([IDS.school, IDS.pub].map((id) => [id, calendarEvents(id, "2026-01-01T00:00:00Z", "2028-12-31T00:00:00Z")]));
const WORKDAYS = {};
for (let d = Date.UTC(2026, 0, 1); d < Date.UTC(2028, 0, 1); d += 86400e3) WORKDAYS[new Date(d).toISOString().slice(0, 10)] = isWorkday(new Date(d).toISOString().slice(0, 10));

// Opens a card on a fresh page, its clock frozen at the shot's scenario, and mounts it with the mock hass. `next`
// (a scenario) moves the clock on once the card is drawn, so that the day changes kind under the eyes (swap GIF).
async function openCard(browser, { file, type, config, theme, width, at, next }) {
  const now = SCENARIOS[at];
  const context = await browser.newContext({ deviceScaleFactor: 2, viewport: { width: 1000, height: 2000 }, timezoneId: "UTC", locale: "en-US" });
  const page = await context.newPage();
  await page.clock.setFixedTime(now);
  page.on("pageerror", (err) => {
    console.error(`pageerror (${file}): ${err.message}`);
    pageErrors.push(`${file}: ${err.message}`);
  });
  await page.setContent(pageHtml(theme, width));
  await page.addScriptTag({ content: HA_CARD });
  await page.addScriptTag({ content: cardJs });
  const mock = (n) => scenario(n);
  await page.evaluate(
    ({ type, config, sc, theme, calendars, workdays }) => {
      const el = document.createElement(type);
      el.setConfig({ type: `custom:${type}`, ...config });
      const hass = {
        ...sc,
        language: "en",
        locale: { language: "en", time_zone: "local" },
        themes: { darkMode: theme === "dark" },
        callApi: async (_m, path) => {
          const [, id, query] = path.match(/^calendars\/([^?]+)\?(.*)$/);
          const q = new URLSearchParams(query);
          const from = q.get("start").slice(0, 10);
          const to = q.get("end").slice(0, 10);
          return (calendars[id] || []).filter((e) => e.end.date > from && e.start.date < to);
        },
        callWS: async (msg) => ({ context: {}, response: { [msg.target.entity_id]: { workday: workdays[msg.service_data.check_date] } } }),
        callService: () => {},
      };
      window.__hass = hass;
      el.hass = hass;
      document.getElementById("root").appendChild(el);
    },
    { type, config, sc: mock(now), theme, calendars: CALENDARS, workdays: WORKDAYS },
  );
  await page.waitForTimeout(300);
  if (next) {
    await page.clock.setFixedTime(SCENARIOS[next]);
    await page.evaluate((sc) => {
      const el = document.querySelector("#root").firstElementChild;
      el._minute = -1;
      el.hass = { ...window.__hass, ...sc };
      // The swap starts now: held at its first frame (style flushed first), so that the old picture is still there
      // when the GIF steps through it.
      getComputedStyle(el.shadowRoot.querySelector(".headline") || el).opacity;
      for (const a of el.shadowRoot.getAnimations()) a.pause();
    }, mock(SCENARIOS[next]));
  }
  return { page, context };
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

const mount = (s) => openCard(browser, s);

const animations = () => {
  const card = document.querySelector("#root").firstElementChild.shadowRoot;
  return [document, card].flatMap((r) => r.getAnimations());
};

for (const s of shots) {
  const { page, context } = await mount(s);
  for (const sel of s.clicks || []) {
    // A mouse click (detail 1), not .click(): a keyboard-like click would move the focus and show its ring.
    await page.evaluate(
      (sel) =>
        document
          .querySelector("#root")
          .firstElementChild.shadowRoot.querySelector(sel)
          .dispatchEvent(new MouseEvent("click", { bubbles: true, composed: true, detail: 1 })),
      sel,
    );
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(600);
  // Every animation at its start, then paused: the still capture is the same on every run.
  await page.evaluate(`(${animations.toString()})().forEach((a) => { a.pause(); a.currentTime = 0; })`);
  const box = await page.locator("#root").boundingBox();
  await page.screenshot({ path: join(work, `${s.file}.png`), clip: { x: 0, y: 0, width: s.width + 32, height: Math.ceil(box.height) + 32 } });
  keep(join(work, `${s.file}.png`), `${s.file}.png`);
  await context.close();
}

// Records one animated state as a looping GIF (screenshots/<gif.file>.gif) — needs ffmpeg on PATH.
// Every animation is paused and stepped frame by frame, so the GIF is identical whatever the machine's speed.
async function makeGif(gif, { fps = 20, seconds = 3 } = {}) {
  const { page, context } = await mount(gif);
  await page.waitForTimeout(600);
  const box = await page.locator("#root").boundingBox();
  const clip = { x: 0, y: 0, width: gif.width + 32, height: Math.ceil(box.height) + 32 };
  const dir = mkdtempSync(join(tmpdir(), "fd-frames-"));
  const frames = Math.round(fps * seconds);
  for (let i = 0; i < frames; i++) {
    const n = await page.evaluate(
      // Two animation frames after the seek, so that the screenshot never catches the frame before it is painted.
      `(async () => { const all = (${animations.toString()})(); for (const a of all) { a.pause(); a.currentTime = ${(i * 1000) / fps}; }
        for (let k = 0; k < 2; k++) await new Promise((r) => requestAnimationFrame(() => r()));
        return all.length; })()`,
    );
    if (!n) throw new Error(`${gif.file}: no animation found to step`);
    await page.screenshot({ path: join(dir, `f${String(i).padStart(3, "0")}.png`), clip });
  }
  await context.close();
  const out = join(work, `${gif.file}.gif`);
  // Halve the retina capture and build a per-clip palette with ordered (Bayer) dithering: deterministic and small.
  execFileSync("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-framerate",
    String(fps),
    "-i",
    join(dir, "f%03d.png"),
    "-vf",
    `scale=${clip.width}:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=4`,
    "-loop",
    "0",
    out,
  ]);
  rmSync(dir, { recursive: true });
  keep(out, `${gif.file}.gif`);
}

for (const g of gifs) await makeGif(g);
await browser.close();
rmSync(work, { recursive: true });

if (pageErrors.length) {
  console.error(`\n${pageErrors.length} page error(s) while rendering:`);
  for (const e of pageErrors) console.error(`  ${e}`);
  process.exitCode = 1;
}
