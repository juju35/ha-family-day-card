// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------
import { DEFAULT_IGNORE, WEEKDAYS } from "./kinds-day.js";
import { intlLocale, lang, t } from "./helpers.js";
import { fmtRel, upperFirst, weekdayName } from "./days.js";
import { sameDeps } from "./interaction-helpers.js";

export const LANGUAGES = [
  ["en", "English"],
  ["fr", "Français"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["nl", "Nederlands"],
  ["pt", "Português (Portugal)"],
  ["pl", "Polski"],
  ["sr", "Српски"],
  ["sr-Latn", "Srpski (latinica)"],
  ["ro", "Română"],
  ["da", "Dansk"],
  ["sv", "Svenska"],
  ["bg", "Български"],
  ["ru", "Русский"],
  ["uk", "Українська"],
  ["hu", "Magyar"],
  ["sk", "Slovenčina"],
  ["cs", "Čeština"],
  ["sl", "Slovenščina"],
  ["lv", "Latviešu"],
  ["el", "Ελληνικά"],
];

// Keeps the YAML minimal: drops empty values and options left at their default.
export const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (const [k, v] of Object.entries(config)) {
    if (v === "" || v === undefined || v === null || (Array.isArray(v) && !v.length && !(k in defaults)) || (k in defaults && JSON.stringify(v) === JSON.stringify(defaults[k]))) delete config[k];
  }
  return config;
};

// The editor shows the default `ignore` pattern: left as is it stays out of the YAML; cleared (the form sends "" or
// drops the key), it becomes "" — every school holidays event counts, as in YAML.
export const withIgnore = (config, ignore) => {
  const out = { ...config };
  delete out.ignore;
  const v = ignore ?? "";
  if (v !== DEFAULT_IGNORE) out.ignore = v;
  return out;
};

export class FamilyDayCardEditor extends HTMLElement {
  static get toggles() {
    return [
      ["illustration", true],
      ["show_title", true],
      ["show_subtitle", true],
      ["show_children", true],
      ["show_today", false],
      ["show_holidays", true],
      ["show_public_holidays", true],
      ["show_waste", true],
      ["show_birthdays", true],
      // On by default in French only: the name days are those of the French calendar.
      ["show_saint", (hass, config) => lang(hass, config) === "fr"],
    ];
  }

  setConfig(config) {
    this._config = { ...config };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _schema() {
    const tr = (k) => t(this._hass, this._config, k);
    const L = intlLocale(this._hass, this._config);
    return [
      { name: "title", selector: { text: {} } },
      { name: "workday", selector: { entity: { domain: "binary_sensor", integration: "workday" } } },
      { name: "school_holidays", selector: { entity: { domain: "calendar" } } },
      { name: "ignore", selector: { text: {} } },
      { name: "public_holidays", selector: { entity: { domain: "calendar" } } },
      { name: "waste", selector: { entity: { domain: "calendar", multiple: true } } },
      { name: "birthdays", selector: { entity: { domain: "calendar", multiple: true } } },
      {
        name: "school_days",
        selector: { select: { multiple: true, mode: "list", options: [...WEEKDAYS.slice(1), "sun"].map((value) => ({ value, label: upperFirst(weekdayName(value, L), L) })) } },
      },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      {
        name: "extras",
        selector: { select: { mode: "dropdown", options: [
          { value: "both", label: tr("extras_both") },
          { value: "today", label: upperFirst(fmtRel(0, L), L) },
          { value: "tomorrow", label: upperFirst(fmtRel(1, L), L) },
        ] } },
      },
      {
        name: "illustration_theme",
        selector: { select: { mode: "dropdown", options: [
          { value: "auto", label: tr("theme_auto") },
          { value: "day", label: tr("theme_day") },
          { value: "night", label: tr("theme_night") },
        ] } },
      },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  // The toggles' defaults for a config (a default may depend on the card's language), plus the select defaults.
  _defaults(config) {
    return { ...Object.fromEntries(this.constructor.toggles.map(([name, def]) => [name, typeof def === "function" ? def(this._hass, config) : def])), extras: "both", illustration_theme: "auto" };
  }

  _render() {
    if (!this._hass || !this._config) return;
    const toggles = this.constructor.toggles;
    const tr = (k) => t(this._hass, this._config, k);
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => tr(`opt_${s.name}`);
      this._form.computeHelper = (s) => (["workday", "school_holidays", "ignore", "public_holidays", "waste", "birthdays", "zoom", "school_days"].includes(s.name) ? tr(`help_${s.name}`) : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = withIgnore(cleanConfig(ev.detail.value, this._defaults(ev.detail.value)), ev.detail.value.ignore);
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { ...this._config };
    const defaults = this._defaults(this._config);
    for (const [name] of toggles) if (data[name] === undefined) data[name] = defaults[name];
    if (data.extras === undefined) data.extras = defaults.extras;
    if (data.illustration_theme === undefined) data.illustration_theme = defaults.illustration_theme;
    if (data.ignore === undefined) data.ignore = DEFAULT_IGNORE;
    this._form.hass = this._hass;
    if (!sameDeps(this._dataDeps, [this._config])) {
      this._dataDeps = [this._config];
      this._form.data = data;
    }
    const deps = [lang(this._hass, this._config)];
    if (!sameDeps(this._schemaDeps, deps)) {
      this._schemaDeps = deps;
      this._form.schema = this._schema();
    }
  }
}

// The options of the full card, which its detailed view shows, plus the countdown line and the detail button.
export class FamilyDayMiniCardEditor extends FamilyDayCardEditor {
  static get toggles() {
    return [...FamilyDayCardEditor.toggles, ["show_countdown", true], ["zoom", true]];
  }
}
