// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

export const BASE_STYLE = `
  :host { --fd-accent: #d81b60; --fd-school: #1e88e5; --fd-weekend: var(--success-color, #43a047); --fd-holidays: #fb8c00;
          --fd-public: #5e35b1; --fd-off: #00897b; --fd-idle: var(--disabled-text-color, #9e9e9e); --fd-warn: var(--warning-color, #ffa600); }
  ha-card { overflow: hidden; container: fd-card / inline-size; }
  /* A size container has no width of its own: this zero-height grid gives the card a natural width without a minimum. */
  :host { display: block; min-width: 0; --fd-natural-width: 380px; }
  :host::before { content: ""; display: grid; grid-template-columns: minmax(0, var(--fd-natural-width)); height: 0; }
  .icon { width: 18px; height: 18px; fill: currentColor; flex: none; }
  .clickable { cursor: pointer; }
  [role="button"]:focus-visible { outline: 2px solid var(--primary-color, var(--fd-accent)); outline-offset: 2px; border-radius: 6px; }
  @media (prefers-reduced-motion: reduce) { *, *::before, *::after { transition: none !important; animation: none !important; } }
  .k-school { --c: var(--fd-school); } .k-weekend { --c: var(--fd-weekend); } .k-holidays { --c: var(--fd-holidays); }
  .k-public_holiday { --c: var(--fd-public); } .k-day_off { --c: var(--fd-off); } .k-unknown { --c: var(--fd-idle); }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--c); flex: none; display: inline-block; }
  .chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px; border-radius: 12px; font-size: 11px; font-weight: 500; white-space: nowrap;
          background: color-mix(in srgb, var(--c) 15%, transparent); color: color-mix(in srgb, var(--c) 50%, var(--primary-text-color));
          flex: 0 1 auto; min-width: 0; max-width: 50%; overflow: hidden; box-sizing: border-box; transition: background-color .4s ease, color .4s ease; }
  .chip-text { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  /* Chips of the bins, birthdays and name day: under the answer (full card), under the header (mini card). */
  .extras { display: flex; flex-wrap: wrap; gap: 6px; margin: -2px 0 8px 52px; min-width: 0; }
  .extras.mini { margin: 8px 0 0 62px; padding-right: 12px; }
  /* Today / tomorrow groups (full card): the day indent moves to the wrapper, each group gets a small label. */
  .xgroups { display: flex; flex-direction: column; gap: 8px; margin: -2px 0 8px 52px; min-width: 0; }
  .xgroups .extras { margin: 0; }
  .xgroup { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
  .xday { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--secondary-text-color); }
  .xchip { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px 2px 6px; border-radius: 12px; font-size: 12px; font-weight: 500;
           max-width: 100%; min-width: 0; box-sizing: border-box;
           background: color-mix(in srgb, var(--c) 15%, transparent); color: color-mix(in srgb, var(--c) 45%, var(--primary-text-color)); }
  .xchip .icon { width: 14px; height: 14px; color: color-mix(in srgb, var(--c) 75%, var(--primary-text-color)); }
  .xchip > span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .x-birthday { --c: var(--fd-accent); } .x-saint { --c: #7e57c2; } .w-default { --c: var(--fd-holidays); }
  .w-yellow { --c: #f9a825; } .w-blue { --c: #1e88e5; } .w-brown { --c: #8d6e63; } .w-green { --c: #43a047; } .w-gray { --c: #78909c; }
  .bar { height: 6px; border-radius: 3px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
  .bar > div { height: 100%; border-radius: 3px; background: var(--c); transition: width .8s ease; }
  /* Title row: badge, titles, status pill (aligned on the title line) and the mini card's detail button. */
  .header { display: flex; align-items: center; gap: 10px; padding: 12px 12px 0; }
  .header { position: relative; }
  .header:has(> .zoom) { padding-right: 34px; }
  .titles { flex: 1 1 0; min-width: 5ch; }
  /* The title line: the title, then the status pill when the whole title (on one line) and the pill's whole label fit
     there (measured, see _fitPill). Otherwise the pill takes a line of its own under the subtitle (its copy in
     .pill-line), the subtitle on one line and the mini card's answer tighter; when that does not fit in the banner
     above the ground, or on a card of 200 px or less, only its dot stays. */
  .title-row { display: flex; align-items: center; gap: 8px; min-width: 0; }
  .title-row > .name { flex: 0 1 auto; min-width: 0; }
  .title-row > .chip { flex: none; max-width: none; }
  .pill-line { display: none; }
  .titles.below .title-row > .chip { display: none; }
  .titles.below .pill-line { display: flex; min-width: 0; margin-top: 2px; }
  .pill-line > .chip { max-width: 100%; }
  .banner .htext .titles.below .sub { -webkit-line-clamp: 1; }
  .compact .banner .htext .titles.below .name { font-size: 14px; line-height: 1.15; }
  .titles.dot-only .chip { padding: 4px; } .titles.dot-only .chip-text { display: none; }
  /* Still no room under the lines (a long answer on the narrowest mini card): the answer one line shorter (whole in
     its tooltip). */
  .banner .htext .titles.tight .name { -webkit-line-clamp: 2; }
  @container fd-card (max-width: 200px) { .titles .chip { padding: 4px; } .titles .chip-text { display: none; } }
  :host([hide-title]) .title-row > .name:not(.answer), :host([hide-subtitle]) .titles > .sub:not(.countdown) { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub.wrap { white-space: normal; }
  .badge { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: 50%;
           background: color-mix(in srgb, var(--fd-accent) 16%, transparent); }
  .badge .icon { width: 24px; height: 24px; fill: var(--fd-accent); }
  .warning { padding: 16px; color: color-mix(in srgb, var(--fd-warn) 50%, var(--primary-text-color)); }
  /* The mini card's detail button: 24 px round, in the top right corner. */
  .zoom { all: unset; position: absolute; z-index: 2; top: 5px; right: 5px; cursor: pointer; width: 24px; height: 24px; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color); box-sizing: border-box;
          box-shadow: inset 0 0 0 1px var(--divider-color, rgba(127,127,127,.3)); }
  .zoom .icon { width: 16px; height: 16px; }
  .zoom:hover { background: color-mix(in srgb, var(--fd-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom[aria-pressed="true"] { color: var(--fd-accent); border-color: color-mix(in srgb, var(--fd-accent) 45%, transparent); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--fd-accent)); outline-offset: 1px; }
  @container fd-card (max-width: 300px) {
    .extras { margin-left: 0; }
    .extras.mini { margin-left: 12px; }
    .xgroups { margin-left: 0; }
  }
  @container fd-card (max-width: 230px) {
    .header { gap: 6px; }
  }
`;

export const ART_STYLE = `
  .art-svg { width: 100%; height: 100%; overflow: visible; fill: color-mix(in srgb, var(--c) 70%, var(--primary-text-color)); }
  .art-svg g, .art-svg path, .art-svg rect, .art-svg circle, .art-svg text { transform-box: fill-box; }
  @keyframes fd-swing { 0%, 100% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } }
  @keyframes fd-hop { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-1.2px); } }
  @keyframes fd-spin { to { transform: rotate(360deg); } }
  @keyframes fd-pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } }
  @keyframes fd-sway { 0%, 100% { transform: rotate(-5deg); } 50% { transform: rotate(5deg); } }
  @keyframes fd-wave { to { transform: translateX(-8px); } }
  @keyframes fd-pop { 0% { transform: translate(0, 0) scale(.3); opacity: 0; } 20% { opacity: 1; } 100% { transform: translate(var(--dx), var(--dy)) scale(1); opacity: 0; } }
  @keyframes fd-tilt { 0%, 100% { transform: rotate(0); } 20% { transform: rotate(-8deg); } 40% { transform: rotate(4deg); } }
  @keyframes fd-z { 0% { transform: translate(0, 2px); opacity: 0; } 30% { opacity: 1; } 100% { transform: translate(2px, -3px); opacity: 0; } }
  .a-bag { transform-origin: 50% 0; animation: fd-swing 2.4s ease-in-out infinite; }
  .a-bag path { animation: fd-hop 1.2s ease-in-out infinite; }
  .a-sun .rays { transform-origin: center; animation: fd-spin 12s linear infinite; transform-box: view-box; }
  /* The rays turn around the sun's centre: their own rotate(… 12 12) is in the drawing's coordinates, not their box's. */
  .a-sun .rays rect { transform-box: view-box; }
  .a-sun .core { transform-origin: center; animation: fd-pulse 3s ease-in-out infinite; }
  .a-beach .umbrella { transform-origin: 50% 100%; animation: fd-sway 3s ease-in-out infinite; }
  .a-beach .wave { fill: color-mix(in srgb, var(--fd-school) 60%, var(--primary-text-color)); opacity: .7; animation: fd-wave 1.5s linear infinite; }
  .a-party .popper { transform-origin: 0% 100%; animation: fd-tilt 1.5s ease-in-out infinite; }
  .a-party .confetti { opacity: 0; transform-origin: center; animation: fd-pop 1.5s ease-out infinite; }
  .a-party .c1 { fill: var(--fd-holidays); } .a-party .c2 { fill: var(--fd-school); } .a-party .c3 { fill: var(--fd-weekend); }
  .a-party .d0 { --dx: -2px; --dy: -2px; } .a-party .d1 { --dx: 1px; --dy: -3px; animation-delay: -.3s; } .a-party .d2 { --dx: 2px; --dy: -2px; animation-delay: -.6s; }
  .a-party .d3 { --dx: 3px; --dy: 1px; animation-delay: -.9s; } .a-party .d4 { --dx: 0; --dy: -3px; animation-delay: -1.2s; }
  .a-sofa .z { font: 700 5px sans-serif; opacity: 0; animation: fd-z 3s ease-out infinite; }
  .a-sofa .z2 { animation-delay: -1.5s; font-size: 4px; }
`;


export const FULL_STYLE = `
  .content { padding: 4px 12px 12px; display: flex; flex-direction: column; }
  /* The answer: tomorrow's picture and "School at 8:00" / "No school — Weekend". */
  .headline { display: flex; align-items: center; gap: 12px; padding: 12px 2px 10px; min-width: 0; }
  .headline .art { position: relative; display: grid; flex: none; width: 40px; height: 40px; }
  .headline .glyph { grid-area: 1 / 1; width: 100%; height: 100%; }
  .headline .answer { font-size: 20px; font-weight: 500; line-height: 1.2; min-width: 0; overflow-wrap: anywhere;
                      color: color-mix(in srgb, var(--c) 40%, var(--primary-text-color)); transition: color .4s ease; }
  /* A day changing kind: the old picture leaves, the new one comes in with a little bounce (see _glyph). */
  @keyframes fd-in-a { 0% { transform: scale(.2) rotate(-35deg); opacity: 0; } 60% { transform: scale(1.15) rotate(6deg); opacity: 1; } 100% { transform: none; opacity: 1; } }
  @keyframes fd-in-b { 0% { transform: scale(.2) rotate(-35deg); opacity: 0; } 60% { transform: scale(1.15) rotate(6deg); opacity: 1; } 100% { transform: none; opacity: 1; } }
  @keyframes fd-out { from { transform: none; opacity: 1; } to { transform: scale(.3) rotate(35deg) translateY(30%); opacity: 0; } }
  .glyph.swap-a { animation: fd-in-a .7s cubic-bezier(.3,1.4,.5,1) both; }
  .glyph.swap-b { animation: fd-in-b .7s cubic-bezier(.3,1.4,.5,1) both; }
  .glyph.ghost { animation: fd-out .45s ease-in both; pointer-events: none; }
  /* One row per child: name, first lesson time · subject. */
  .kids { display: flex; flex-direction: column; gap: 2px; margin: 0 0 4px 52px; }
  .kid { display: flex; align-items: baseline; justify-content: space-between; gap: 12px; font-size: 14px; padding: 3px 0; min-width: 0; }
  .kid .who { font-weight: 500; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .kid .what { color: var(--secondary-text-color); min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: right; }
  .kid .what b { font-weight: 500; color: var(--primary-text-color); font-variant-numeric: tabular-nums; }
  /* Holidays and public holidays, after a hairline. */
  .footer { display: flex; flex-direction: column; gap: 8px; border-top: 1px solid var(--divider-color, rgba(127,127,127,.2)); margin-top: 6px; padding-top: 10px; }
  .line { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .line .top { display: flex; align-items: center; gap: 8px; font-size: 13px; min-width: 0; }
  .line .icon { width: 16px; height: 16px; color: color-mix(in srgb, var(--c) 70%, var(--primary-text-color)); }
  .line .txt { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .line .txt b { font-weight: 500; }
  .line .end { flex: none; font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; }
  .line .bar { margin-left: 24px; }
  .muted { color: var(--secondary-text-color); }
  @container fd-card (max-width: 300px) {
    .headline .answer { font-size: 16px; }
    .headline { gap: 10px; }
    .headline .art { width: 32px; height: 32px; }
    .kids { margin-left: 0; }
    .line .end { display: none; }
  }
`;

export const TWODAY_STYLE = `
  .content.twoday { padding-top: 0; }
  /* One day block, stacked: Today above Tomorrow, split by a hairline. */
  .daysec { padding: 11px 2px; display: flex; flex-direction: column; gap: 9px; }
  .daysec + .daysec { border-top: 1px solid var(--divider-color, rgba(127,127,127,.2)); }
  .dayhead { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .dayhead .art { position: relative; display: grid; flex: none; width: 40px; height: 40px; }
  .dayhead .glyph { grid-area: 1 / 1; width: 100%; height: 100%; }
  .daylabel { flex: 1 1 auto; min-width: 0; }
  .daylabel .lab { font-size: 11px; font-weight: 600; letter-spacing: .04em; text-transform: uppercase; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .daylabel .lab .date { text-transform: none; font-weight: 500; }
  .daylabel .ans { font-size: 17px; font-weight: 500; line-height: 1.2; overflow-wrap: anywhere;
                   color: color-mix(in srgb, var(--c) 40%, var(--primary-text-color)); transition: color .4s ease; }
  .daysec .indent { padding-left: 52px; display: flex; flex-direction: column; gap: 7px; min-width: 0; }
  .daysec .indent .extras { margin: 0; }
  .daysec .indent .kids { margin: 0; }
  @container fd-card (max-width: 300px) {
    .daysec .indent { padding-left: 0; }
    .dayhead { gap: 10px; }
    .dayhead .art { width: 32px; height: 32px; }
    .daylabel .ans { font-size: 15px; }
  }
  @container fd-card (max-width: 230px) {
    .daylabel .lab .date { display: none; }
  }
`;

export const MINI_STYLE = `
  :host { --fd-natural-width: 300px; }
  ha-card.compact { padding-bottom: 12px; }
  /* Illustrated: the banner ends the card, the chips (if any) sit under it. */
  ha-card.compact.ill { padding-bottom: 0; }
  .ill .extras.mini { margin-bottom: 10px; }
  /* The answer wraps rather than being cut: it is the whole point of the mini card. */
  .compact .name.answer { white-space: normal; overflow-wrap: break-word; }
  @container fd-card (max-width: 230px) {
    .compact .name.answer { font-size: 13px; }
    .compact .sub { font-size: 11px; }
  }
`;
