# Changelog

## 1.1.1 - 2026-11-14

### Fixes
- Name day chip: it shows the name day to wish of the traditional French calendar again (**St Gaston** on February 6, **Ste Sophie** on May 25), not the first liturgical saint of the day. data.gouv.fr's data set lists the liturgical saints, where 135 name days of 366 are missing; its saints of the day stay in the chip's tooltip.

## 1.1.0 - 2026-11-14

### Features
- **Bins, birthdays and name day** ([#2](https://github.com/juju35/ha-family-day-card/issues/2), suggested by @mielikki33): chips under the answer (under the header on the mini card) for tomorrow's bin collections (**Recycling tonight**, in the colour of the bin, from Waste Collection Schedule or any calendar named after the bins), today's and tomorrow's birthdays from a birthday calendar (**Emma · 9 years**, **Lucas · tomorrow**, the age from a birth year in the event) and today's saints from data.gouv.fr's open data set (**St Albert le Grand**, every saint of the day in its tooltip, on by default in French). New options `waste`, `birthdays`, `show_waste`, `show_birthdays` and `show_saint`, also in the visual editors.

## 1.0.0 - 2026-11-14

### Features
- **Family Day Card** (`custom:family-day-card`): is there school tomorrow? The header gives tomorrow's date and a status pill (School, Weekend, Public holiday, Holidays, Day off); the answer below reads **School at 8:00 AM** (the earliest first lesson of the children) or **No school — <reason>**, next to an animated picture of the day that swaps when tomorrow changes kind; one row per child with the time and subject of the first lesson (Pronote); a footer with the current school holidays (progress bar and day back at school) or the next ones (countdown), and the next public holiday.
- **Family Day Mini Card** (`custom:family-day-mini-card`): one line for tomorrow (**Tomorrow: school 8:00 AM** / **No school tomorrow**) with the holidays countdown and the pill, and a detail button that unfolds the full card, folded back by a click elsewhere or when the card leaves the page.
- Sources, all optional and discovered through the Home Assistant registries: **Workday** (working days, `workday.check_date` for tomorrow, or its state with `days_offset: 1`), a **school holidays calendar** (the French education ministry's ICS in Remote calendar, teachers' pre-term day ignored), the **Holiday** integration's calendar and the **Pronote** timetables of each child (`children` in YAML to choose them).
- Visual editor for both cards (the mini card's offers the full card's options too), Sections view sizes, light and dark themes, `prefers-reduced-motion`, 22 languages (English in the bundle, the others loaded on demand).
