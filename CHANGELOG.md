# Changelog

## 1.5.1 - 2026-11-22

### Performance
- Card picker: the cards no longer ask Home Assistant for a live preview (`preview: false` in `window.customCards`). The picker drew every card at once (history requests, animations), which made the list slow to open; it now shows each card's description instead.

## 1.5.0 - 2026-11-20

### Features
- Visual editor: the `ignore` pattern (school holidays events that are not pupils' holidays) is a text field under the school holidays calendar, showing its default; left as is it stays out of the YAML, cleared it counts every event. In the 22 languages.

### Fixes
- School holidays discovery: a calendar is no longer taken for the school holidays because its id or name merely contains "lov" (a `lovelace` or `glove` calendar); the Swedish *lov* (sportlov, höstlov…) still counts at the end of a word.
- README: `show_today` is marked for both cards — the mini card's detailed view shows it too.

### Performance
- The Workday answers of the days gone by are dropped from the shared cache instead of piling up, one per sensor and day, until the page is reloaded.

## 1.4.1 - 2026-11-18

### Fixes
- Illustrated header: `auto` now follows the Home Assistant theme alone — a light theme keeps the day picture after sunset, a dark theme still shows the night one.

## 1.4.0 - 2026-11-17

### Features
- **Animated illustrated header** on the full and mini cards (`illustration`, on by default): a 90 px banner with the title and subtitle on the sky at the left and a scene of tomorrow at the right, over a 10 px ground strip — the school with its clock, flag and school bus (school day), the park and its swings (weekend), the sea and beach on a sand strip (school holidays), the town hall with flags, bunting and fireworks (public holiday), a hammock by the house (day off). The round icon (`mdi:school`) takes the colour of tomorrow's kind of day (grey while not known). Night picture after sunset or with a dark theme, forced with `illustration_theme: day | night`; still under *reduce motion*. `illustration: false` keeps the classic header with its status pill. Both options are in the visual editors.
- Tomorrow's status pill on every header, the illustrated one and the mini card included: right after the title, in the round icon's colour; it stays beside the title only when the whole title and its whole label fit there (measured, in every language), else it takes a line of its own under the subtitle (the subtitle then on one line), and only its dot stays when its label does not fit there or above the ground strip (at the end of the subtitle on the narrowest mini card), and on cards of 200 px or less. The mini card's detail button is a 24 px round glass button in the top right corner of the header.
- Night picture with the dark theme even while the sun is up.

## 1.3.0 - 2026-11-15

### Features
- **Split the whole card into Today and Tomorrow** (`show_today`, off by default, in the visual editor too): the full card can show two symmetrical sections — **Today** and **Tomorrow** — each with its short date, its own picture, its *school / no school* answer and status pill, and its chips (the bins to put out tonight under **Today**, birthdays and name days on their own day). **Tomorrow** keeps the children's first lessons, and the school-holidays and public-holiday lines stay at the bottom ([#11](https://github.com/juju35/ha-family-day-card/issues/11), suggested by @mielikki33).

## 1.2.0 - 2026-11-15

### Features
- **Separate today and tomorrow** (`extras`, in the visual editor too): the full card now splits the chips (bins, birthdays, name days) into labelled **Today** and **Tomorrow** groups, so the two days no longer mix under the answer about tomorrow. `extras: today` or `extras: tomorrow` keeps only one day (`both` by default); the mini card keeps its chips in one row with a *· tomorrow* cue ([#8](https://github.com/juju35/ha-family-day-card/issues/8), suggested by @mielikki33).

## 1.1.2 - 2026-11-14

### Fixes
- The weekend picture: the sun's rays turned around the corner of each ray in Safari and the iOS app, and flew around the card; they turn around the sun again.
- Name day: tomorrow's name day is shown next to today's (**St Sidoine**, **St Albert · tomorrow**), so that today's is no longer read as tomorrow's under the answer about tomorrow.

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
