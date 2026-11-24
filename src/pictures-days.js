// ---------------------------------------------------------------------------
// Pictures of the days, animated (see the styles below)
// ---------------------------------------------------------------------------
import { ICONS } from "./icons.js";
import { KINDS } from "./kinds-day.js";

export const ART = {
  school: `<g class="a-bag"><path d="${ICONS.bag}"/></g>`,
  weekend: `<g class="a-sun"><g class="rays">${[0, 45, 90, 135, 180, 225, 270, 315]
    .map((r) => `<rect x="11" y="1.2" width="2" height="3.6" rx="1" transform="rotate(${r} 12 12)"/>`)
    .join("")}</g><circle class="core" cx="12" cy="12" r="5"/></g>`,
  holidays: `<g class="a-beach"><g class="umbrella"><path d="M12 3.2c5.2 0 9.4 3.6 9.6 8.2-1.2-1.4-2.6-1.9-4-1.9s-2.7.6-3.6 1.8c-.5-1.1-1.2-1.8-2-1.8s-1.5.7-2 1.8c-.9-1.2-2.2-1.8-3.6-1.8s-2.8.5-4 1.9C2.6 6.8 6.8 3.2 12 3.2z"/><rect x="11.2" y="9" width="1.6" height="10" rx=".8"/></g><clipPath id="fd-sea"><rect width="24" height="24"/></clipPath><g clip-path="url(#fd-sea)"><path class="wave" d="M-6 20.5c2 0 2-1.4 4-1.4s2 1.4 4 1.4 2-1.4 4-1.4 2 1.4 4 1.4 2-1.4 4-1.4 2 1.4 4 1.4 2-1.4 4-1.4 2 1.4 4 1.4 2-1.4 4-1.4 2 1.4 4 1.4V23H-6z"/></g></g>`,
  public_holiday: `<g class="a-party"><g class="popper"><path d="${ICONS.public_holiday}"/></g>${[
    [5, 4, 1.1, "c1"],
    [9, 2, 0.9, "c2"],
    [19, 3, 1, "c3"],
    [21, 9, 0.9, "c1"],
    [16, 1.5, 0.8, "c2"],
  ]
    .map(([x, y, r, c], i) => `<circle class="confetti ${c} d${i}" cx="${x}" cy="${y}" r="${r}"/>`)
    .join("")}</g>`,
  day_off: `<g class="a-sofa"><path d="${ICONS.day_off}"/><text class="z z1" x="16" y="5">z</text><text class="z z2" x="19" y="3">z</text></g>`,
  unknown: `<g><path d="${ICONS.unknown}"/></g>`,
};
export const art = (kind) => `<svg class="art-svg" viewBox="0 0 24 24" aria-hidden="true">${ART[KINDS.includes(kind) ? kind : "unknown"]}</svg>`;

// ---------------------------------------------------------------------------
// The illustrated header: a 200 × 80 scene of what tomorrow is, at the right of a 90 px banner, over a 10 px ground
// strip under the whole banner (a lawn, or sand for the holidays). The left of the banner is open sky: the title,
// the subtitle and the round icon sit there. Drawn in the card's own colours, day and night.
// ---------------------------------------------------------------------------

// mdiSchool: the round icon of the illustrated header.
export const SCHOOL_ICON = "M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z";

// Night picture: forced by illustration_theme, else Home Assistant's dark theme alone (a light theme keeps the day picture after sunset).
export const isNight = (hass, config) => {
  const theme = config?.illustration_theme;
  if (theme === "night") return true;
  if (theme === "day") return false;
  return !!hass?.themes?.darkMode;
};

// The ground strip of each kind of day: sand for the holidays, a lawn otherwise.
export const GROUND = { holidays: "sand" };

export const FD_STARS = [
  [8, 8, 0.6],
  [30, 20, 0.5],
  [52, 6, 0.7],
  [78, 26, 0.45],
  [104, 10, 0.6],
  [128, 4, 0.5],
  [146, 22, 0.55],
  [172, 8, 0.7],
  [192, 28, 0.45],
];

// Sky: the sun and two clouds by day, the stars and the moon by night; the sun / moon at (x, y).
export const fdSky = (n, x, y, uid) =>
  n
    ? `<g class="fds-stars">${FD_STARS.map(([sx, sy, r], i) => `<circle class="fds-star${i % 3 ? "" : " tw"}" cx="${sx}" cy="${sy}" r="${r}"/>`).join("")}</g>` +
      `<circle cx="${x}" cy="${y}" r="10" fill="url(#fd-glow-${uid})"/><path class="fds-moon" d="M${x} ${y - 6}a6 6 0 1 0 5.4 8.6a4.8 4.8 0 1 1 -5.4 -8.6Z"/>`
    : `<circle cx="${x}" cy="${y}" r="10" fill="url(#fd-glow-${uid})"/><circle class="fds-sun" cx="${x}" cy="${y}" r="6"/>` +
      `<path class="fds-cloud" d="M${x - 34} 20a4 4 0 0 1 6-3.4 5 5 0 0 1 9.4 1.4 3 3 0 0 1 .6 6H${x - 32}a3 3 0 0 1-2-4Z"/>` +
      `<path class="fds-cloud c2" d="M${x + 22} 12a3.4 3.4 0 0 1 5-2.8 4.2 4.2 0 0 1 8 1.2 2.6 2.6 0 0 1 .4 5H${x + 24}a2.6 2.6 0 0 1-2-3.4Z"/>`;

export const fdHills = () =>
  `<path class="fds-hill far" d="M0 80C30 68 60 62 100 64C140 66 170 58 200 60V80Z"/><path class="fds-hill" d="M0 80C40 72 90 73 200 70V80Z"/>`;

export const fdTree = (x, s = 1) =>
  `<g transform="translate(${x} 80) scale(${s})"><rect class="fds-trunk" x="-1" y="-12" width="2" height="12"/><circle class="fds-leaves" cx="0" cy="-14" r="7"/></g>`;

export const fdWin = (x, y, w, h) => `<rect class="fds-win" x="${x}" y="${y}" width="${w}" height="${h}" rx=".6"/>`;

export const FD_SCENES = {
  // A school day: the school, its clock and flag, the school bus driving up.
  school: (n, uid) =>
    `${fdSky(n, 38, 16, uid)}${fdHills()}
    <g transform="translate(110 36)">
      <rect class="fds-pole" x="38.5" y="-30" width="1" height="13"/><path class="fds-flag" d="M39.5 -30h8l-2 3 2 3h-8Z"/>
      <rect class="fds-wall" width="78" height="44"/>
      <path class="fds-roof" d="M-6 1L39 -18L84 1Z"/>
      <circle class="fds-clock" cx="39" cy="-6" r="4.5"/><path class="fds-hand" d="M39 -6V-9M39 -6H41"/>
      ${[6, 20, 50, 64].map((x) => fdWin(x, 10, 9, 9)).join("")}
      <rect class="fds-door" x="33" y="24" width="12" height="20"/>
    </g>
    <g class="fds-bus"><g transform="translate(24 80)">
      <rect class="fds-bus-body" y="-22" width="46" height="18" rx="3"/>
      ${[4, 14, 24, 34].map((x) => `<rect class="fds-glass" x="${x}" y="-18.5" width="7" height="6" rx="1"/>`).join("")}
      <rect class="fds-bus-band" y="-8.5" width="46" height="1.6"/><rect class="fds-light" x="43.4" y="-7" width="2.6" height="2" rx=".6"/>
      <circle class="fds-wheel" cx="10" cy="-3.4" r="3.4"/><circle class="fds-wheel" cx="36" cy="-3.4" r="3.4"/>
    </g></g>`,
  // The weekend: the park, its trees and the swings.
  weekend: (n, uid) =>
    `${fdSky(n, 44, 16, uid)}${fdHills()}${fdTree(84, 1.3)}${fdTree(184, 1.5)}
    <path class="fds-frame" d="M112 80L123 46H153L164 80"/>
    <g class="fds-swing"><path class="fds-rope" d="M129 46V68M137 46V68"/><rect class="fds-seat a" x="127" y="67" width="12" height="2.4" rx="1"/></g>
    <g class="fds-swing b"><path class="fds-rope" d="M143 46V66M151 46V66"/><rect class="fds-seat b" x="141" y="65" width="12" height="2.4" rx="1"/></g>
    <circle class="fds-ball" cx="100" cy="77" r="3"/>`,
  // The school holidays: the sea, the beach, a parasol and a palm tree.
  holidays: (n, uid) =>
    `${fdSky(n, 150, 18, uid)}
    <linearGradient id="fd-fade-${uid}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="36" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient>
    <mask id="fd-mask-${uid}" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="80"><rect width="200" height="80" fill="url(#fd-fade-${uid})"/></mask>
    <g mask="url(#fd-mask-${uid})"><rect class="fds-sea" y="52" width="200" height="20"/>
    <clipPath id="fd-sea-${uid}"><rect y="50" width="200" height="22"/></clipPath>
    <g clip-path="url(#fd-sea-${uid})"><path class="fds-wave" d="M-10 56${"q5 -2 10 0t10 0".repeat(12)}"/><path class="fds-wave w2" d="M-6 62${"q5 -2 10 0t10 0".repeat(12)}"/></g>
    <path class="fds-sand" d="M0 70Q100 63 200 68V80H0Z"/></g>
    <g transform="translate(116 80)"><path class="fds-stick" d="M0 0V-30"/><path class="fds-parasol" d="M-16 -28Q0 -40 16 -28Z"/><path class="fds-parasol-band" d="M-8 -30.5Q0 -40 8 -30.5"/></g>
    <rect class="fds-towel" x="128" y="76" width="20" height="3" rx="1"/>
    <g transform="translate(178 80)"><path class="fds-palm" d="M0 0Q-2 -16 4 -30"/><g class="fds-fronds"><path d="M4 -30q-10 -2 -14 4q8 -6 14 -4z"/><path d="M4 -30q10 -2 14 4q-8 -6 -14 -4z"/><path d="M4 -30q-2 -8 -10 -10q8 4 10 10z"/><path d="M4 -30q4 -8 12 -8q-8 3 -12 8z"/></g></g>`,
  // A public holiday: the town hall with its flags and bunting, fireworks.
  public_holiday: (n, uid) =>
    `${n ? fdSky(n, 26, 14, uid) : `<path class="fds-cloud" d="M20 20a4 4 0 0 1 6-3.4 5 5 0 0 1 9.4 1.4 3 3 0 0 1 .6 6H22a3 3 0 0 1-2-4Z"/>`}${fdHills()}
    ${[
      [52, 18, "a", 0],
      [190, 14, "b", 1],
      [78, 30, "c", 2],
    ]
      .map(
        ([x, y, c, i]) =>
          `<g class="fds-burst d${i} ${c}" transform="translate(${x} ${y})"><g>${[0, 45, 90, 135, 180, 225, 270, 315].map((r) => `<path d="M0 -3V-8" transform="rotate(${r})"/>`).join("")}</g></g>`,
      )
      .join("")}
    <g transform="translate(108 44)">
      <path class="fds-pole" d="M10 -14V-30M42 -18V-34M74 -14V-30"/>
      <path class="fds-pennant a" d="M10.5 -30h9l-1.5 3 1.5 3h-9Z"/><path class="fds-pennant b" d="M42.5 -34h9l-1.5 3 1.5 3h-9Z"/><path class="fds-pennant c" d="M74.5 -30h9l-1.5 3 1.5 3h-9Z"/>
      <rect class="fds-wall" x="2" y="-4" width="80" height="40"/>
      <path class="fds-roof" d="M-2 -3L42 -19L86 -3Z"/>
      ${[10, 24, 54, 68].map((x) => fdWin(x, 4, 7, 10)).join("")}
      ${[8, 22, 56, 70].map((x) => `<rect class="fds-column" x="${x}" y="18" width="3" height="18"/>`).join("")}
      <path class="fds-door" d="M35 36V22a7 7 0 0 1 14 0V36Z"/>
    </g>
    <path class="fds-garland" d="M4 42Q52 54 100 42"/>
    <g class="fds-bunting">${[14, 26, 38, 50, 62, 74, 86]
      .map((x, i) => {
        const t = (x - 4) / 96;
        const y = 42 + 24 * t * (1 - t);
        return `<path class="fds-pennant ${"abc"[i % 3]}" d="M${x - 3} ${y.toFixed(1)}h6l-3 5Z"/>`;
      })
      .join("")}</g>`,
  // A day off (Workday): the house, a hammock between two trees, "z z".
  day_off: (n, uid) =>
    `${fdSky(n, 40, 16, uid)}${fdHills()}
    <g transform="translate(18 50)"><rect class="fds-wall" width="40" height="30"/><path class="fds-roof" d="M-4 1L20 -14L44 1Z"/>${fdWin(6, 8, 8, 8)}${fdWin(26, 8, 8, 8)}<rect class="fds-door" x="16" y="16" width="8" height="14"/></g>
    ${fdTree(112, 1.6)}${fdTree(182, 1.6)}
    <path class="fds-rope" d="M113 62L122 67M181 62L172 67"/>
    <path class="fds-hammock" d="M120 66Q147 84 174 66Q147 77 120 66Z"/>
    <ellipse class="fds-pillow" cx="128" cy="68.6" rx="4.4" ry="2.2"/>
    <g class="fds-z"><text class="z1" x="146" y="60">z</text><text class="z2" x="155" y="52">z</text></g>`,
  // Not known yet (loading): the hills alone.
  unknown: (n, uid) => `${fdSky(n, 100, 18, uid)}${fdHills()}${fdTree(130, 1.4)}${fdTree(170, 1.1)}`,
};

// The banner's picture for a kind of day. `uid` keeps the ids of each card apart on a page with several cards.
export const fdSceneSvg = (kind, night, uid) => {
  const draw = FD_SCENES[kind] || FD_SCENES.unknown;
  return `<svg class="fd-scene" viewBox="0 0 200 80" preserveAspectRatio="xMaxYMax meet" aria-hidden="true" focusable="false">
    <defs><radialGradient id="fd-glow-${uid}"><stop offset="0" stop-color="${night ? "#f3eed2" : "#ffd65a"}" stop-opacity=".45"/><stop offset="1" stop-color="${night ? "#f3eed2" : "#ffd65a"}" stop-opacity="0"/></radialGradient></defs>
    ${draw(night, uid)}
  </svg><div class="fd-ground g-${GROUND[kind] || "lawn"}"></div>`;
};

export const SCENE_STYLE = `
  .banner { position: relative; overflow: hidden; height: 90px; color: #0d2a45;
            background: linear-gradient(90deg, #f1f8ff 0%, #e2f1fd 34%, #b9def8 70%, #9fd0f3 100%); }
  .banner.night { color: #fff; background: linear-gradient(90deg, #1b2f52 0%, #15284a 36%, #0f1f3d 72%, #0a1830 100%); }
  .fd-scene { position: absolute; right: 0; bottom: 10px; height: 80px; width: min(200px, 56%); overflow: hidden; }
  .fd-ground { position: absolute; left: 0; right: 0; bottom: 0; height: 10px; }
  .g-lawn { background: repeating-linear-gradient(90deg, #5aa83d 0 22px, #6cbb4c 22px 44px); }
  .night .g-lawn { background: repeating-linear-gradient(90deg, #1f4a2a 0 22px, #245433 22px 44px); }
  .g-sand { background: #f0d9a6 radial-gradient(#d9b979 .8px, transparent 1px) 0 0 / 7px 5px; box-shadow: inset 0 2px 0 #f8e8c4; }
  .night .g-sand { background-color: #4a3f2c; background-image: radial-gradient(#5c4f38 .8px, transparent 1px); box-shadow: inset 0 2px 0 #5a4d36; }
  /* The round icon, the title and the subtitle on the sky at the left. */
  .htext { position: absolute; left: 12px; top: 6px; bottom: 12px; right: calc(min(200px, 56%) + 4px);
           display: flex; align-items: center; gap: 10px; min-width: 0; }
  .htext .titles { display: flex; flex-direction: column; gap: 2px; }
  /* Up to two lines each, so a long title or answer is not cut short next to the scene. */
  .banner .name { font-weight: 500; white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; }
  .banner .sub { color: #3b5b78; white-space: normal; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden; line-height: 1.3; }
  .banner.night .sub { color: rgba(255,255,255,.78); }
  /* The icon's colour is the colour of tomorrow's kind of day (grey while not known). */
  .banner .badge { position: relative; color: var(--c); background: rgba(255,255,255,.62); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--c) 22%, transparent); }
  .banner .badge .icon { fill: currentColor; }
  .banner.night .badge { color: color-mix(in srgb, var(--c) 55%, #fff); background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.14); }
  .banner .chip { background: color-mix(in srgb, var(--c) 18%, rgba(255,255,255,.78)); color: color-mix(in srgb, var(--c) 45%, #0d2a45); }
  .banner.night .chip { background: color-mix(in srgb, var(--c) 30%, rgba(8,18,38,.55)); color: color-mix(in srgb, var(--c) 35%, #ffffff); }
  .banner .zoom { color: #33506b; background: rgba(255,255,255,.55); box-shadow: inset 0 0 0 1px rgba(255,255,255,.7);
                  -webkit-backdrop-filter: blur(4px); backdrop-filter: blur(4px); }
  .banner.night .zoom { color: #fff; background: rgba(255,255,255,.12); box-shadow: inset 0 0 0 1px rgba(255,255,255,.2); }
  .banner .zoom:hover { background: rgba(255,255,255,.75); color: #33506b; }
  .banner.night .zoom:hover { background: rgba(255,255,255,.22); color: #fff; }
  /* Narrow card: a smaller scene, then the sky alone. */
  .compact .fd-scene { width: min(176px, 46%); } .compact .htext { right: calc(min(176px, 46%) + 4px); }
  .compact .banner .name { font-size: 15px; line-height: 1.2; }
  @container fd-card (max-width: 300px) { .fd-scene, .compact .fd-scene { width: 38%; } .htext, .compact .htext { right: calc(38% + 4px); } }
  /* The mini card's answer and its pill take more of a narrow banner: a smaller scene. */
  @container fd-card (max-width: 280px) { .compact .fd-scene { width: 30%; } .compact .htext { right: calc(30% + 4px); } }
  @container fd-card (max-width: 250px) { .compact .fd-scene { width: 25%; } .compact .htext { right: calc(25% + 2px); } }
  @container fd-card (max-width: 230px) { .fd-scene, .compact .fd-scene { display: none; } .htext, .compact .htext { right: 8px; }
    .compact .banner .name { font-size: 13px; line-height: 1.2; -webkit-line-clamp: 3; overflow-wrap: normal; }
    .compact .banner .sub { -webkit-line-clamp: 1; } .banner:has(.zoom) .htext { right: 36px; } }
  /* Scene colours, day and night. */
  .fds-sun { fill: #ffd65a; } .fds-moon { fill: #f3eed2; } .fds-star { fill: #fff; opacity: .85; }
  .fds-cloud { fill: #fff; opacity: .92; }
  .fds-hill { fill: #86c27f; } .fds-hill.far { fill: #a7d39f; }
  .night .fds-hill { fill: #17303d; } .night .fds-hill.far { fill: #1d3a4a; }
  .fds-trunk { fill: #6b4a2a; } .fds-leaves { fill: #5aa83d; } .night .fds-leaves { fill: #1a3a2a; } .night .fds-trunk { fill: #4a3422; }
  .fds-wall { fill: #faeeda; } .night .fds-wall { fill: #2a3646; }
  .fds-roof { fill: #d85a30; } .night .fds-roof { fill: #5a3030; }
  .fds-win { fill: #86b9de; } .night .fds-win { fill: #ffcf6e; filter: drop-shadow(0 0 1.4px #ffb347); }
  .fds-door { fill: #854f0b; } .night .fds-door { fill: #5a3a14; }
  .fds-clock { fill: #fff; stroke: #5f5e5a; stroke-width: .8; } .night .fds-clock { fill: #fff6dc; }
  .fds-hand { stroke: #5f5e5a; stroke-width: .7; fill: none; stroke-linecap: round; }
  .fds-pole { fill: #5f5e5a; stroke: #5f5e5a; stroke-width: 1; } .night .fds-pole { fill: #8a939c; stroke: #8a939c; }
  .fds-flag { fill: var(--fd-school); }
  .fds-bus-body { fill: #f5b400; } .night .fds-bus-body { fill: #c99200; }
  .fds-glass { fill: #cfe6f7; } .night .fds-glass { fill: #ffe9a8; }
  .fds-bus-band, .fds-wheel { fill: #22262b; }
  .fds-light { fill: #fff2c2; } .night .fds-light { fill: #fffbe6; filter: drop-shadow(0 0 1.6px #fff3b0); }
  .fds-frame { stroke: #5f6b7a; stroke-width: 1.6; fill: none; } .night .fds-frame { stroke: #7d8793; }
  .fds-rope { stroke: #8a939c; stroke-width: .8; fill: none; } .night .fds-rope { stroke: #7d8793; }
  .fds-seat.a { fill: #d85a30; } .fds-seat.b { fill: #2f80ed; }
  .fds-ball { fill: #e5484d; }
  .fds-sea { fill: #4fb3e8; } .night .fds-sea { fill: #173a5e; }
  .fds-wave { stroke: #b5e2fa; stroke-width: 1.2; fill: none; } .night .fds-wave { stroke: #2b5a86; }
  .fds-sand { fill: #f0d9a6; } .night .fds-sand { fill: #4a3f2c; }
  .fds-stick { stroke: #8a5a3a; stroke-width: 1.4; } .fds-parasol { fill: #e5484d; } .fds-parasol-band { fill: #fff; opacity: .9; }
  .night .fds-parasol { fill: #9c3034; } .night .fds-parasol-band { opacity: .5; }
  .fds-towel { fill: #2f80ed; } .night .fds-towel { fill: #24508f; }
  .fds-palm { stroke: #8a5a3a; stroke-width: 2; fill: none; } .fds-fronds { fill: #3b8a3b; } .night .fds-fronds { fill: #1f4a2a; }
  .fds-column { fill: #e7d6b8; } .night .fds-column { fill: #3a4656; }
  .fds-garland { stroke: #8a939c; stroke-width: .6; fill: none; }
  .fds-pennant.a { fill: var(--fd-school); } .fds-pennant.b { fill: #fff; stroke: #cfd6dd; stroke-width: .3; } .fds-pennant.c { fill: #e5484d; }
  .night .fds-pennant.b { fill: #e3e8ee; stroke: none; }
  .fds-burst path { stroke-width: 1.2; stroke-linecap: round; }
  .fds-burst.a path { stroke: var(--fd-public); } .fds-burst.b path { stroke: var(--fd-holidays); } .fds-burst.c path { stroke: #e5484d; }
  .night .fds-burst.a path { stroke: #c9a7ff; } .night .fds-burst.b path { stroke: #ffd27a; } .night .fds-burst.c path { stroke: #ff8a8e; }
  .fds-hammock { fill: var(--fd-off); } .night .fds-hammock { fill: #0e6a60; }
  .fds-pillow { fill: #fff; } .night .fds-pillow { fill: #c9d3df; }
  .fds-z { fill: #3b5b78; font: 700 11px sans-serif; } .night .fds-z { fill: #cfe0ff; }
  /* Animations: drifting clouds, twinkling stars, the bus driving up, the flag, the swings, the waves, the
     fireworks, "z z" rising. Still under prefers-reduced-motion (see BASE_STYLE). */
  .fd-scene g, .fd-scene path, .fd-scene text { transform-box: fill-box; }
  .fds-cloud { animation: fds-drift 6s ease-in-out infinite alternate; } .fds-cloud.c2 { animation-duration: 8s; }
  .fds-star.tw { animation: fds-twinkle 3.2s ease-in-out infinite alternate; }
  .fds-bus { animation: fds-drive 8s linear infinite; }
  .fds-flag, .fds-pennant { transform-origin: 0 50%; animation: fds-flutter 1.6s ease-in-out infinite; }
  .fds-bunting .fds-pennant { transform-origin: 50% 0; }
  .fds-swing { transform-origin: 50% 0; animation: fds-swing 2.2s ease-in-out infinite; }
  .fds-swing.b { animation-direction: reverse; }
  .fds-wave { animation: fds-wave 3s ease-in-out infinite; } .fds-wave.w2 { animation-delay: -1.5s; }
  .fds-parasol, .fds-parasol-band { transform-origin: 50% 100%; animation: fds-sway 4s ease-in-out infinite; }
  .fds-fronds { transform-origin: 50% 100%; animation: fds-sway 3s ease-in-out infinite; }
  .fds-burst > g { transform-origin: 50% 50%; animation: fds-burst 2.4s ease-out infinite; opacity: 0; }
  .fds-burst.d0 > g { animation-delay: -1.2s; } .fds-burst.d1 > g { animation-delay: -.4s; } .fds-burst.d2 > g { animation-delay: -2s; }
  .fds-hammock { transform-origin: 50% 0; animation: fds-rock 4s ease-in-out infinite; }
  .fds-z text { opacity: 0; animation: fds-z 3s ease-out infinite; } .fds-z .z2 { animation-delay: -1.5s; font-size: 8px; }
  @keyframes fds-drift { to { transform: translateX(5px); } }
  @keyframes fds-twinkle { from { opacity: .3; } to { opacity: 1; } }
  /* The bus waits at the school (the first frame, kept by still screenshots), leaves, then drives up again. */
  @keyframes fds-drive { 0%, 30% { transform: translateX(14px); opacity: 1; } 38% { transform: translateX(14px); opacity: 0; } 39% { transform: translateX(-70px); opacity: 0; }
    48% { opacity: 1; } 85%, 100% { transform: translateX(14px); opacity: 1; animation-timing-function: ease-out; } }
  @keyframes fds-flutter { 0%, 100% { transform: scaleX(1); } 50% { transform: scaleX(.8) skewY(4deg); } }
  @keyframes fds-swing { 0%, 100% { transform: rotate(-14deg); } 50% { transform: rotate(14deg); } }
  @keyframes fds-wave { 50% { transform: translateX(-6px); } }
  @keyframes fds-sway { 0%, 100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
  @keyframes fds-burst { 0% { transform: scale(.2); opacity: 0; } 10% { opacity: 1; } 60% { transform: scale(1); opacity: .9; } 100% { transform: scale(1.15); opacity: 0; } }
  @keyframes fds-rock { 0%, 100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
  @keyframes fds-z { 0% { transform: translate(0, 3px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translate(3px, -6px); opacity: 0; } }
`;
