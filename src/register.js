// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------
import { pickerDefine } from "./card-picker.js";
import { VERSION } from "./core.js";
import { FamilyDayCard, FamilyDayMiniCard } from "./cards.js";
import { FamilyDayCardEditor, FamilyDayMiniCardEditor } from "./visual-editors.js";

export const define = (name, cls) => {
  if (!customElements.get(name)) pickerDefine(name, cls);
};
define("family-day-card", FamilyDayCard);
define("family-day-mini-card", FamilyDayMiniCard);
define("family-day-card-editor", FamilyDayCardEditor);
define("family-day-mini-card-editor", FamilyDayMiniCardEditor);

window.customCards = window.customCards || [];
for (const card of [
  {
    type: "family-day-card",
    name: "Family Day Card",
    description: "Is there school tomorrow? The first lesson of each child (Pronote), the school holidays countdown and the next public holiday.",
  },
  { type: "family-day-mini-card", name: "Family Day Mini Card", description: "One line for tomorrow (school at 8:00, weekend, holidays) and the school holidays countdown, with a detail button." },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) window.customCards.push({ ...card, preview: true, documentationURL: "https://github.com/juju35/ha-family-day-card" });
}

console.info(`%c FAMILY-DAY-CARD %c v${VERSION} `, "color: white; background: #d81b60; font-weight: 700;", "color: #d81b60; background: white; font-weight: 700;");
