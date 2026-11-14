/*
 * Family Day Card for Home Assistant
 * https://github.com/juju35/ha-family-day-card
 *
 * Lovelace cards that answer "is there school tomorrow?": school day, weekend, public holiday or school holidays,
 * with the first lesson of each child, the current or next school holidays with a countdown, and the next public
 * holiday. Every source is optional: the Workday integration
 * (https://www.home-assistant.io/integrations/workday/), a calendar of school holidays (the French education
 * ministry's ICS through Remote calendar), the Holiday integration's calendar
 * (https://www.home-assistant.io/integrations/holiday/) and the Pronote integration's timetables.
 */

const VERSION = "__VERSION__";

const STRINGS = {
  en: {
    title: "Tomorrow",
    school_day: "School day",
    kind_school: "School",
    kind_weekend: "Weekend",
    kind_public_holiday: "Public holiday",
    kind_holidays: "Holidays",
    kind_day_off: "Day off",
    kind_unknown: "Unknown",
    timetable_unknown: "Timetable not known yet",
    no_lessons: "No lessons",
    school_at: "School at {time}",
    no_school: "No school — {reason}",
    back_rel: "back {rel}",
    back_to_school: "Back to school {rel}",
    holidays_rel: "Holidays {rel}",
    day_of: "Day {n} of {total}",
    loading: "Loading…",
    no_source: "No source found. Set up the Workday or Holiday integration, a school holidays calendar or Pronote, or give the card its entities.",
    tomorrow_school_at: "Tomorrow: school {time}",
    tomorrow_school: "Tomorrow: school",
    tomorrow_no_school: "No school tomorrow",
    opt_title: "Title (optional)",
    opt_workday: "Workday sensor",
    opt_school_holidays: "School holidays calendar",
    opt_public_holidays: "Public holidays calendar",
    opt_school_days: "School days",
    opt_show_title: "Show title",
    opt_show_subtitle: "Show subtitle",
    opt_show_children: "Show children (Pronote)",
    opt_show_holidays: "Show school holidays",
    opt_show_public_holidays: "Show public holidays",
    opt_show_countdown: "Show holidays countdown",
    opt_language: "Language",
    opt_zoom: "Detail button",
    help_workday: "Binary sensor of the Workday integration (found automatically when left empty)",
    help_school_holidays: "Calendar of the school holidays, such as the French education ministry's ICS in Remote calendar (found automatically when left empty)",
    help_public_holidays: "Calendar of the Holiday integration (found automatically when left empty)",
    help_school_days: "Days with school (the days of the Workday sensor when left empty)",
    help_zoom: "Button at the top right that switches the mini card to the full card and back",
    lang_auto: "Automatic",
    zoom_in: "Show the full card",
    zoom_out: "Show the compact card",
    waste_tonight: "{type} tonight",
    waste_title: "Bin collection tomorrow",
    birthday_title: "Birthday",
    saint_title: "Name day",
    opt_show_waste: "Show bin collection",
    opt_show_birthdays: "Show birthdays",
    opt_show_saint: "Show name day (saint)",
    opt_waste: "Bin collection calendars",
    opt_birthdays: "Birthday calendars",
    help_waste: "Calendars of the bin collections, such as Waste Collection Schedule's (found automatically when left empty)",
    help_birthdays: "Calendars with one event per birthday, with the birth year for the age (found automatically when left empty)",
  },
  fr: {
    title: "Demain",
    school_day: "Jour d'école",
    kind_school: "École",
    kind_weekend: "Week-end",
    kind_public_holiday: "Jour férié",
    kind_holidays: "Vacances",
    kind_day_off: "Jour de repos",
    kind_unknown: "Inconnu",
    timetable_unknown: "Emploi du temps pas encore connu",
    no_lessons: "Pas de cours",
    school_at: "École à {time}",
    no_school: "Pas d'école — {reason}",
    back_rel: "retour {rel}",
    back_to_school: "Rentrée {rel}",
    holidays_rel: "Vacances {rel}",
    day_of: "Jour {n} sur {total}",
    loading: "Chargement…",
    no_source: "Aucune source trouvée. Configurez l'intégration Workday ou Holiday, un calendrier des vacances scolaires ou Pronote, ou indiquez ses entités à la carte.",
    tomorrow_school_at: "Demain : école à {time}",
    tomorrow_school: "Demain : école",
    tomorrow_no_school: "Pas d'école demain",
    opt_title: "Titre (facultatif)",
    opt_workday: "Capteur Workday",
    opt_school_holidays: "Calendrier des vacances scolaires",
    opt_public_holidays: "Calendrier des jours fériés",
    opt_school_days: "Jours d'école",
    opt_show_title: "Afficher le titre",
    opt_show_subtitle: "Afficher le sous-titre",
    opt_show_children: "Afficher les enfants (Pronote)",
    opt_show_holidays: "Afficher les vacances scolaires",
    opt_show_public_holidays: "Afficher les jours fériés",
    opt_show_countdown: "Afficher le compte à rebours des vacances",
    opt_language: "Langue",
    opt_zoom: "Bouton détail",
    help_workday: "Capteur binaire de l'intégration Workday (trouvé automatiquement si vide)",
    help_school_holidays: "Calendrier des vacances scolaires, comme l'ICS du ministère de l'Éducation nationale dans Remote calendar (trouvé automatiquement si vide)",
    help_public_holidays: "Calendrier de l'intégration Holiday (trouvé automatiquement si vide)",
    help_school_days: "Jours avec école (les jours du capteur Workday si vide)",
    help_zoom: "Bouton en haut à droite qui bascule la mini-carte vers la carte complète et inversement",
    lang_auto: "Automatique",
    zoom_in: "Afficher la carte complète",
    zoom_out: "Afficher la carte compacte",
    waste_tonight: "{type} ce soir",
    waste_title: "Collecte des déchets demain",
    birthday_title: "Anniversaire",
    saint_title: "Fête du jour",
    opt_show_waste: "Afficher la collecte des déchets",
    opt_show_birthdays: "Afficher les anniversaires",
    opt_show_saint: "Afficher la fête du jour (saint)",
    opt_waste: "Calendriers de collecte des déchets",
    opt_birthdays: "Calendriers des anniversaires",
    help_waste: "Calendriers de collecte des déchets, comme ceux de Waste Collection Schedule (trouvés automatiquement si vide)",
    help_birthdays: "Calendriers avec un événement par anniversaire, l’année de naissance pour l’âge (trouvés automatiquement si vide)",
  },
  de: {
    title: "Morgen",
    school_day: "Schultag",
    kind_school: "Schule",
    kind_weekend: "Wochenende",
    kind_public_holiday: "Feiertag",
    kind_holidays: "Ferien",
    kind_day_off: "Freier Tag",
    kind_unknown: "Unbekannt",
    timetable_unknown: "Stundenplan noch nicht bekannt",
    no_lessons: "Kein Unterricht",
    school_at: "Schule um {time}",
    no_school: "Keine Schule — {reason}",
    back_rel: "zurück {rel}",
    back_to_school: "Schulbeginn {rel}",
    holidays_rel: "Ferien {rel}",
    day_of: "Tag {n} von {total}",
    loading: "Wird geladen…",
    no_source: "Keine Quelle gefunden. Richte die Integration Workday oder Holiday, einen Schulferienkalender oder Pronote ein, oder gib der Karte ihre Entitäten an.",
    tomorrow_school_at: "Morgen: Schule um {time}",
    tomorrow_school: "Morgen: Schule",
    tomorrow_no_school: "Morgen keine Schule",
    opt_title: "Titel (optional)",
    opt_workday: "Workday-Sensor",
    opt_school_holidays: "Schulferienkalender",
    opt_public_holidays: "Feiertagskalender",
    opt_school_days: "Schultage",
    opt_show_title: "Titel anzeigen",
    opt_show_subtitle: "Untertitel anzeigen",
    opt_show_children: "Kinder anzeigen (Pronote)",
    opt_show_holidays: "Schulferien anzeigen",
    opt_show_public_holidays: "Feiertage anzeigen",
    opt_show_countdown: "Ferien-Countdown anzeigen",
    opt_language: "Sprache",
    opt_zoom: "Detail-Schaltfläche",
    help_workday: "Binärsensor der Workday-Integration (leer: automatisch gefunden)",
    help_school_holidays: "Kalender der Schulferien, z. B. die ICS-Datei des französischen Bildungsministeriums in Remote calendar (leer: automatisch gefunden)",
    help_public_holidays: "Kalender der Holiday-Integration (leer: automatisch gefunden)",
    help_school_days: "Tage mit Schule (leer: die Tage des Workday-Sensors)",
    help_zoom: "Schaltfläche oben rechts, die die Mini-Karte zur vollständigen Karte und zurück umschaltet",
    lang_auto: "Automatisch",
    zoom_in: "Vollständige Karte anzeigen",
    zoom_out: "Kompakte Karte anzeigen",
    waste_tonight: "{type} heute Abend",
    waste_title: "Müllabfuhr morgen",
    birthday_title: "Geburtstag",
    saint_title: "Namenstag",
    opt_show_waste: "Müllabfuhr anzeigen",
    opt_show_birthdays: "Geburtstage anzeigen",
    opt_show_saint: "Namenstag anzeigen (Heiliger)",
    opt_waste: "Kalender der Müllabfuhr",
    opt_birthdays: "Geburtstagskalender",
    help_waste: "Kalender der Müllabfuhr, z. B. von Waste Collection Schedule (automatisch gefunden, wenn leer)",
    help_birthdays: "Kalender mit einem Termin pro Geburtstag, mit dem Geburtsjahr für das Alter (automatisch gefunden, wenn leer)",
  },
  es: {
    title: "Mañana",
    school_day: "Día de colegio",
    kind_school: "Colegio",
    kind_weekend: "Fin de semana",
    kind_public_holiday: "Festivo",
    kind_holidays: "Vacaciones",
    kind_day_off: "Día libre",
    kind_unknown: "Desconocido",
    timetable_unknown: "Horario aún desconocido",
    no_lessons: "Sin clases",
    school_at: "Colegio a las {time}",
    no_school: "Sin colegio — {reason}",
    back_rel: "vuelta {rel}",
    back_to_school: "Vuelta al cole {rel}",
    holidays_rel: "Vacaciones {rel}",
    day_of: "Día {n} de {total}",
    loading: "Cargando…",
    no_source: "No se encontró ninguna fuente. Configura la integración Workday o Holiday, un calendario de vacaciones escolares o Pronote, o indica sus entidades a la tarjeta.",
    tomorrow_school_at: "Mañana: colegio a las {time}",
    tomorrow_school: "Mañana: colegio",
    tomorrow_no_school: "Mañana no hay colegio",
    opt_title: "Título (opcional)",
    opt_workday: "Sensor Workday",
    opt_school_holidays: "Calendario de vacaciones escolares",
    opt_public_holidays: "Calendario de festivos",
    opt_school_days: "Días de colegio",
    opt_show_title: "Mostrar título",
    opt_show_subtitle: "Mostrar subtítulo",
    opt_show_children: "Mostrar los hijos (Pronote)",
    opt_show_holidays: "Mostrar vacaciones escolares",
    opt_show_public_holidays: "Mostrar festivos",
    opt_show_countdown: "Mostrar cuenta atrás de vacaciones",
    opt_language: "Idioma",
    opt_zoom: "Botón de detalle",
    help_workday: "Sensor binario de la integración Workday (se encuentra automáticamente si está vacío)",
    help_school_holidays: "Calendario de vacaciones escolares, como el ICS del ministerio de Educación francés en Remote calendar (se encuentra automáticamente si está vacío)",
    help_public_holidays: "Calendario de la integración Holiday (se encuentra automáticamente si está vacío)",
    help_school_days: "Días con colegio (los días del sensor Workday si está vacío)",
    help_zoom: "Botón arriba a la derecha que cambia la minitarjeta a la tarjeta completa y viceversa",
    lang_auto: "Automático",
    zoom_in: "Mostrar la tarjeta completa",
    zoom_out: "Mostrar la tarjeta compacta",
    waste_tonight: "{type} esta noche",
    waste_title: "Recogida de basura mañana",
    birthday_title: "Cumpleaños",
    saint_title: "Santo del día",
    opt_show_waste: "Mostrar la recogida de basura",
    opt_show_birthdays: "Mostrar los cumpleaños",
    opt_show_saint: "Mostrar el santo del día",
    opt_waste: "Calendarios de recogida de basura",
    opt_birthdays: "Calendarios de cumpleaños",
    help_waste: "Calendarios de recogida de basura, como los de Waste Collection Schedule (se buscan solos si se deja vacío)",
    help_birthdays: "Calendarios con un evento por cumpleaños, con el año de nacimiento para la edad (se buscan solos si se deja vacío)",
  },
  it: {
    title: "Domani",
    school_day: "Giorno di scuola",
    kind_school: "Scuola",
    kind_weekend: "Fine settimana",
    kind_public_holiday: "Festivo",
    kind_holidays: "Vacanze",
    kind_day_off: "Giorno libero",
    kind_unknown: "Sconosciuto",
    timetable_unknown: "Orario non ancora noto",
    no_lessons: "Nessuna lezione",
    school_at: "Scuola alle {time}",
    no_school: "Niente scuola — {reason}",
    back_rel: "rientro {rel}",
    back_to_school: "Rientro a scuola {rel}",
    holidays_rel: "Vacanze {rel}",
    day_of: "Giorno {n} di {total}",
    loading: "Caricamento…",
    no_source: "Nessuna fonte trovata. Configura l'integrazione Workday o Holiday, un calendario delle vacanze scolastiche o Pronote, oppure indica le sue entità alla scheda.",
    tomorrow_school_at: "Domani: scuola alle {time}",
    tomorrow_school: "Domani: scuola",
    tomorrow_no_school: "Domani niente scuola",
    opt_title: "Titolo (facoltativo)",
    opt_workday: "Sensore Workday",
    opt_school_holidays: "Calendario delle vacanze scolastiche",
    opt_public_holidays: "Calendario dei festivi",
    opt_school_days: "Giorni di scuola",
    opt_show_title: "Mostra titolo",
    opt_show_subtitle: "Mostra sottotitolo",
    opt_show_children: "Mostra i figli (Pronote)",
    opt_show_holidays: "Mostra vacanze scolastiche",
    opt_show_public_holidays: "Mostra giorni festivi",
    opt_show_countdown: "Mostra conto alla rovescia delle vacanze",
    opt_language: "Lingua",
    opt_zoom: "Pulsante dettaglio",
    help_workday: "Sensore binario dell'integrazione Workday (trovato automaticamente se vuoto)",
    help_school_holidays: "Calendario delle vacanze scolastiche, come l'ICS del ministero dell'Istruzione francese in Remote calendar (trovato automaticamente se vuoto)",
    help_public_holidays: "Calendario dell'integrazione Holiday (trovato automaticamente se vuoto)",
    help_school_days: "Giorni con scuola (i giorni del sensore Workday se vuoto)",
    help_zoom: "Pulsante in alto a destra che passa dalla mini scheda alla scheda completa e viceversa",
    lang_auto: "Automatica",
    zoom_in: "Mostra la scheda completa",
    zoom_out: "Mostra la scheda compatta",
    waste_tonight: "{type} stasera",
    waste_title: "Raccolta rifiuti domani",
    birthday_title: "Compleanno",
    saint_title: "Onomastico",
    opt_show_waste: "Mostra la raccolta rifiuti",
    opt_show_birthdays: "Mostra i compleanni",
    opt_show_saint: "Mostra l’onomastico (santo)",
    opt_waste: "Calendari della raccolta rifiuti",
    opt_birthdays: "Calendari dei compleanni",
    help_waste: "Calendari della raccolta rifiuti, come quelli di Waste Collection Schedule (trovati da soli se vuoto)",
    help_birthdays: "Calendari con un evento per compleanno, con l’anno di nascita per l’età (trovati da soli se vuoto)",
  },
  nl: {
    title: "Morgen",
    school_day: "Schooldag",
    kind_school: "School",
    kind_weekend: "Weekend",
    kind_public_holiday: "Feestdag",
    kind_holidays: "Vakantie",
    kind_day_off: "Vrije dag",
    kind_unknown: "Onbekend",
    timetable_unknown: "Rooster nog niet bekend",
    no_lessons: "Geen lessen",
    school_at: "School om {time}",
    no_school: "Geen school — {reason}",
    back_rel: "terug {rel}",
    back_to_school: "Weer naar school {rel}",
    holidays_rel: "Vakantie {rel}",
    day_of: "Dag {n} van {total}",
    loading: "Laden…",
    no_source: "Geen bron gevonden. Stel de integratie Workday of Holiday, een schoolvakantiekalender of Pronote in, of geef de kaart haar entiteiten.",
    tomorrow_school_at: "Morgen: school om {time}",
    tomorrow_school: "Morgen: school",
    tomorrow_no_school: "Morgen geen school",
    opt_title: "Titel (optioneel)",
    opt_workday: "Workday-sensor",
    opt_school_holidays: "Schoolvakantiekalender",
    opt_public_holidays: "Feestdagenkalender",
    opt_school_days: "Schooldagen",
    opt_show_title: "Titel tonen",
    opt_show_subtitle: "Ondertitel tonen",
    opt_show_children: "Kinderen tonen (Pronote)",
    opt_show_holidays: "Schoolvakanties tonen",
    opt_show_public_holidays: "Feestdagen tonen",
    opt_show_countdown: "Aftellen naar de vakantie tonen",
    opt_language: "Taal",
    opt_zoom: "Detailknop",
    help_workday: "Binaire sensor van de Workday-integratie (leeg: automatisch gevonden)",
    help_school_holidays: "Kalender van de schoolvakanties, zoals de ICS van het Franse ministerie van Onderwijs in Remote calendar (leeg: automatisch gevonden)",
    help_public_holidays: "Kalender van de Holiday-integratie (leeg: automatisch gevonden)",
    help_school_days: "Dagen met school (leeg: de dagen van de Workday-sensor)",
    help_zoom: "Knop rechtsboven die de minikaart naar de volledige kaart en terug schakelt",
    lang_auto: "Automatisch",
    zoom_in: "Volledige kaart tonen",
    zoom_out: "Compacte kaart tonen",
    waste_tonight: "{type} vanavond",
    waste_title: "Afvalophaling morgen",
    birthday_title: "Verjaardag",
    saint_title: "Naamdag",
    opt_show_waste: "Afvalophaling tonen",
    opt_show_birthdays: "Verjaardagen tonen",
    opt_show_saint: "Naamdag tonen (heilige)",
    opt_waste: "Agenda’s van de afvalophaling",
    opt_birthdays: "Verjaardagsagenda’s",
    help_waste: "Agenda’s van de afvalophaling, zoals die van Waste Collection Schedule (automatisch gevonden als leeg)",
    help_birthdays: "Agenda’s met één afspraak per verjaardag, met het geboortejaar voor de leeftijd (automatisch gevonden als leeg)",
  },
  pt: {
    title: "Amanhã",
    school_day: "Dia de escola",
    kind_school: "Escola",
    kind_weekend: "Fim de semana",
    kind_public_holiday: "Feriado",
    kind_holidays: "Férias",
    kind_day_off: "Dia de folga",
    kind_unknown: "Desconhecido",
    timetable_unknown: "Horário ainda desconhecido",
    no_lessons: "Sem aulas",
    school_at: "Escola às {time}",
    no_school: "Sem escola — {reason}",
    back_rel: "regresso {rel}",
    back_to_school: "Regresso às aulas {rel}",
    holidays_rel: "Férias {rel}",
    day_of: "Dia {n} de {total}",
    loading: "A carregar…",
    no_source: "Nenhuma fonte encontrada. Configure a integração Workday ou Holiday, um calendário de férias escolares ou o Pronote, ou indique as suas entidades ao cartão.",
    tomorrow_school_at: "Amanhã: escola às {time}",
    tomorrow_school: "Amanhã: escola",
    tomorrow_no_school: "Amanhã não há escola",
    opt_title: "Título (opcional)",
    opt_workday: "Sensor Workday",
    opt_school_holidays: "Calendário de férias escolares",
    opt_public_holidays: "Calendário de feriados",
    opt_school_days: "Dias de escola",
    opt_show_title: "Mostrar título",
    opt_show_subtitle: "Mostrar subtítulo",
    opt_show_children: "Mostrar os filhos (Pronote)",
    opt_show_holidays: "Mostrar férias escolares",
    opt_show_public_holidays: "Mostrar feriados",
    opt_show_countdown: "Mostrar contagem decrescente das férias",
    opt_language: "Idioma",
    opt_zoom: "Botão de detalhe",
    help_workday: "Sensor binário da integração Workday (encontrado automaticamente se vazio)",
    help_school_holidays: "Calendário das férias escolares, como o ICS do ministério da Educação francês no Remote calendar (encontrado automaticamente se vazio)",
    help_public_holidays: "Calendário da integração Holiday (encontrado automaticamente se vazio)",
    help_school_days: "Dias com escola (os dias do sensor Workday se vazio)",
    help_zoom: "Botão no canto superior direito que alterna o mini cartão para o cartão completo e vice-versa",
    lang_auto: "Automático",
    zoom_in: "Mostrar o cartão completo",
    zoom_out: "Mostrar o cartão compacto",
    waste_tonight: "{type} esta noite",
    waste_title: "Recolha do lixo amanhã",
    birthday_title: "Aniversário",
    saint_title: "Dia do santo",
    opt_show_waste: "Mostrar a recolha do lixo",
    opt_show_birthdays: "Mostrar os aniversários",
    opt_show_saint: "Mostrar o dia do santo",
    opt_waste: "Calendários da recolha do lixo",
    opt_birthdays: "Calendários de aniversários",
    help_waste: "Calendários da recolha do lixo, como os do Waste Collection Schedule (encontrados automaticamente se vazio)",
    help_birthdays: "Calendários com um evento por aniversário, com o ano de nascimento para a idade (encontrados automaticamente se vazio)",
  },
  pl: {
    title: "Jutro",
    school_day: "Dzień szkolny",
    kind_school: "Szkoła",
    kind_weekend: "Weekend",
    kind_public_holiday: "Święto",
    kind_holidays: "Ferie",
    kind_day_off: "Dzień wolny",
    kind_unknown: "Nieznany",
    timetable_unknown: "Plan lekcji jeszcze nieznany",
    no_lessons: "Brak lekcji",
    school_at: "Szkoła o {time}",
    no_school: "Bez szkoły — {reason}",
    back_rel: "powrót {rel}",
    back_to_school: "Powrót do szkoły {rel}",
    holidays_rel: "Ferie {rel}",
    day_of: "Dzień {n} z {total}",
    loading: "Wczytywanie…",
    no_source: "Nie znaleziono źródła. Skonfiguruj integrację Workday lub Holiday, kalendarz ferii szkolnych lub Pronote albo podaj karcie jej encje.",
    tomorrow_school_at: "Jutro: szkoła o {time}",
    tomorrow_school: "Jutro: szkoła",
    tomorrow_no_school: "Jutro nie ma szkoły",
    opt_title: "Tytuł (opcjonalnie)",
    opt_workday: "Czujnik Workday",
    opt_school_holidays: "Kalendarz ferii szkolnych",
    opt_public_holidays: "Kalendarz świąt",
    opt_school_days: "Dni szkolne",
    opt_show_title: "Pokaż tytuł",
    opt_show_subtitle: "Pokaż podtytuł",
    opt_show_children: "Pokaż dzieci (Pronote)",
    opt_show_holidays: "Pokaż ferie szkolne",
    opt_show_public_holidays: "Pokaż święta",
    opt_show_countdown: "Pokaż odliczanie do ferii",
    opt_language: "Język",
    opt_zoom: "Przycisk szczegółów",
    help_workday: "Czujnik binarny integracji Workday (pusty: wyszukiwany automatycznie)",
    help_school_holidays: "Kalendarz ferii szkolnych, np. plik ICS francuskiego ministerstwa edukacji w Remote calendar (pusty: wyszukiwany automatycznie)",
    help_public_holidays: "Kalendarz integracji Holiday (pusty: wyszukiwany automatycznie)",
    help_school_days: "Dni ze szkołą (pusty: dni czujnika Workday)",
    help_zoom: "Przycisk w prawym górnym rogu, który przełącza minikartę na pełną kartę i z powrotem",
    lang_auto: "Automatyczny",
    zoom_in: "Pokaż pełną kartę",
    zoom_out: "Pokaż kompaktową kartę",
    waste_tonight: "{type} dziś wieczorem",
    waste_title: "Wywóz śmieci jutro",
    birthday_title: "Urodziny",
    saint_title: "Imieniny",
    opt_show_waste: "Pokaż wywóz śmieci",
    opt_show_birthdays: "Pokaż urodziny",
    opt_show_saint: "Pokaż imieniny (święty)",
    opt_waste: "Kalendarze wywozu śmieci",
    opt_birthdays: "Kalendarze urodzin",
    help_waste: "Kalendarze wywozu śmieci, np. z Waste Collection Schedule (wyszukiwane automatycznie, gdy puste)",
    help_birthdays: "Kalendarze z jednym wydarzeniem na urodziny, z rokiem urodzenia dla wieku (wyszukiwane automatycznie, gdy puste)",
  },
  sr: {
    title: "Сутра",
    school_day: "Школски дан",
    kind_school: "Школа",
    kind_weekend: "Викенд",
    kind_public_holiday: "Празник",
    kind_holidays: "Распуст",
    kind_day_off: "Слободан дан",
    kind_unknown: "Непознато",
    timetable_unknown: "Распоред још није познат",
    no_lessons: "Нема часова",
    school_at: "Школа у {time}",
    no_school: "Нема школе — {reason}",
    back_rel: "повратак {rel}",
    back_to_school: "Повратак у школу {rel}",
    holidays_rel: "Распуст {rel}",
    day_of: "Дан {n} од {total}",
    loading: "Учитавање…",
    no_source: "Није пронађен ниједан извор. Подесите интеграцију Workday или Holiday, календар школских распуста или Pronote, или наведите картици њене ентитете.",
    tomorrow_school_at: "Сутра: школа у {time}",
    tomorrow_school: "Сутра: школа",
    tomorrow_no_school: "Сутра нема школе",
    opt_title: "Наслов (опционо)",
    opt_workday: "Workday сензор",
    opt_school_holidays: "Календар школских распуста",
    opt_public_holidays: "Календар празника",
    opt_school_days: "Школски дани",
    opt_show_title: "Прикажи наслов",
    opt_show_subtitle: "Прикажи поднаслов",
    opt_show_children: "Прикажи децу (Pronote)",
    opt_show_holidays: "Прикажи школске распусте",
    opt_show_public_holidays: "Прикажи празнике",
    opt_show_countdown: "Прикажи одбројавање до распуста",
    opt_language: "Језик",
    opt_zoom: "Дугме за детаље",
    help_workday: "Бинарни сензор интеграције Workday (ако је празно, проналази се аутоматски)",
    help_school_holidays: "Календар школских распуста, нпр. ICS француског министарства просвете у Remote calendar (ако је празно, проналази се аутоматски)",
    help_public_holidays: "Календар интеграције Holiday (ако је празно, проналази се аутоматски)",
    help_school_days: "Дани са школом (ако је празно, дани Workday сензора)",
    help_zoom: "Дугме горе десно које пребацује мини картицу на пуну картицу и назад",
    lang_auto: "Аутоматски",
    zoom_in: "Прикажи пуну картицу",
    zoom_out: "Прикажи компактну картицу",
    waste_tonight: "{type} вечерас",
    waste_title: "Одвоз отпада сутра",
    birthday_title: "Рођендан",
    saint_title: "Имендан",
    opt_show_waste: "Прикажи одвоз отпада",
    opt_show_birthdays: "Прикажи рођендане",
    opt_show_saint: "Прикажи имендан (светац)",
    opt_waste: "Календари одвоза отпада",
    opt_birthdays: "Календари рођендана",
    help_waste: "Календари одвоза отпада, као они из Waste Collection Schedule (аутоматски пронађени ако је празно)",
    help_birthdays: "Календари са по једним догађајем за сваки рођендан, са годином рођења за узраст (аутоматски пронађени ако је празно)",
  },
  "sr-Latn": {
    title: "Sutra",
    school_day: "Školski dan",
    kind_school: "Škola",
    kind_weekend: "Vikend",
    kind_public_holiday: "Praznik",
    kind_holidays: "Raspust",
    kind_day_off: "Slobodan dan",
    kind_unknown: "Nepoznato",
    timetable_unknown: "Raspored još nije poznat",
    no_lessons: "Nema časova",
    school_at: "Škola u {time}",
    no_school: "Nema škole — {reason}",
    back_rel: "povratak {rel}",
    back_to_school: "Povratak u školu {rel}",
    holidays_rel: "Raspust {rel}",
    day_of: "Dan {n} od {total}",
    loading: "Učitavanje…",
    no_source: "Nije pronađen nijedan izvor. Podesite integraciju Workday ili Holiday, kalendar školskih raspusta ili Pronote, ili navedite kartici njene entitete.",
    tomorrow_school_at: "Sutra: škola u {time}",
    tomorrow_school: "Sutra: škola",
    tomorrow_no_school: "Sutra nema škole",
    opt_title: "Naslov (opciono)",
    opt_workday: "Workday senzor",
    opt_school_holidays: "Kalendar školskih raspusta",
    opt_public_holidays: "Kalendar praznika",
    opt_school_days: "Školski dani",
    opt_show_title: "Prikaži naslov",
    opt_show_subtitle: "Prikaži podnaslov",
    opt_show_children: "Prikaži decu (Pronote)",
    opt_show_holidays: "Prikaži školske raspuste",
    opt_show_public_holidays: "Prikaži praznike",
    opt_show_countdown: "Prikaži odbrojavanje do raspusta",
    opt_language: "Jezik",
    opt_zoom: "Dugme za detalje",
    help_workday: "Binarni senzor integracije Workday (ako je prazno, pronalazi se automatski)",
    help_school_holidays: "Kalendar školskih raspusta, npr. ICS francuskog ministarstva prosvete u Remote calendar (ako je prazno, pronalazi se automatski)",
    help_public_holidays: "Kalendar integracije Holiday (ako je prazno, pronalazi se automatski)",
    help_school_days: "Dani sa školom (ako je prazno, dani Workday senzora)",
    help_zoom: "Dugme gore desno koje prebacuje mini karticu na punu karticu i nazad",
    lang_auto: "Automatski",
    zoom_in: "Prikaži punu karticu",
    zoom_out: "Prikaži kompaktnu karticu",
    waste_tonight: "{type} večeras",
    waste_title: "Odvoz otpada sutra",
    birthday_title: "Rođendan",
    saint_title: "Imendan",
    opt_show_waste: "Prikaži odvoz otpada",
    opt_show_birthdays: "Prikaži rođendane",
    opt_show_saint: "Prikaži imendan (svetac)",
    opt_waste: "Kalendari odvoza otpada",
    opt_birthdays: "Kalendari rođendana",
    help_waste: "Kalendari odvoza otpada, kao oni iz Waste Collection Schedule (automatski pronađeni ako je prazno)",
    help_birthdays: "Kalendari sa po jednim događajem za svaki rođendan, sa godinom rođenja za uzrast (automatski pronađeni ako je prazno)",
  },
  ro: {
    title: "Mâine",
    school_day: "Zi de școală",
    kind_school: "Școală",
    kind_weekend: "Weekend",
    kind_public_holiday: "Sărbătoare legală",
    kind_holidays: "Vacanță",
    kind_day_off: "Zi liberă",
    kind_unknown: "Necunoscut",
    timetable_unknown: "Orar încă necunoscut",
    no_lessons: "Fără ore",
    school_at: "Școală la {time}",
    no_school: "Fără școală — {reason}",
    back_rel: "întoarcere {rel}",
    back_to_school: "Înapoi la școală {rel}",
    holidays_rel: "Vacanță {rel}",
    day_of: "Ziua {n} din {total}",
    loading: "Se încarcă…",
    no_source: "Nicio sursă găsită. Configurați integrarea Workday sau Holiday, un calendar al vacanțelor școlare sau Pronote, ori indicați cardului entitățile sale.",
    tomorrow_school_at: "Mâine: școală la {time}",
    tomorrow_school: "Mâine: școală",
    tomorrow_no_school: "Mâine nu e școală",
    opt_title: "Titlu (opțional)",
    opt_workday: "Senzor Workday",
    opt_school_holidays: "Calendarul vacanțelor școlare",
    opt_public_holidays: "Calendarul sărbătorilor legale",
    opt_school_days: "Zile de școală",
    opt_show_title: "Afișează titlul",
    opt_show_subtitle: "Afișează subtitlul",
    opt_show_children: "Afișează copiii (Pronote)",
    opt_show_holidays: "Afișează vacanțele școlare",
    opt_show_public_holidays: "Afișează sărbătorile legale",
    opt_show_countdown: "Afișează numărătoarea inversă până la vacanță",
    opt_language: "Limbă",
    opt_zoom: "Buton de detalii",
    help_workday: "Senzorul binar al integrării Workday (găsit automat dacă e gol)",
    help_school_holidays: "Calendarul vacanțelor școlare, de exemplu ICS-ul ministerului francez al educației în Remote calendar (găsit automat dacă e gol)",
    help_public_holidays: "Calendarul integrării Holiday (găsit automat dacă e gol)",
    help_school_days: "Zile cu școală (zilele senzorului Workday dacă e gol)",
    help_zoom: "Buton din dreapta sus care comută mini cardul la cardul complet și înapoi",
    lang_auto: "Automat",
    zoom_in: "Afișează cardul complet",
    zoom_out: "Afișează cardul compact",
    waste_tonight: "{type} în seara asta",
    waste_title: "Colectarea gunoiului mâine",
    birthday_title: "Zi de naștere",
    saint_title: "Onomastică",
    opt_show_waste: "Afișează colectarea gunoiului",
    opt_show_birthdays: "Afișează zilele de naștere",
    opt_show_saint: "Afișează onomastica (sfântul)",
    opt_waste: "Calendare de colectare a gunoiului",
    opt_birthdays: "Calendare cu zile de naștere",
    help_waste: "Calendare de colectare a gunoiului, ca cele din Waste Collection Schedule (găsite automat dacă e gol)",
    help_birthdays: "Calendare cu un eveniment pe zi de naștere, cu anul nașterii pentru vârstă (găsite automat dacă e gol)",
  },
  da: {
    title: "I morgen",
    school_day: "Skoledag",
    kind_school: "Skole",
    kind_weekend: "Weekend",
    kind_public_holiday: "Helligdag",
    kind_holidays: "Ferie",
    kind_day_off: "Fridag",
    kind_unknown: "Ukendt",
    timetable_unknown: "Skemaet er endnu ikke kendt",
    no_lessons: "Ingen timer",
    school_at: "Skole kl. {time}",
    no_school: "Ingen skole — {reason}",
    back_rel: "tilbage {rel}",
    back_to_school: "Tilbage i skole {rel}",
    holidays_rel: "Ferie {rel}",
    day_of: "Dag {n} af {total}",
    loading: "Indlæser…",
    no_source: "Ingen kilde fundet. Opsæt integrationen Workday eller Holiday, en skoleferiekalender eller Pronote, eller angiv kortets enheder.",
    tomorrow_school_at: "I morgen: skole kl. {time}",
    tomorrow_school: "I morgen: skole",
    tomorrow_no_school: "Ingen skole i morgen",
    opt_title: "Titel (valgfri)",
    opt_workday: "Workday-sensor",
    opt_school_holidays: "Skoleferiekalender",
    opt_public_holidays: "Helligdagskalender",
    opt_school_days: "Skoledage",
    opt_show_title: "Vis titel",
    opt_show_subtitle: "Vis undertitel",
    opt_show_children: "Vis børn (Pronote)",
    opt_show_holidays: "Vis skoleferier",
    opt_show_public_holidays: "Vis helligdage",
    opt_show_countdown: "Vis nedtælling til ferien",
    opt_language: "Sprog",
    opt_zoom: "Detaljeknap",
    help_workday: "Binær sensor fra Workday-integrationen (findes automatisk, hvis tom)",
    help_school_holidays: "Kalender over skoleferier, f.eks. det franske undervisningsministeriums ICS i Remote calendar (findes automatisk, hvis tom)",
    help_public_holidays: "Kalender fra Holiday-integrationen (findes automatisk, hvis tom)",
    help_school_days: "Dage med skole (Workday-sensorens dage, hvis tom)",
    help_zoom: "Knap øverst til højre, der skifter minikortet til det fulde kort og tilbage",
    lang_auto: "Automatisk",
    zoom_in: "Vis det fulde kort",
    zoom_out: "Vis det kompakte kort",
    waste_tonight: "{type} i aften",
    waste_title: "Affaldsafhentning i morgen",
    birthday_title: "Fødselsdag",
    saint_title: "Navnedag",
    opt_show_waste: "Vis affaldsafhentning",
    opt_show_birthdays: "Vis fødselsdage",
    opt_show_saint: "Vis navnedag (helgen)",
    opt_waste: "Kalendere for affaldsafhentning",
    opt_birthdays: "Fødselsdagskalendere",
    help_waste: "Kalendere for affaldsafhentning, som dem fra Waste Collection Schedule (findes automatisk, hvis tom)",
    help_birthdays: "Kalendere med én begivenhed pr. fødselsdag, med fødselsåret for alderen (findes automatisk, hvis tom)",
  },
  sv: {
    title: "I morgon",
    school_day: "Skoldag",
    kind_school: "Skola",
    kind_weekend: "Helg",
    kind_public_holiday: "Helgdag",
    kind_holidays: "Lov",
    kind_day_off: "Ledig dag",
    kind_unknown: "Okänt",
    timetable_unknown: "Schemat är inte känt än",
    no_lessons: "Inga lektioner",
    school_at: "Skola kl. {time}",
    no_school: "Ingen skola — {reason}",
    back_rel: "tillbaka {rel}",
    back_to_school: "Tillbaka till skolan {rel}",
    holidays_rel: "Lov {rel}",
    day_of: "Dag {n} av {total}",
    loading: "Läser in…",
    no_source: "Ingen källa hittades. Konfigurera integrationen Workday eller Holiday, en kalender för skollov eller Pronote, eller ange kortets entiteter.",
    tomorrow_school_at: "I morgon: skola kl. {time}",
    tomorrow_school: "I morgon: skola",
    tomorrow_no_school: "Ingen skola i morgon",
    opt_title: "Titel (valfri)",
    opt_workday: "Workday-sensor",
    opt_school_holidays: "Kalender för skollov",
    opt_public_holidays: "Kalender för helgdagar",
    opt_school_days: "Skoldagar",
    opt_show_title: "Visa titel",
    opt_show_subtitle: "Visa undertitel",
    opt_show_children: "Visa barn (Pronote)",
    opt_show_holidays: "Visa skollov",
    opt_show_public_holidays: "Visa helgdagar",
    opt_show_countdown: "Visa nedräkning till lovet",
    opt_language: "Språk",
    opt_zoom: "Detaljknapp",
    help_workday: "Binär sensor från Workday-integrationen (hittas automatiskt om tom)",
    help_school_holidays: "Kalender för skollov, t.ex. det franska utbildningsdepartementets ICS i Remote calendar (hittas automatiskt om tom)",
    help_public_holidays: "Kalender från Holiday-integrationen (hittas automatiskt om tom)",
    help_school_days: "Dagar med skola (Workday-sensorns dagar om tom)",
    help_zoom: "Knapp uppe till höger som växlar minikortet till hela kortet och tillbaka",
    lang_auto: "Automatiskt",
    zoom_in: "Visa hela kortet",
    zoom_out: "Visa det kompakta kortet",
    waste_tonight: "{type} i kväll",
    waste_title: "Sophämtning i morgon",
    birthday_title: "Födelsedag",
    saint_title: "Namnsdag",
    opt_show_waste: "Visa sophämtning",
    opt_show_birthdays: "Visa födelsedagar",
    opt_show_saint: "Visa namnsdag (helgon)",
    opt_waste: "Kalendrar för sophämtning",
    opt_birthdays: "Födelsedagskalendrar",
    help_waste: "Kalendrar för sophämtning, som de från Waste Collection Schedule (hittas automatiskt om tom)",
    help_birthdays: "Kalendrar med en händelse per födelsedag, med födelseåret för åldern (hittas automatiskt om tom)",
  },
  bg: {
    title: "Утре",
    school_day: "Учебен ден",
    kind_school: "Училище",
    kind_weekend: "Почивни дни",
    kind_public_holiday: "Официален празник",
    kind_holidays: "Ваканция",
    kind_day_off: "Почивен ден",
    kind_unknown: "Неизвестно",
    timetable_unknown: "Разписанието още не е известно",
    no_lessons: "Няма часове",
    school_at: "Училище в {time}",
    no_school: "Няма училище — {reason}",
    back_rel: "връщане {rel}",
    back_to_school: "Обратно на училище {rel}",
    holidays_rel: "Ваканция {rel}",
    day_of: "Ден {n} от {total}",
    loading: "Зареждане…",
    no_source: "Не е намерен източник. Настройте интеграцията Workday или Holiday, календар на ученическите ваканции или Pronote, или посочете обектите на картата.",
    tomorrow_school_at: "Утре: училище в {time}",
    tomorrow_school: "Утре: училище",
    tomorrow_no_school: "Утре няма училище",
    opt_title: "Заглавие (по избор)",
    opt_workday: "Сензор Workday",
    opt_school_holidays: "Календар на ученическите ваканции",
    opt_public_holidays: "Календар на празниците",
    opt_school_days: "Учебни дни",
    opt_show_title: "Показване на заглавието",
    opt_show_subtitle: "Показване на подзаглавието",
    opt_show_children: "Показване на децата (Pronote)",
    opt_show_holidays: "Показване на ваканциите",
    opt_show_public_holidays: "Показване на празниците",
    opt_show_countdown: "Показване на обратното броене до ваканцията",
    opt_language: "Език",
    opt_zoom: "Бутон за подробности",
    help_workday: "Двоичен сензор на интеграцията Workday (намира се автоматично, ако е празно)",
    help_school_holidays: "Календар на ученическите ваканции, напр. ICS на френското министерство на образованието в Remote calendar (намира се автоматично, ако е празно)",
    help_public_holidays: "Календар на интеграцията Holiday (намира се автоматично, ако е празно)",
    help_school_days: "Дни с училище (дните на сензора Workday, ако е празно)",
    help_zoom: "Бутон горе вдясно, който превключва мини картата към пълната карта и обратно",
    lang_auto: "Автоматично",
    zoom_in: "Показване на пълната карта",
    zoom_out: "Показване на компактната карта",
    waste_tonight: "{type} довечера",
    waste_title: "Извозване на отпадъци утре",
    birthday_title: "Рожден ден",
    saint_title: "Имен ден",
    opt_show_waste: "Показване на извозването на отпадъци",
    opt_show_birthdays: "Показване на рождените дни",
    opt_show_saint: "Показване на имения ден (светец)",
    opt_waste: "Календари за извозване на отпадъци",
    opt_birthdays: "Календари с рождени дни",
    help_waste: "Календари за извозване на отпадъци, като тези на Waste Collection Schedule (намират се автоматично, ако е празно)",
    help_birthdays: "Календари с по едно събитие за всеки рожден ден, с годината на раждане за възрастта (намират се автоматично, ако е празно)",
  },
  ru: {
    title: "Завтра",
    school_day: "Учебный день",
    kind_school: "Школа",
    kind_weekend: "Выходные",
    kind_public_holiday: "Праздник",
    kind_holidays: "Каникулы",
    kind_day_off: "Выходной",
    kind_unknown: "Неизвестно",
    timetable_unknown: "Расписание пока неизвестно",
    no_lessons: "Нет уроков",
    school_at: "Школа в {time}",
    no_school: "Нет школы — {reason}",
    back_rel: "возвращение {rel}",
    back_to_school: "Снова в школу {rel}",
    holidays_rel: "Каникулы {rel}",
    day_of: "День {n} из {total}",
    loading: "Загрузка…",
    no_source: "Источник не найден. Настройте интеграцию Workday или Holiday, календарь школьных каникул или Pronote либо укажите карточке её объекты.",
    tomorrow_school_at: "Завтра: школа в {time}",
    tomorrow_school: "Завтра: школа",
    tomorrow_no_school: "Завтра нет школы",
    opt_title: "Заголовок (необязательно)",
    opt_workday: "Датчик Workday",
    opt_school_holidays: "Календарь школьных каникул",
    opt_public_holidays: "Календарь праздников",
    opt_school_days: "Учебные дни",
    opt_show_title: "Показывать заголовок",
    opt_show_subtitle: "Показывать подзаголовок",
    opt_show_children: "Показывать детей (Pronote)",
    opt_show_holidays: "Показывать школьные каникулы",
    opt_show_public_holidays: "Показывать праздники",
    opt_show_countdown: "Показывать обратный отсчёт до каникул",
    opt_language: "Язык",
    opt_zoom: "Кнопка подробностей",
    help_workday: "Бинарный датчик интеграции Workday (если пусто, находится автоматически)",
    help_school_holidays: "Календарь школьных каникул, например ICS министерства образования Франции в Remote calendar (если пусто, находится автоматически)",
    help_public_holidays: "Календарь интеграции Holiday (если пусто, находится автоматически)",
    help_school_days: "Дни с занятиями (если пусто, дни датчика Workday)",
    help_zoom: "Кнопка в правом верхнем углу, переключающая мини-карточку на полную карточку и обратно",
    lang_auto: "Автоматически",
    zoom_in: "Показать полную карточку",
    zoom_out: "Показать компактную карточку",
    waste_tonight: "{type} сегодня вечером",
    waste_title: "Вывоз мусора завтра",
    birthday_title: "День рождения",
    saint_title: "Именины",
    opt_show_waste: "Показывать вывоз мусора",
    opt_show_birthdays: "Показывать дни рождения",
    opt_show_saint: "Показывать именины (святой)",
    opt_waste: "Календари вывоза мусора",
    opt_birthdays: "Календари дней рождения",
    help_waste: "Календари вывоза мусора, например из Waste Collection Schedule (находятся автоматически, если пусто)",
    help_birthdays: "Календари с одним событием на день рождения, с годом рождения для возраста (находятся автоматически, если пусто)",
  },
  uk: {
    title: "Завтра",
    school_day: "Навчальний день",
    kind_school: "Школа",
    kind_weekend: "Вихідні",
    kind_public_holiday: "Свято",
    kind_holidays: "Канікули",
    kind_day_off: "Вихідний",
    kind_unknown: "Невідомо",
    timetable_unknown: "Розклад ще невідомий",
    no_lessons: "Немає уроків",
    school_at: "Школа о {time}",
    no_school: "Немає школи — {reason}",
    back_rel: "повернення {rel}",
    back_to_school: "Знову до школи {rel}",
    holidays_rel: "Канікули {rel}",
    day_of: "День {n} з {total}",
    loading: "Завантаження…",
    no_source: "Джерело не знайдено. Налаштуйте інтеграцію Workday або Holiday, календар шкільних канікул або Pronote чи вкажіть картці її об'єкти.",
    tomorrow_school_at: "Завтра: школа о {time}",
    tomorrow_school: "Завтра: школа",
    tomorrow_no_school: "Завтра немає школи",
    opt_title: "Заголовок (необов'язково)",
    opt_workday: "Датчик Workday",
    opt_school_holidays: "Календар шкільних канікул",
    opt_public_holidays: "Календар свят",
    opt_school_days: "Навчальні дні",
    opt_show_title: "Показувати заголовок",
    opt_show_subtitle: "Показувати підзаголовок",
    opt_show_children: "Показувати дітей (Pronote)",
    opt_show_holidays: "Показувати шкільні канікули",
    opt_show_public_holidays: "Показувати свята",
    opt_show_countdown: "Показувати зворотний відлік до канікул",
    opt_language: "Мова",
    opt_zoom: "Кнопка подробиць",
    help_workday: "Бінарний датчик інтеграції Workday (якщо порожньо, знаходиться автоматично)",
    help_school_holidays: "Календар шкільних канікул, наприклад ICS міністерства освіти Франції в Remote calendar (якщо порожньо, знаходиться автоматично)",
    help_public_holidays: "Календар інтеграції Holiday (якщо порожньо, знаходиться автоматично)",
    help_school_days: "Дні із заняттями (якщо порожньо, дні датчика Workday)",
    help_zoom: "Кнопка вгорі праворуч, що перемикає міні-картку на повну картку й назад",
    lang_auto: "Автоматично",
    zoom_in: "Показати повну картку",
    zoom_out: "Показати компактну картку",
    waste_tonight: "{type} сьогодні ввечері",
    waste_title: "Вивезення сміття завтра",
    birthday_title: "День народження",
    saint_title: "Іменини",
    opt_show_waste: "Показувати вивезення сміття",
    opt_show_birthdays: "Показувати дні народження",
    opt_show_saint: "Показувати іменини (святий)",
    opt_waste: "Календарі вивезення сміття",
    opt_birthdays: "Календарі днів народження",
    help_waste: "Календарі вивезення сміття, наприклад з Waste Collection Schedule (знаходяться автоматично, якщо порожньо)",
    help_birthdays: "Календарі з однією подією на день народження, з роком народження для віку (знаходяться автоматично, якщо порожньо)",
  },
  hu: {
    title: "Holnap",
    school_day: "Iskolanap",
    kind_school: "Iskola",
    kind_weekend: "Hétvége",
    kind_public_holiday: "Ünnepnap",
    kind_holidays: "Szünet",
    kind_day_off: "Szabadnap",
    kind_unknown: "Ismeretlen",
    timetable_unknown: "Az órarend még nem ismert",
    no_lessons: "Nincs óra",
    school_at: "Iskola {time}-kor",
    no_school: "Nincs iskola — {reason}",
    back_rel: "vissza {rel}",
    back_to_school: "Vissza az iskolába {rel}",
    holidays_rel: "Szünet {rel}",
    day_of: "{n}. nap / {total}",
    loading: "Betöltés…",
    no_source: "Nem található forrás. Állítsa be a Workday vagy Holiday integrációt, egy iskolai szünetek naptárt vagy a Pronote-ot, vagy adja meg a kártya entitásait.",
    tomorrow_school_at: "Holnap: iskola {time}-kor",
    tomorrow_school: "Holnap: iskola",
    tomorrow_no_school: "Holnap nincs iskola",
    opt_title: "Cím (opcionális)",
    opt_workday: "Workday érzékelő",
    opt_school_holidays: "Iskolai szünetek naptára",
    opt_public_holidays: "Ünnepnapok naptára",
    opt_school_days: "Iskolanapok",
    opt_show_title: "Cím megjelenítése",
    opt_show_subtitle: "Alcím megjelenítése",
    opt_show_children: "Gyerekek megjelenítése (Pronote)",
    opt_show_holidays: "Iskolai szünetek megjelenítése",
    opt_show_public_holidays: "Ünnepnapok megjelenítése",
    opt_show_countdown: "Visszaszámlálás a szünetig",
    opt_language: "Nyelv",
    opt_zoom: "Részletek gomb",
    help_workday: "A Workday integráció bináris érzékelője (üresen automatikusan megtalálja)",
    help_school_holidays: "Az iskolai szünetek naptára, pl. a francia oktatási minisztérium ICS-e a Remote calendarban (üresen automatikusan megtalálja)",
    help_public_holidays: "A Holiday integráció naptára (üresen automatikusan megtalálja)",
    help_school_days: "Iskolás napok (üresen a Workday érzékelő napjai)",
    help_zoom: "Jobb felső gomb, amely a mini kártyát a teljes kártyára és vissza váltja",
    lang_auto: "Automatikus",
    zoom_in: "Teljes kártya megjelenítése",
    zoom_out: "Kompakt kártya megjelenítése",
    waste_tonight: "{type} ma este",
    waste_title: "Szemétszállítás holnap",
    birthday_title: "Születésnap",
    saint_title: "Névnap",
    opt_show_waste: "Szemétszállítás megjelenítése",
    opt_show_birthdays: "Születésnapok megjelenítése",
    opt_show_saint: "Névnap megjelenítése (szent)",
    opt_waste: "Szemétszállítási naptárak",
    opt_birthdays: "Születésnapi naptárak",
    help_waste: "Szemétszállítási naptárak, például a Waste Collection Schedule naptárai (üresen automatikusan megtalálja)",
    help_birthdays: "Naptárak születésnaponként egy eseménnyel, a születési évvel az életkorhoz (üresen automatikusan megtalálja)",
  },
  sk: {
    title: "Zajtra",
    school_day: "Školský deň",
    kind_school: "Škola",
    kind_weekend: "Víkend",
    kind_public_holiday: "Sviatok",
    kind_holidays: "Prázdniny",
    kind_day_off: "Voľný deň",
    kind_unknown: "Neznáme",
    timetable_unknown: "Rozvrh zatiaľ nie je známy",
    no_lessons: "Žiadne hodiny",
    school_at: "Škola o {time}",
    no_school: "Bez školy — {reason}",
    back_rel: "návrat {rel}",
    back_to_school: "Späť do školy {rel}",
    holidays_rel: "Prázdniny {rel}",
    day_of: "Deň {n} z {total}",
    loading: "Načítava sa…",
    no_source: "Nenašiel sa žiadny zdroj. Nastavte integráciu Workday alebo Holiday, kalendár školských prázdnin alebo Pronote, alebo zadajte karte jej entity.",
    tomorrow_school_at: "Zajtra: škola o {time}",
    tomorrow_school: "Zajtra: škola",
    tomorrow_no_school: "Zajtra nie je škola",
    opt_title: "Názov (voliteľné)",
    opt_workday: "Senzor Workday",
    opt_school_holidays: "Kalendár školských prázdnin",
    opt_public_holidays: "Kalendár sviatkov",
    opt_school_days: "Školské dni",
    opt_show_title: "Zobraziť názov",
    opt_show_subtitle: "Zobraziť podnázov",
    opt_show_children: "Zobraziť deti (Pronote)",
    opt_show_holidays: "Zobraziť školské prázdniny",
    opt_show_public_holidays: "Zobraziť sviatky",
    opt_show_countdown: "Zobraziť odpočítavanie do prázdnin",
    opt_language: "Jazyk",
    opt_zoom: "Tlačidlo podrobností",
    help_workday: "Binárny senzor integrácie Workday (ak je prázdne, nájde sa automaticky)",
    help_school_holidays: "Kalendár školských prázdnin, napr. ICS francúzskeho ministerstva školstva v Remote calendar (ak je prázdne, nájde sa automaticky)",
    help_public_holidays: "Kalendár integrácie Holiday (ak je prázdne, nájde sa automaticky)",
    help_school_days: "Dni so školou (ak je prázdne, dni senzora Workday)",
    help_zoom: "Tlačidlo vpravo hore, ktoré prepína minikartu na úplnú kartu a späť",
    lang_auto: "Automaticky",
    zoom_in: "Zobraziť úplnú kartu",
    zoom_out: "Zobraziť kompaktnú kartu",
    waste_tonight: "{type} dnes večer",
    waste_title: "Odvoz odpadu zajtra",
    birthday_title: "Narodeniny",
    saint_title: "Meniny",
    opt_show_waste: "Zobraziť odvoz odpadu",
    opt_show_birthdays: "Zobraziť narodeniny",
    opt_show_saint: "Zobraziť meniny (svätý)",
    opt_waste: "Kalendáre odvozu odpadu",
    opt_birthdays: "Kalendáre narodenín",
    help_waste: "Kalendáre odvozu odpadu, napríklad z Waste Collection Schedule (nájdené automaticky, ak je prázdne)",
    help_birthdays: "Kalendáre s jednou udalosťou na narodeniny, s rokom narodenia pre vek (nájdené automaticky, ak je prázdne)",
  },
  cs: {
    title: "Zítra",
    school_day: "Školní den",
    kind_school: "Škola",
    kind_weekend: "Víkend",
    kind_public_holiday: "Svátek",
    kind_holidays: "Prázdniny",
    kind_day_off: "Volný den",
    kind_unknown: "Neznámé",
    timetable_unknown: "Rozvrh zatím není znám",
    no_lessons: "Žádné hodiny",
    school_at: "Škola v {time}",
    no_school: "Bez školy — {reason}",
    back_rel: "návrat {rel}",
    back_to_school: "Zpět do školy {rel}",
    holidays_rel: "Prázdniny {rel}",
    day_of: "Den {n} z {total}",
    loading: "Načítání…",
    no_source: "Nenalezen žádný zdroj. Nastavte integraci Workday nebo Holiday, kalendář školních prázdnin nebo Pronote, nebo zadejte kartě její entity.",
    tomorrow_school_at: "Zítra: škola v {time}",
    tomorrow_school: "Zítra: škola",
    tomorrow_no_school: "Zítra není škola",
    opt_title: "Název (volitelné)",
    opt_workday: "Senzor Workday",
    opt_school_holidays: "Kalendář školních prázdnin",
    opt_public_holidays: "Kalendář svátků",
    opt_school_days: "Školní dny",
    opt_show_title: "Zobrazit název",
    opt_show_subtitle: "Zobrazit podnázev",
    opt_show_children: "Zobrazit děti (Pronote)",
    opt_show_holidays: "Zobrazit školní prázdniny",
    opt_show_public_holidays: "Zobrazit svátky",
    opt_show_countdown: "Zobrazit odpočet do prázdnin",
    opt_language: "Jazyk",
    opt_zoom: "Tlačítko podrobností",
    help_workday: "Binární senzor integrace Workday (pokud je prázdné, najde se automaticky)",
    help_school_holidays: "Kalendář školních prázdnin, např. ICS francouzského ministerstva školství v Remote calendar (pokud je prázdné, najde se automaticky)",
    help_public_holidays: "Kalendář integrace Holiday (pokud je prázdné, najde se automaticky)",
    help_school_days: "Dny se školou (pokud je prázdné, dny senzoru Workday)",
    help_zoom: "Tlačítko vpravo nahoře, které přepíná minikartu na úplnou kartu a zpět",
    lang_auto: "Automaticky",
    zoom_in: "Zobrazit úplnou kartu",
    zoom_out: "Zobrazit kompaktní kartu",
    waste_tonight: "{type} dnes večer",
    waste_title: "Svoz odpadu zítra",
    birthday_title: "Narozeniny",
    saint_title: "Svátek",
    opt_show_waste: "Zobrazit svoz odpadu",
    opt_show_birthdays: "Zobrazit narozeniny",
    opt_show_saint: "Zobrazit svátek (světec)",
    opt_waste: "Kalendáře svozu odpadu",
    opt_birthdays: "Kalendáře narozenin",
    help_waste: "Kalendáře svozu odpadu, například z Waste Collection Schedule (nalezeny automaticky, pokud je prázdné)",
    help_birthdays: "Kalendáře s jednou událostí na narozeniny, s rokem narození pro věk (nalezeny automaticky, pokud je prázdné)",
  },
  sl: {
    title: "Jutri",
    school_day: "Šolski dan",
    kind_school: "Šola",
    kind_weekend: "Vikend",
    kind_public_holiday: "Praznik",
    kind_holidays: "Počitnice",
    kind_day_off: "Prost dan",
    kind_unknown: "Neznano",
    timetable_unknown: "Urnik še ni znan",
    no_lessons: "Ni ur",
    school_at: "Šola ob {time}",
    no_school: "Ni šole — {reason}",
    back_rel: "vrnitev {rel}",
    back_to_school: "Nazaj v šolo {rel}",
    holidays_rel: "Počitnice {rel}",
    day_of: "Dan {n} od {total}",
    loading: "Nalaganje…",
    no_source: "Ni najdenega vira. Nastavite integracijo Workday ali Holiday, koledar šolskih počitnic ali Pronote ali kartici navedite njene entitete.",
    tomorrow_school_at: "Jutri: šola ob {time}",
    tomorrow_school: "Jutri: šola",
    tomorrow_no_school: "Jutri ni šole",
    opt_title: "Naslov (neobvezno)",
    opt_workday: "Senzor Workday",
    opt_school_holidays: "Koledar šolskih počitnic",
    opt_public_holidays: "Koledar praznikov",
    opt_school_days: "Šolski dnevi",
    opt_show_title: "Prikaži naslov",
    opt_show_subtitle: "Prikaži podnaslov",
    opt_show_children: "Prikaži otroke (Pronote)",
    opt_show_holidays: "Prikaži šolske počitnice",
    opt_show_public_holidays: "Prikaži praznike",
    opt_show_countdown: "Prikaži odštevanje do počitnic",
    opt_language: "Jezik",
    opt_zoom: "Gumb za podrobnosti",
    help_workday: "Binarni senzor integracije Workday (če je prazno, se najde samodejno)",
    help_school_holidays: "Koledar šolskih počitnic, npr. ICS francoskega ministrstva za šolstvo v Remote calendar (če je prazno, se najde samodejno)",
    help_public_holidays: "Koledar integracije Holiday (če je prazno, se najde samodejno)",
    help_school_days: "Dnevi s šolo (če je prazno, dnevi senzorja Workday)",
    help_zoom: "Gumb zgoraj desno, ki preklopi mini kartico na polno kartico in nazaj",
    lang_auto: "Samodejno",
    zoom_in: "Prikaži polno kartico",
    zoom_out: "Prikaži strnjeno kartico",
    waste_tonight: "{type} nocoj",
    waste_title: "Odvoz odpadkov jutri",
    birthday_title: "Rojstni dan",
    saint_title: "God",
    opt_show_waste: "Prikaži odvoz odpadkov",
    opt_show_birthdays: "Prikaži rojstne dneve",
    opt_show_saint: "Prikaži god (svetnik)",
    opt_waste: "Koledarji odvoza odpadkov",
    opt_birthdays: "Koledarji rojstnih dni",
    help_waste: "Koledarji odvoza odpadkov, na primer iz Waste Collection Schedule (najdeni samodejno, če je prazno)",
    help_birthdays: "Koledarji z enim dogodkom na rojstni dan, z letnico rojstva za starost (najdeni samodejno, če je prazno)",
  },
  lv: {
    title: "Rīt",
    school_day: "Skolas diena",
    kind_school: "Skola",
    kind_weekend: "Nedēļas nogale",
    kind_public_holiday: "Svētku diena",
    kind_holidays: "Brīvdienas",
    kind_day_off: "Brīvdiena",
    kind_unknown: "Nezināms",
    timetable_unknown: "Stundu saraksts vēl nav zināms",
    no_lessons: "Nav stundu",
    school_at: "Skola plkst. {time}",
    no_school: "Nav skolas — {reason}",
    back_rel: "atpakaļ {rel}",
    back_to_school: "Atpakaļ uz skolu {rel}",
    holidays_rel: "Brīvdienas {rel}",
    day_of: "{n}. diena no {total}",
    loading: "Ielādē…",
    no_source: "Avots nav atrasts. Iestatiet integrāciju Workday vai Holiday, skolas brīvdienu kalendāru vai Pronote, vai norādiet kartei tās vienības.",
    tomorrow_school_at: "Rīt: skola plkst. {time}",
    tomorrow_school: "Rīt: skola",
    tomorrow_no_school: "Rīt nav skolas",
    opt_title: "Virsraksts (neobligāts)",
    opt_workday: "Workday sensors",
    opt_school_holidays: "Skolas brīvdienu kalendārs",
    opt_public_holidays: "Svētku dienu kalendārs",
    opt_school_days: "Skolas dienas",
    opt_show_title: "Rādīt virsrakstu",
    opt_show_subtitle: "Rādīt apakšvirsrakstu",
    opt_show_children: "Rādīt bērnus (Pronote)",
    opt_show_holidays: "Rādīt skolas brīvdienas",
    opt_show_public_holidays: "Rādīt svētku dienas",
    opt_show_countdown: "Rādīt atpakaļskaitīšanu līdz brīvdienām",
    opt_language: "Valoda",
    opt_zoom: "Detaļu poga",
    help_workday: "Workday integrācijas binārais sensors (ja tukšs, tiek atrasts automātiski)",
    help_school_holidays: "Skolas brīvdienu kalendārs, piem., Francijas izglītības ministrijas ICS Remote calendar (ja tukšs, tiek atrasts automātiski)",
    help_public_holidays: "Holiday integrācijas kalendārs (ja tukšs, tiek atrasts automātiski)",
    help_school_days: "Dienas ar skolu (ja tukšs, Workday sensora dienas)",
    help_zoom: "Poga augšā pa labi, kas pārslēdz mini karti uz pilno karti un atpakaļ",
    lang_auto: "Automātiski",
    zoom_in: "Rādīt pilno karti",
    zoom_out: "Rādīt kompakto karti",
    waste_tonight: "{type} šovakar",
    waste_title: "Atkritumu izvešana rīt",
    birthday_title: "Dzimšanas diena",
    saint_title: "Vārda diena",
    opt_show_waste: "Rādīt atkritumu izvešanu",
    opt_show_birthdays: "Rādīt dzimšanas dienas",
    opt_show_saint: "Rādīt vārda dienu (svētais)",
    opt_waste: "Atkritumu izvešanas kalendāri",
    opt_birthdays: "Dzimšanas dienu kalendāri",
    help_waste: "Atkritumu izvešanas kalendāri, piemēram, no Waste Collection Schedule (atrod automātiski, ja tukšs)",
    help_birthdays: "Kalendāri ar vienu notikumu katrai dzimšanas dienai, ar dzimšanas gadu vecumam (atrod automātiski, ja tukšs)",
  },
  el: {
    title: "Αύριο",
    school_day: "Σχολική μέρα",
    kind_school: "Σχολείο",
    kind_weekend: "Σαββατοκύριακο",
    kind_public_holiday: "Αργία",
    kind_holidays: "Διακοπές",
    kind_day_off: "Ρεπό",
    kind_unknown: "Άγνωστο",
    timetable_unknown: "Το πρόγραμμα δεν είναι ακόμη γνωστό",
    no_lessons: "Χωρίς μαθήματα",
    school_at: "Σχολείο στις {time}",
    no_school: "Χωρίς σχολείο — {reason}",
    back_rel: "επιστροφή {rel}",
    back_to_school: "Πίσω στο σχολείο {rel}",
    holidays_rel: "Διακοπές {rel}",
    day_of: "Μέρα {n} από {total}",
    loading: "Φόρτωση…",
    no_source: "Δεν βρέθηκε πηγή. Ρυθμίστε την ενσωμάτωση Workday ή Holiday, ένα ημερολόγιο σχολικών διακοπών ή το Pronote, ή δώστε στην κάρτα τις οντότητές της.",
    tomorrow_school_at: "Αύριο: σχολείο στις {time}",
    tomorrow_school: "Αύριο: σχολείο",
    tomorrow_no_school: "Αύριο δεν έχει σχολείο",
    opt_title: "Τίτλος (προαιρετικός)",
    opt_workday: "Αισθητήρας Workday",
    opt_school_holidays: "Ημερολόγιο σχολικών διακοπών",
    opt_public_holidays: "Ημερολόγιο αργιών",
    opt_school_days: "Σχολικές μέρες",
    opt_show_title: "Εμφάνιση τίτλου",
    opt_show_subtitle: "Εμφάνιση υπότιτλου",
    opt_show_children: "Εμφάνιση παιδιών (Pronote)",
    opt_show_holidays: "Εμφάνιση σχολικών διακοπών",
    opt_show_public_holidays: "Εμφάνιση αργιών",
    opt_show_countdown: "Εμφάνιση αντίστροφης μέτρησης διακοπών",
    opt_language: "Γλώσσα",
    opt_zoom: "Κουμπί λεπτομερειών",
    help_workday: "Δυαδικός αισθητήρας της ενσωμάτωσης Workday (αν είναι κενό, βρίσκεται αυτόματα)",
    help_school_holidays: "Ημερολόγιο σχολικών διακοπών, π.χ. το ICS του γαλλικού υπουργείου Παιδείας στο Remote calendar (αν είναι κενό, βρίσκεται αυτόματα)",
    help_public_holidays: "Ημερολόγιο της ενσωμάτωσης Holiday (αν είναι κενό, βρίσκεται αυτόματα)",
    help_school_days: "Μέρες με σχολείο (αν είναι κενό, οι μέρες του αισθητήρα Workday)",
    help_zoom: "Κουμπί πάνω δεξιά που αλλάζει τη μίνι κάρτα στην πλήρη κάρτα και πίσω",
    lang_auto: "Αυτόματα",
    zoom_in: "Εμφάνιση πλήρους κάρτας",
    zoom_out: "Εμφάνιση συμπαγούς κάρτας",
    waste_tonight: "{type} απόψε",
    waste_title: "Αποκομιδή απορριμμάτων αύριο",
    birthday_title: "Γενέθλια",
    saint_title: "Ονομαστική εορτή",
    opt_show_waste: "Εμφάνιση αποκομιδής απορριμμάτων",
    opt_show_birthdays: "Εμφάνιση γενεθλίων",
    opt_show_saint: "Εμφάνιση ονομαστικής εορτής (άγιος)",
    opt_waste: "Ημερολόγια αποκομιδής απορριμμάτων",
    opt_birthdays: "Ημερολόγια γενεθλίων",
    help_waste: "Ημερολόγια αποκομιδής απορριμμάτων, όπως του Waste Collection Schedule (βρίσκονται αυτόματα αν μείνει κενό)",
    help_birthdays: "Ημερολόγια με ένα συμβάν ανά γενέθλια, με το έτος γέννησης για την ηλικία (βρίσκονται αυτόματα αν μείνει κενό)",
  },
};


// ---------------------------------------------------------------------------
// Icons (Material Design Icons, 24 × 24)
// ---------------------------------------------------------------------------

const ICONS = {
  // mdiBagPersonal: the card's own badge, and the picture of a school day.
  bag: "M16,5V4A2,2 0 0,0 14,2H10A2,2 0 0,0 8,4V5A4,4 0 0,0 4,9V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V9A4,4 0 0,0 16,5M10,4H14V5H10V4M12,9L14,11L12,13L10,11L12,9M18,16H9V18H8V16H6V15H18V16Z",
  holidays:
    "M15,18.54C17.13,18.21 19.5,18 22,18V22H5C5,21.35 8.2,19.86 13,18.9V12.4C12.16,12.65 11.45,13.21 11,13.95C10.39,12.93 9.27,12.25 8,12.25C6.73,12.25 5.61,12.93 5,13.95C5.03,10.37 8.5,7.43 13,7.04V7A1,1 0 0,1 14,6A1,1 0 0,1 15,7V7.04C19.5,7.43 22.96,10.37 23,13.95C22.39,12.93 21.27,12.25 20,12.25C18.73,12.25 17.61,12.93 17,13.95C16.55,13.21 15.84,12.65 15,12.39V18.54M7,2A5,5 0 0,1 2,7V2H7Z",
  public_holiday:
    "M14.53 1.45L13.45 2.53L15.05 4.13C15.27 4.38 15.38 4.67 15.38 5S15.27 5.64 15.05 5.86L11.5 9.47L12.5 10.55L16.13 6.94C16.66 6.35 16.92 5.7 16.92 5C16.92 4.3 16.66 3.64 16.13 3.05L14.53 1.45M10.55 3.47L9.47 4.55L10.08 5.11C10.3 5.33 10.41 5.63 10.41 6S10.3 6.67 10.08 6.89L9.47 7.45L10.55 8.53L11.11 7.92C11.64 7.33 11.91 6.69 11.91 6C11.91 5.28 11.64 4.63 11.11 4.03L10.55 3.47M21 5.06C20.31 5.06 19.67 5.33 19.08 5.86L13.45 11.5L14.53 12.5L20.11 6.94C20.36 6.69 20.66 6.56 21 6.56S21.64 6.69 21.89 6.94L22.5 7.55L23.53 6.47L22.97 5.86C22.38 5.33 21.72 5.06 21 5.06M7 8L2 22L16 17L7 8M19 11.06C18.3 11.06 17.66 11.33 17.06 11.86L15.47 13.45L16.55 14.53L18.14 12.94C18.39 12.69 18.67 12.56 19 12.56C19.33 12.56 19.63 12.69 19.88 12.94L21.5 14.53L22.55 13.5L20.95 11.86C20.36 11.33 19.7 11.06 19 11.06Z",
  day_off:
    "M12.5 7C12.5 5.89 13.39 5 14.5 5H18C19.1 5 20 5.9 20 7V9.16C18.84 9.57 18 10.67 18 11.97V14H12.5V7M6 11.96V14H11.5V7C11.5 5.89 10.61 5 9.5 5H6C4.9 5 4 5.9 4 7V9.15C5.16 9.56 6 10.67 6 11.96M20.66 10.03C19.68 10.19 19 11.12 19 12.12V15H5V12C5 10.9 4.11 10 3 10S1 10.9 1 12V17C1 18.1 1.9 19 3 19V21H5V19H19V21H21V19C22.1 19 23 18.1 23 17V12C23 10.79 21.91 9.82 20.66 10.03Z",
  unknown: "M7,10H12V15H7M19,19H5V8H19M19,3H18V1H16V3H8V1H6V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z",
  calendar_star:
    "M19 19H5V8H19M16 1V3H8V1H6V3H5C3.9 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H19C20.11 21 21 20.11 21 19V5C21 3.9 20.11 3 19 3H18V1M10.88 12H7.27L10.19 14.11L9.08 17.56L12 15.43L14.92 17.56L13.8 14.12L16.72 12H13.12L12 8.56L10.88 12Z",
  // mdiTrashCanOutline, mdiCakeVariantOutline, mdiFlowerOutline: the bins, birthdays and name day chips.
  trash: "M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z",
  cake: "M12 6C13.11 6 14 5.1 14 4C14 3.62 13.9 3.27 13.71 2.97L12 0L10.29 2.97C10.1 3.27 10 3.62 10 4C10 5.1 10.9 6 12 6M18 9H13V7H11V9H6C4.34 9 3 10.34 3 12V21C3 21.55 3.45 22 4 22H20C20.55 22 21 21.55 21 21V12C21 10.34 19.66 9 18 9M19 20H5V17C5.9 17 6.76 16.63 7.4 16L8.5 14.92L9.56 16C10.87 17.3 13.15 17.29 14.45 16L15.53 14.92L16.6 16C17.24 16.63 18.1 17 19 17V20M19 15.5C18.5 15.5 18 15.3 17.65 14.93L15.5 12.8L13.38 14.93C12.64 15.67 11.35 15.67 10.61 14.93L8.5 12.8L6.34 14.93C6 15.29 5.5 15.5 5 15.5V12C5 11.45 5.45 11 6 11H18C18.55 11 19 11.45 19 12V15.5Z",
  flower: "M8.66,13.07C6.92,13.07 5.5,11.66 5.5,9.93C5.5,9.22 5.76,8.54 6.19,8C5.77,7.46 5.5,6.78 5.5,6.07C5.5,4.34 6.93,2.93 8.66,2.93L9.09,2.96C9.56,1.81 10.69,1 12,1C13.31,1 14.44,1.81 14.91,2.96L15.34,2.93C17.07,2.93 18.5,4.34 18.5,6.07C18.5,6.78 18.24,7.46 17.81,8C18.23,8.54 18.5,9.22 18.5,9.93C18.5,11.66 17.07,13.07 15.34,13.07L14.91,13.04C14.44,14.19 13.31,15 12,15C10.69,15 9.56,14.19 9.09,13.04L8.66,13.07M12,13C12.62,13 13.12,12.5 13.14,11.9L13.03,10.81C12.71,10.93 12.36,11 12,11C11.64,11 11.3,10.93 11,10.81L10.86,11.9C10.88,12.5 11.38,13 12,13M15.34,11.07C15.97,11.07 16.5,10.56 16.5,9.92C16.5,9.5 16.23,9.08 15.83,8.89L14.95,8.47C14.83,9.21 14.44,9.85 13.89,10.3L14.7,10.87C14.88,11 15.1,11.07 15.34,11.07M14.69,5.13L13.87,5.69C14.43,6.14 14.82,6.78 14.94,7.5L15.82,7.1C16.23,6.9 16.5,6.5 16.5,6.07C16.5,5.44 15.97,4.93 15.34,4.93C15.11,4.93 14.89,5 14.69,5.13M12,3C11.38,3 10.88,3.5 10.86,4.1L11,5.19C11.3,5.07 11.64,5 12,5C12.36,5 12.71,5.07 13.03,5.19L13.14,4.1C13.12,3.5 12.62,3 12,3M8.66,4.93C8.03,4.93 7.5,5.44 7.5,6.07C7.5,6.5 7.77,6.9 8.17,7.1L9.05,7.5C9.17,6.78 9.56,6.14 10.11,5.69L9.3,5.13C9.12,5 8.9,4.93 8.66,4.93M8.17,8.9C7.77,9.1 7.5,9.5 7.5,9.92C7.5,10.55 8.03,11.06 8.66,11.06C8.89,11.06 9.11,11 9.31,10.86L10.12,10.31C9.56,9.86 9.17,9.22 9.05,8.5L8.17,8.9M12,22A9,9 0 0,1 3,13A9,9 0 0,1 12,22A9,9 0 0,1 21,13A9,9 0 0,1 12,22M14.44,19.56C16.34,18.85 17.85,17.34 18.56,15.44C16.66,16.14 15.15,17.66 14.44,19.56M5.44,15.44C6.15,17.34 7.66,18.85 9.56,19.56C8.86,17.66 7.34,16.15 5.44,15.44Z",
  expand: "M10,21V19H6.41L10.91,14.5L9.5,13.09L5,17.59V14H3V21H10M14.5,10.91L19,6.41V10H21V3H14V5H17.59L13.09,9.5L14.5,10.91Z",
  collapse: "M19.5,3.09L15,7.59V4H13V11H20V9H16.41L20.91,4.5L19.5,3.09M4,13V15H7.59L3.09,19.5L4.5,20.91L9,16.41V20H11V13H4Z",
};

// ---------------------------------------------------------------------------
// Kinds of day, options
// ---------------------------------------------------------------------------

// Kinds of day, the classes of their colors (k-<kind>) and pictures.
const KINDS = ["school", "weekend", "public_holiday", "holidays", "day_off", "unknown"];
const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const DEFAULT_SCHOOL_DAYS = ["mon", "tue", "wed", "thu", "fri"];
// Events of a school holidays calendar that are not holidays for the pupils: the ministry's ICS has a teachers'
// pre-term day ("Vacances d'Été (prérentrée Enseignants)") inside the summer holidays.
const DEFAULT_IGNORE = "enseignant|prérentrée|teacher";
// The calendars are read for this window around today: the summer holidays (two months) are seen from their start.
const PAST_DAYS = 100;
const AHEAD_DAYS = 400;
const CALENDAR_REFRESH_MS = 6 * 3600e3;

// Saints of each day, from the open data set "Les saints et fêtes du calendrier" (data.gouv.fr, Licence Ouverte /
// Open Licence: https://www.data.gouv.fr/datasets/les-saints-et-fetes-du-calendrier), one month per entry, days split
// by "|", the saints of a day by ";". Fixed from the file of 2024-09-07: May and June put back in place (they are
// swapped there, June with a 31st), broken accents and typos corrected, and on each day the saint of the traditional
// French calendar of name days moved first when the data set has it (it gives the saints in alphabetical order). These
// are the liturgical saints: the name days to wish (NAME_DAYS, below) are often not among them.
const SAINTS = [
  "Jour de l'an;Ste Marie Mère de Dieu;Ste Euphrosine;St Odilon|St Basile le Grand;St Adélard (ou Adalhard);St Grégoire de Nazianze (le Jeune);St Macaire le Jeune|Ste Geneviève;Ste Bertille;St Daniel|Ste Angèle de Foligno;St Grégoire de Langres;St Marcien;St Robert de Reims|Ste Emilienne;St Télesphore|St Melaine de Rennes;St Balthazar;St Gaspard;St Guérin;St Melchior|St Raymond de Penyafort;St Aldric;St Canut Lavard;St Reynold|St Lucien;Ste Gudule|St Adrien de Canterbury;St Julien l'Hospitalier|St Guillaume de Bourges;Ste Séthride|Ste Fidelmie;St Théodose le Cénobiarque|St Arcade;Ste Césarie;Ste Tatienne (ou Tatiana)|St Hilaire de Poitiers;St Léonce de Césarée|St Engelmar;St Félix de Nole;Ste Macrine l'Ancienne|St Paul l'Ermite;Ste Tarcice|St Marcel 1er|St Antoine le Grand;St Sulpice le Pieux|Ste Prisque (ou Prisca);Ste Thècle|St Canut;Ste Messaline;Ste Pia|St Sébastien;St Fabien|Ste Agnès de Rome;St Fructueux|St Vincent Pallotti;St Vincent, Diacre|St Barnard;Ste Erémentienne;St Ildefonse de Tolède;Ste Lufthilde|St François de Sales|Conversion de St Paul|St Timothée;St Tite|Ste Angèle de Mérici;St Julien du Mans|St Callinique;Ste Cannera|St Gildas le Sage;St Valère;St Sulpice|Ste Martine;Ste Aldegonde;Ste Hyacinthe de Mariscotti|Ste Marcelle;St Cyrus;St Eusèbe, ermite;St Jean Bosco;St Zotique",
  "Ste Brigitte de Kildare;St Jean de la Grille;St Sévère de Ravenne|St Adalbaud;Chandeleur;Ste Hadéloge|St Blaise de Sébaste;St Anschaire|St André Corsini;St Gilbert de Sempringham;Ste Jeanne de Valois|Ste Agathe de Catane|Ste Dorothée;St Paul Miki|Ste Julienne de Bologne;St Chryseuil|St Jean de Matha;St Jérôme Emiliani|Ste Apolline|Ste Scholastique|Notre-Dame de Lourdes;St Adolphe|Ste Eulalie de Barcelone|Ste Béatrice d'Ornacieux;St Polyeucte|St Valentin;St Méthode|St Faustin;St Jovite|Ste Julienne de Nicomédie;St Onésime|St Polychrone;St Théodule|St Claude;St Flavien de Constantinople;St Fructule;Ste Gertrude Comensoli|St Gabin de Rome;St Boniface de Lausanne;St Conrad de Plaisance|Ste Aimée|St Pierre Damien|Chaire St Pierre Apôtre;Ste Marguerite de Cortone|St Lazare;St Polycarpe de Smyrne|St Modeste;Ste Primitive|St Césaire de Nazianze;St Tarasius;Ste Walburge|St Nestor;St Alexandre|Ste Honorine;St Gabriel de l'Addolorata|St Romain de Condat;St Hilaire, pape;St Théophile d'Adana|St Oswald de Worcester",
  "St Albin d'Anvers;St Charles le bon;St Guénolé;Ste Cunégonde|St Siméon le Juste|Ste Cunégonde|St Casimir|Ste Olive;St Eusèbe de Crémone;St Jean-Joseph de la Croix;St Théophile de Césarée|Ste Colette de Corbie;Ste Agnès de Bohème;St Chrodegang (ou Rotgang);St Fridolin|Ste Félicité;Ste Perpétue;St Révocat;St Saturnin;St Secondule;St Thomas D'Aquin|St Jean de Dieu;St Julien de Tolède|Ste Françoise Romaine;Ste Catherine de Bologne;St Dominique Savio;St Grégoire de Nysse|St Crescent;St Droctovée|St Euloge de Cordoue;St Euthyme de Sardes|St Maximilien de théveste;Ste Séraphine|Ste Euphrasie;St Roderick|Ste Mathilde|Ste Louise de Marillac;St Longin|Ste Eusébie;St Héribert|Ste Gertrude de Nivelle;St Patrick d'Irlande|St Cyrille de Jérusalem|St Joseph|St Herbert;St Rémy de Strasbourg;St Wulfran|St Birillus;St Endée;St Philémon|Ste Léa;St Octavien|St Victorien;St Toribio de Mogrovejo|Ste Catherine de Suède;St Pigmène;St Romule|St Dismas;St Humbert|St Bathuse;St Dizier;St Emmanuel|St Jean d'Egypte;St Rupert de Salzbourg|St Gontran, roi de Bourgogne;Ste Gundelinde|Ste Gladys;St Ludolphe|St Amédée IX;St Jean Climaque|St Benjamin;Ste Balbine",
  "St Hugues de Grenoble;Ste Catherine Thomas|St François de Paule;Ste Théodosie;St Urbain de Langres|St Richard de Chichester;Ste Agape|St Isidore de Séville;St Benoît Le More|Ste Ethelburge;St Gérard de Sauve-Majeure;St Vincent Ferrier|St Marcellin de Carthage;St Amand;Ste Modérate|St Jean Baptiste de la Salle;St Hégésippe|Ste Julie Billart;St Hérodion|St Gautier;St Marcel;Ste Marie de Cléophas|St Fulbert;St Badème;St Ezéchiel|St Stanislas;Ste Gemma Galgani|St Jules 1er;St Wigbert|St Hermenegild;St Martin 1er|St Maxime;Ste Lidwine;St Valérien|St Paterne;Ste Anastasie;Ste Basilisse|St Benoît-Joseph Labre;Ste Bernadette Soubirous;St Crémence;St Drogon;Ste Encratide|St Anicet;St Hermogène;St Wandon|St Parfait;St Eleuthère|St Expédit;St Ursmer|Ste Agnès de Monte Pulciano;Ste Hildegonde;St Théodore Trichinas;St Théotime le Philosophe|St Anselme de Cantorbéry;St Conrad de Parhzam|St Alexandre;St Caïus;Ste Léonide;St Soter;Ste Tarbula|St Georges de Lydda;St Fortunat;Ste Pusinne|St Fidèle de Sigmaringen;Ste Beuve|St Marc, apôtre;St Phébade|St Clet (ou Anaclet);Ste Exupérance;St Marcellin|Ste Zita;St Anthime|St Pierre Chanel;Ste Prudence;St Vital de Milan|Ste Catherine de Sienne;St Pierre de Vérone|St Pie V;Ste Sophie",
  "St Joseph;Ste Panacée;St Sigismond|St Athanase d'Alexandrie;St Célestin;Ste Zoé|St Philippe, apôtre;Ste Adalsinde;St Alexandre 1er, pape;St Jacques le Mineur, apôtre;St Juvénal de Narni|St Florian;St Godard;St Silvain|St Ange de Jérusalem;Ste Jutta;St Pérégrin|Ste Bénédicte;St Héliodore|Ste Augustin de Nicomédie;St Sérène;St Villain|St Désiré, évêque de Bourges;St Hellade d'Auxerre;St Wiron|St Béat;St Géronce|Ste Solange;St Antonin;St Isidore le Laboureur|St Gengoul;St Mayeul;St Mamert|St Achilée;St Nérée;St Pancrace;Ste Rictrude|Ste Glycérie;St Mael;St Servais|St Matthias|Ste Denise;Ste Césarie;St Crésiphon|St Honorat d'Amiens;St Jean Népomucène;St Ubald Baldassini|St Pascal Baylon;St Adrion;St Héradius|St Eric;St Félix de Cantalice;St Jean 1er;Ste Juliette d'Ancyre;St Venance|St Yves de Kermartin;St Pierre Célestin;Ste Pudentienne|St Bernardin de Sienne;Ste Plautilla|St Constantin 1er le Grand;St Nicostrate;St Théopompe|St Emile;Ste Julie;Ste Rita de Cascia|St Eutyche;St Mercurial;St Yves de Chartres|St Donatien;St Rogatien|St Bède le Vénérable;St Grégoire VII;St Injurieux;Ste Marie-Madeleine de Pazzi|St Bérenger;St Philippe de Néri|St Augustin de Cantorbéry;St Ranulphe;Ste Restitute|St Germain de Paris;St Chéron|St Conon;St Martyrius;St Maximin de Trèves;St Sisinnius|St Ferdinand III;Ste Emmélie de Césarée;Ste Jeanne D'Arc|Ste Pétronille",
  "St Justin le Philosophe;St Caprais;St Clair;St Marcellin;St Pierre|Ste Blandine;St Erasme;St Eugène 1er;St Marcellin;St Pothin;St Sadoc|St Kévin;St Charles Lwanga;Ste Clotilde|Ste Burienne;St François de Caracciolo;St Métrophane;St Quirin;St Rutilus|St Boniface;St Dorothée de Tyr;St Dorothée l'Archimandrite;St Dorothée le Jeune;Ste Marcia;Ste Valérie|St Norbert de Xanten;St Bertrand;St Marcellin Champagnat;Ste Pauline|St Mériadec;Ste Potamienne la Jeune|St Médard de Noyon;Ste Eustadiole;Ste Mélanie l'Ancienne|St Cumian;St Ephrem le Syrien;St Félicien;St Prime|St Landry;St Bogomile;St Gétule|St Barnabé, apôtre;St Hérébald|St Guy;St Gaspard Bertoni;St Gerbaud|St Antoine de Padoue;Ste Aquiline;St Fandilas;St Pérégrin;St Triphyllius|St Elisée;St Rufin;St Valère|Ste Germaine Cousin;Ste Bénilde;Ste Eutrope|St Cyr;Ste Lutgarde;St Simplice de Bourges|St Hervé;St Raynier|St Léonce de Tripoli;St Amand de Bordeaux|St Romuald;St Gervais;St Innocent|Ste Florence;Ste Hélène;St Sylvère|St Aloysius de Gonzague (ou Louis);St Démétrie;St Eusèbe de Samosate;St Radulphe|St Jean Fisher;St Paulin de Nole;St Thomas Moore|Ste Etheldrède;St Libert|Jean le Baptiste (naissance de)|St Prosper;St Adalbert d'Egmond;Ste Fébronie;St Gallican;St Guillaume d'Orange, dit le Grand;St Maxime de Turin;St Molock;Sts Salomon Ier et Salomon III|St Anthelme de Chignin;St Baboléin;St Maxence;Ste Persévérande|St Cyrille d'Alexandrie;St Ferdinand d'Aragon;St Ladislas|St Irénée de Lyon|St Pierre, apôtre;St Paul, apôtre|St Martial de Limoges;Ste Clotsende;Ste Erentrude;Premiers martyrs de Rome",
  "St Domitien;St Gall de Clermont;St Théodoric (ou Thierry)|St Martinien;Ste Monégonde;St Othon de Bamberg;Ste Symphorose|St Thomas, apôtre;St Anatole|Ste Berthe;Ste Elisabeth du Portugal|St Antoine-Marie Zaccaria;St Blanche;St Modivène|Ste Dominique;Ste Lucie;Ste Maria Goretti|St Félix de Nantes;St Prosper d'Aquitaine|St Edgar le Pacifique;Ste Landrade;Ste Priscilla;St Procope;St Withburge|Ste Evrilde;Ste Procule;Ste Véronique Giuliani|Ste Rufine;Ste Seconde|St Benoît de Nursie;St Hidulphe;St Jean de Bergame;Ste Olga de Russie;St Pie 1er;St Savin (ou Sabin)|St Jean Gualbert;Ste Marcienne;St Nabor;Ste Véronique|St Henri II de Germanie;St Joël|St Camille de Lellis|St Donald;St Bonaventure|Ste Marie-Madeleine Postel|St Alexis;St Ennode;St Léon IV;Ste Marcelline|St Frédéric;St Arnoul de Metz|St Arsène le Grand;Ste Macrine la Jeune;Ste Marie d'Espagne|St Joseph Barsabas;Ste Marguerite d'Antioche;Ste Sévère|St Laurent de Brindisi;Ste Praxède|Ste Marie-Madeleine;Ste Wandrille|Ste Brigitte de Suède;St Apollinaire|Ste Christine de Bolsène;St Wulfhad|St Jacques, dit le Majeur;St Christophe;Ste Valentine|Ste Anne;St Joachim|St Désiré;Ste Natalie;St Panthaléon|St Samson;St Botwin;St Nazaire;St Victor 1er|Ste Marthe de Béthanie|Ste Juliette de Césarée;St Pierre Chrysologue|St Ignace de Loyola;St Germain d'Auxerre",
  "St Alphonse-Marie de Liguori;Ste Almède;St Exupère|St Eusèbe de Verceil|Ste Lydie la Pourpre|St Jean-Marie Baptiste Vianney|St Abel;St Memmius;St Oswald|Transfiguration;St Sixte II|St Gaétan;St Albert;St Donat|St Dominique de Guzman;St Cyriaque|St Amour (ou Amor)|St Laurent De Rome;St Blain;St Deusdedit (ou Dieudonné)|Ste Claire D'Assise;Ste Suzanne|St Euplius;Ste Julienne|Ste Concordia;St Jean Berchmans;Ste Radegonde|St Eusèbe de Rome;St Hippolyte;St Maximien Kolbe;Ste Radegonde|Assomption (Fête de Marie);St Alfred;St Eusèbe;St Tarcisius|St Armagillus;St Etienne de Hongrie;St Frimbaud;St Roch|St Hyacinthe|Ste Hélène;St Agapet|St Jean Eudes|St Bernard de Clairvaux|St Pie X|St Fabrice;St Philibert;St Symphorien|Ste Rose de Lima|St Barthélémy;St Ouen|St Louis IX de France;St Joseph de Calsanz|St Zéphirin|Ste Monique|St Augustin;St Julien de Brioude|Ste Sabine|St Fiacre|St Aristide;St Raymond Nonnat",
  "St Gilles;Ste Vérène|St Agricole;St Concorde;St Elpide|St Grégoire 1er, dit le Grand;St Siméon stylite le Jeune|Ste Rosalie;St Boniface 1er;St Calétric;St Vitalique|St Bertin;St Laurent Justinien|St Bertrand de Garrigues;St Eustache|Ste Reine;St Cloud|St Adrien;Naissance de Marie|St Gorgon;St Omer;St Pierre Claver;St Tiburce|St Aubert;St Nicolas de Tolentino;Ste Pulchérie Auguste|St Adelphe;St Patient;St Protus|St Autonome;St Curonote;St Théodule|St Aimé;St Israël;St Jean Chrysostome;St Macrobe;St Nectaire|Croix Glorieuse;St Céréal;St Général;St Materne|St Alfred le Grand;St Nicomède|Ste Edith de Wilton;St Corneille;St Cyprien;St Victor III|Ste Hildegarde;St Lambert|St Hygbald;St Joseph de Cupertino;Ste Richarde|Ste Emilie de Rodat;Ste Constancia;St Janvier;St Théodore de Tarse|St André Kim;St Eustache;St Jacques Chastan;St Laurent Imbert;St Pierre Maubant|St Matthieu, apôtre|Ste Salaberge;St Thomas de Villeneuve|St Constance;St Lin|St Cuniald;St Isarne de Toulouse|St Hermann le Boîteux;St Cléophas;St Firmin 1er Damien|St Côme;St Damien|St Vincent de Paul|St Annemond;Ste Eustochium;St Wanceslas|St Michel;St Gabriel;St Gudélie;St Raphael|St Jérôme;St Grégoire l'Illuminateur;St Léopard",
  "Ste Thérèse de Lisieux|St Léger|St Gérard de Brogne;St Ewald|St François d'Assise;St Aurée|Ste Flavie;St Placide|St Bruno de Cologne|St Serge;N. Dame du Rosaire|Ste Pélagie la Pénitente|St Denis, évêque de Paris;St Dominin;St Eleuthère;St Jean Léonardi;St Rustique|Ste Eulampie;St François de Borgia;St Gédéon|St Firmin d'Uzès;St Anastase 1er;Ste Zénaïde|St Wilfried;St Pantale;St Séraphin du Mont Granario|St Géraud d'Aurillac;St Théophile d'Antioche|St Juste de Lyon;St Calixte 1er|Ste Thérèse d'Avilla;St Agilée|St Bertrand de Comminges;Ste Eremberte;St Gall;St Gérard Magella;Ste Hedwige;Ste Marguerite-Marie Alacoque|St Ignace de Constantinople|St Luc, apôtre;Ste Gwendolène;Ste Tryphonie|St René Goupil;St Isaac Jogues;St Jean de Bréboeuf;St Paul de la croix;St Pierre d'Alcantara|Ste Adeline;Ste Irène|Ste Céline (ou Cilinia);St Hilarion;Ste Ursule|St Philippe;St Vallier|St Jean de Capistran;St Hyacinthe|St Antoine-Marie Claret|St Crépin (ou Crispin);St Chrysanthe;Ste Darie|St Evariste;St Rustique|Ste Antoinette;Ste Frumence|St Simon le Cananéen;St Cyrille;St Jude|St Narcisse|St Alphonse Rodriguez|St Quentin;St Foillan",
  "Toussaint (tous les saints);St Austremoine;St Floribert;St Mathurin|Défunts;St Anempodiste;St Elpidephore|St Hubert;St Gwénaël;St Martin de Porrès|St Charles Borromée;St Porphyre|Ste Elisabeth (mère de Jean-Baptiste);St Zacharie (père de Jean-Baptiste)|St Léonard de Noblac|Ste Carine;St Ernest;St Florent de Strasbourg;St Willibrord|St Geoffroy (ou Godefroy);St Maur|St Théodore le Tiron|St Léon le Grand;St André Avellin;St Tryphon|St Martin de Tours;St Théodore le Studite|St Christin;St Josaphat|St Brice;St Didace;St Nicolas 1er le Grand|St Saens;St Sérapion|St Albert le Grand|Ste Marguerite d'Ecosse;Ste Gertrude la Grande|Ste Elisabeth de Hongrie;St Aignan;St Grégoire le Thaumaturge|St Hésyque d'Antioche;St Mummole;St Pierre, apôtre;St Tanguy|Ste Ermenburge;St Exupère|St Edmond;St Félix de Valois;St Octave|Ste Amalberge;Présence de Marie|Ste Cécile;Ste Appia;St Philémon|St Clément 1er|Ste Flora;St Chrysogone;Ste Maria;St Romain du Mans|Ste Catherine d'Alexandrie;Ste Joconde;St Moïse|Ste Delphine;St Conrad de Constance;St Gautier d'Aulne|St Séverin;St Maxime de Riez|St Jacques de la Marche;Ste Catherine Labouré;St Sosthène|St Saturnin;St Hilaire;Ste Illuminée|St André, apôtre;Ste Justine",
  "St Diodore;St Eloi|Ste Viviane (ou Bibiane);Ste Aurélie|St François-Xavier|Ste Barbe;St Jean Damascène|St Gérard;St Nicet;St Sabbas|St Nicolas de Myre|St Ambroise de Milan;St Agathon|Immaculée conception;Ste Gonthilde;St Romaric|St Pierre Fourier;Ste Léocadie|St Miltiade|St Daniel le Stylite;St Damasse 1er|Ste Jeanne-Françoise de Chantal|Ste Lucie de Syracuse;St Josse de Bretagne;Ste Odile|St Jean de la Croix|Ste Ninon;Ste Marie Crucifiée de Rose|Ste Adélaïde;St Adon|St Calanique;St Judicaël;Ste Olympiade|St Gatien;St Zozime|St Urbain IV;St Nemèse|St Théophile;St Ammon|St Pierre Casinius;St Dioscore;St Honorat de Toulouse;St Thémistocle|Ste Françoise-Xavière Cabrini;St Flavien;St Zénon|Ste Anatolie;St Servule;Ste Victoire|Ste Adèle;St Delphin;Ste Irmine;St Métrobe|Noël;Ste Adalsinde;Ste Alburge|St Etienne de Protomartyr;St Denys|St Jean l'Evangéliste, apôtre|Sts Innocents|St David;St Thomas Becket|St Sabin (ou Sabinien)|St Sylvestre;Ste Colombe de Sens;Ste Mélanie la Jeune;St Potentin"
].map((m) => m.split("|").map((d) => d.split(";")));
// Name days of the traditional French calendar (the "fêtes à souhaiter"), one month per entry, one day per name: a
// plain name is a saint (St), "*" a female saint (Ste), "+" several (Sts), "!" a feast. The chip shows them; its
// tooltip lists the saints of the day from the data set above.
const NAME_DAYS = [
  "!Jour de l'An|Basile|*Geneviève|Odilon|Édouard|Mélaine|Raymond|Lucien|*Alix|Guillaume|Paulin|*Tatiana|*Yvette|*Nina|Rémi|Marcel|*Roseline|*Prisca|Marius|Sébastien|*Agnès|Vincent|Barnard|François de Sales|!Conversion de saint Paul|*Paule|*Angèle|Thomas d'Aquin|Gildas|*Martine|*Marcelle",
  "*Ella|!Présentation du Seigneur|Blaise|*Véronique|*Agathe|Gaston|*Eugénie|*Jacqueline|*Apolline|Arnaud|!Notre-Dame de Lourdes|Félix|*Béatrice|Valentin|Claude|*Julienne|Alexis|*Bernadette|Gabin|*Aimée|Pierre Damien|*Isabelle|Lazare|Modeste|Roméo|Nestor|*Honorine|Romain|Auguste",
  "Aubin|Charles le Bon|Guénolé|Casimir|*Olive|*Colette|*Félicité|Jean de Dieu|*Françoise|Vivien|*Rosine|*Justine|Rodrigue|*Mathilde|*Louise|*Bénédicte|Patrice|Cyrille|Joseph|Herbert|*Clémence|*Léa|Victorien|*Catherine de Suède|!Annonciation|*Larissa|Habib|Gontran|*Gwladys|Amédée|Benjamin",
  "Hugues|*Sandrine|Richard|Isidore|*Irène|Marcellin|Jean-Baptiste de La Salle|*Julie|Gautier|Fulbert|Stanislas|Jules|*Ida|Maxime|Paterne|Benoît-Joseph|Anicet|Parfait|*Emma|*Odette|Anselme|Alexandre|Georges|Fidèle|Marc|*Alida|*Zita|*Valérie|*Catherine de Sienne|Robert",
  "!Fête du Travail|Boris|+Philippe et Jacques|Sylvain|*Judith|*Prudence|*Gisèle|Désiré|Pacôme|*Solange|*Estelle|Achille|*Rolande|Matthias|*Denise|Honoré|Pascal|Éric|Yves|Bernardin|Constantin|Émile|Didier|Donatien|*Sophie|Bérenger|Augustin de Cantorbéry|Germain|Aymar|Ferdinand|!Visitation",
  "Justin|*Blandine|Kévin|*Clotilde|Igor|Norbert|Gilbert|Médard|*Diane|Landry|Barnabé|Guy|Antoine de Padoue|Élisée|*Germaine|Jean-François Régis|Hervé|Léonce|Romuald|Silvère|Rodolphe|Alban|*Audrey|Jean-Baptiste|Prosper|Anthelme|Fernand|Irénée|+Pierre et Paul|Martial",
  "Thierry|Martinien|Thomas|Florent|Antoine|*Mariette|Raoul|Thibaut|*Amandine|Ulrich|Benoît|Olivier|+Henri et Joël|!Fête nationale|Donald|!Notre-Dame du Mont-Carmel|*Charlotte|Frédéric|Arsène|*Marina|Victor|*Marie-Madeleine|*Brigitte|*Christine|Jacques|+Anne et Joachim|*Nathalie|Samson|*Marthe|*Juliette|Ignace de Loyola",
  "Alphonse|Julien Eymard|*Lydie|Jean-Marie Vianney|Abel|!Transfiguration|Gaétan|Dominique|Amour|Laurent|*Claire|*Clarisse|Hippolyte|Evrard|!Assomption|Armel|Hyacinthe|*Hélène|Jean Eudes|Bernard|Christophe|Fabrice|*Rose de Lima|Barthélemy|Louis|*Natacha|*Monique|Augustin|*Sabine|Fiacre|Aristide",
  "Gilles|*Ingrid|Grégoire|*Rosalie|*Raïssa|Bertrand|*Reine|!Nativité de Marie|Alain|*Inès|Adelphe|Apollinaire|Aimé|!Croix glorieuse|Roland|*Édith|Renaud|*Nadège|*Émilie|Davy|Matthieu|Maurice|Constant|*Thècle|Hermann|+Côme et Damien|Vincent de Paul|Venceslas|+Michel, Gabriel et Raphaël|Jérôme",
  "*Thérèse de l'Enfant-Jésus|Léger|Gérard|François d'Assise|*Fleur|Bruno|Serge|*Pélagie|Denis|Ghislain|Firmin|Wilfried|Géraud|Juste|*Thérèse d'Avila|*Edwige|Baudouin|Luc|René|*Adeline|*Céline|*Élodie|Jean de Capistran|Florentin|Crépin|Dimitri|*Émeline|+Simon et Jude|Narcisse|*Bienvenue|Quentin",
  "!Toussaint|!Défunts|Hubert|Charles|*Sylvie|*Bertille|*Carine|Geoffroy|Théodore|Léon|Martin|Christian|Brice|Sidoine|Albert|*Marguerite|*Élisabeth|*Aude|Tanguy|Edmond|!Présentation de Marie|*Cécile|Clément|*Flora|*Catherine|*Delphine|Séverin|Jacques de la Marche|Saturnin|André",
  "*Florence|*Viviane|François-Xavier|*Barbara|Gérald|Nicolas|Ambroise|!Immaculée Conception|Pierre Fourier|Romaric|Daniel|*Jeanne-Françoise de Chantal|*Lucie|*Odile|*Ninon|*Alice|Gaël|Gatien|Urbain|Théophile|Pierre Canisius|*Françoise-Xavière|Armand|*Adèle|!Noël|Étienne|Jean|!Saints Innocents|David|Roger|Sylvestre",
].map((m) => m.split("|"));
/** The name day of a day ("YYYY-MM-DD"): { name ("St Martin", "Ste Cécile", "Sts Pierre et Paul", "Toussaint"),
 *  all (the saints of the day, from the data set) }, or null. */
const saintOf = (key) => {
  const m = Number(key.slice(5, 7)) - 1;
  const d = Number(key.slice(8, 10)) - 1;
  const raw = NAME_DAYS[m]?.[d];
  if (!raw) return null;
  const prefix = { "*": "Ste ", "+": "Sts ", "!": "" }[raw[0]];
  return { name: prefix === undefined ? `St ${raw}` : prefix + raw.slice(1), all: SAINTS[m]?.[d] || [] };
};

// Bin collection calendars and birthday calendars, by integration or by name (any language the card speaks).
const WASTE_RE = /poubelle|d[ée]chet|ordure|collecte|encombrant|waste|trash|garbage|rubbish|recycl|m[üu]ll|abfall|basura|residuo|rifiut|afval|vuilnis|odpad|śmieci|smieci|gunoi|affald|sopor|soph[äa]mt|мусор|смітт|отпад|отпадъ|szemét|hulladék|atkritum|απορρ/i;
const BIRTHDAY_RE = /anniversaire|birthday|geburtstag|cumplea|compleann|verjaardag|anivers|urodzin|zi de na|f[øo]dselsdag|f[öo]delsedag|рожден|народжен|рођендан|rođendan|születésnap|narodenin|narozenin|rojstn|dzimšan|γενέθλ/i;
// The colour of a bin, from the words of its type: yellow (packaging), blue (paper), brown (food, garden), green
// (glass), grey (household waste), else the card's amber.
const BIN_COLORS = [
  ["yellow", /jaune|yellow|gelb|amarill|giall|geel|żółt|emballage|packag|verpack|recycl|plasti/i],
  ["blue", /bleu|blue|blau|azul|\bblu\b|blauw|papier|paper|papel|carta|carton|cardboard|karton/i],
  ["brown", /\bbio|compost|marron|brown|braun|marr[oó]n|organi|végétaux|vegetaux|garden|jardin|gft|food|alimentaire/i],
  ["green", /verre|glass|\bverts?\b|green|grün|gr[uü]n|verde|groen|glas|szkło|vidrio|vetro/i],
  ["gray", /ordure|household|ménag|menag|gris|grey|gray|noir|black|schwarz|restm|residu|general|rest\b/i],
];
const binColor = (type) => BIN_COLORS.find(([, re]) => re.test(type))?.[0] || "default";
// "Anniversaire de Léa", "Léa's birthday", "🎂 Léa (2017)" → "Léa".
const birthdayName = (summary) =>
  String(summary || "")
    .replace(/^[\p{Extended_Pictographic}\s]+/u, "")
    .replace(/^(anniversaire|birthday|geburtstag|cumpleaños|compleanno|verjaardag|aniversário|urodziny)\s*(de\s+|d['’]\s*|du\s+|of\s+|von\s+|van\s+|di\s+)?[:\-–]?\s*/iu, "")
    .replace(/(['’]s)?\s+(birthday|geburtstag)$/iu, "")
    .replace(/\s*\(?\b(19|20)\d{2}\)?\s*$/u, "")
    .trim() || String(summary || "").trim();
// The age on a birthday, from a birth year in the event (its title or description), or null.
const birthdayAge = (ev) => {
  const m = `${ev.summary} ${ev.description || ""}`.match(/\b(19|20)\d{2}\b/);
  const age = m ? Number(ev.start.slice(0, 4)) - Number(m[0]) : Number.NaN;
  return age > 0 && age < 130 ? age : null;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const lang = (hass, config) => {
  const l = config?.language || (hass && (hass.locale?.language || hass.language)) || "en";
  return STRINGS[l] ? l : STRINGS[l.split("-")[0]] ? l.split("-")[0] : "en";
};

// Locale for Intl: the card's language option, else Home Assistant's full locale (keeps its region) when its base
// matches the card language, else that language. A bare "pt" (European Portuguese for Home Assistant) is "pt-PT".
const intlLocale = (hass, config) => {
  const l = lang(hass, config);
  const src = config?.language || (hass && (hass.locale?.language || hass.language)) || "";
  const out = src && src.split("-")[0] === l.split("-")[0] ? src : l;
  return out === "pt" ? "pt-PT" : out;
};

const t = (hass, config, key, vars = {}) =>
  String(STRINGS[lang(hass, config)][key] ?? STRINGS.en[key] ?? key).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");

const valid = (s) => !!s && !["unknown", "unavailable", ""].includes(s.state);

const svgIcon = (path, cls = "") => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;

// ---- Days: "YYYY-MM-DD" keys in the time zone of the profile -------------

const DAY_FMT = {};
const dayKey = (ms, tz) =>
  (DAY_FMT[tz || ""] ??= new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", ...(tz ? { timeZone: tz } : {}) })).format(ms);
const keyMs = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
};
const addDays = (key, n) => new Date(keyMs(key) + n * 86400e3).toISOString().slice(0, 10);
const diffDays = (from, to) => Math.round((keyMs(to) - keyMs(from)) / 86400e3);
const weekday = (key) => WEEKDAYS[new Date(keyMs(key)).getUTCDay()];
const isKey = (s) => typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s);

const FMT = {};
const fmt = (locale, name, opts) => (FMT[`${locale}|${name}`] ??= new Intl.DateTimeFormat(locale, opts));
// A day, written in UTC from its key (no time zone shift): "Monday 16 November", "Fri 25 Dec".
const fmtDay = (key, locale) => fmt(locale, "long", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(keyMs(key) + 43200e3);
const fmtWeekday = (key, locale) => fmt(locale, "wd", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" }).format(keyMs(key) + 43200e3);
// A time of day, with Home Assistant's time format: "12", "24", else the language's (`language`, `system`).
const fmtTime = (ms, locale, tz, format) =>
  fmt(locale, `time|${tz || ""}|${format || ""}`, {
    hour: "numeric",
    minute: "2-digit",
    ...(format === "12" ? { hour12: true } : format === "24" ? { hourCycle: "h23" } : {}),
    ...(tz ? { timeZone: tz } : {}),
  }).format(ms);
const REL = {};
// "today", "tomorrow", "in 12 days", in the language of the card.
const fmtRel = (days, locale) => (REL[locale] ??= new Intl.RelativeTimeFormat(locale, { numeric: "auto" })).format(days, "day");
// Weekday names of the editor ("mon" → "Monday"), from a known Monday (2024-01-01).
const weekdayName = (d, locale) => fmt(locale, "wdl", { weekday: "long", timeZone: "UTC" }).format(Date.UTC(2024, 0, (WEEKDAYS.indexOf(d) + 6) % 7 + 1, 12));
const upperFirst = (s, locale) => (s ? s.charAt(0).toLocaleUpperCase(locale) + s.slice(1) : s);

// ---- Calendar events ------------------------------------------------------

// A calendar event (REST `calendars/<id>`: start/end as { date } or { dateTime }) as the days it covers:
// { start, end (exclusive), summary }, or null.
const eventSpan = (ev, tz) => {
  const read = (v) => (v && typeof v === "object" ? (v.date ?? v.dateTime) : v);
  const s = read(ev?.start);
  const e = read(ev?.end);
  if (!s) return null;
  const start = isKey(s) ? s : Number.isFinite(Date.parse(s)) ? dayKey(Date.parse(s), tz) : null;
  if (!start) return null;
  let end = null;
  if (isKey(e)) end = e;
  else if (e && Number.isFinite(Date.parse(e))) end = addDays(dayKey(Date.parse(e) - 1, tz), 1);
  if (!end || end <= start) end = addDays(start, 1);
  return { start, end, summary: String(ev.summary ?? "").trim(), description: String(ev.description ?? "").trim() };
};

const parseEvents = (list, tz, ignore) => {
  const re = ignore ? safeRegExp(ignore) : null;
  return (Array.isArray(list) ? list : [])
    .map((ev) => eventSpan(ev, tz))
    .filter((e) => e && !re?.test(e.summary))
    .sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : b.end < a.end ? -1 : 1));
};

const safeRegExp = (src) => {
  try {
    return new RegExp(src, "i");
  } catch (_e) {
    return null;
  }
};

// The longest event covering a day.
const covering = (events, key) => {
  let best = null;
  for (const e of events || []) if (e.start <= key && key < e.end && (!best || diffDays(e.start, e.end) > diffDays(best.start, best.end))) best = e;
  return best;
};

// Calendar events, shared by every card of the page: read once per calendar for the window around today, again
// after CALENDAR_REFRESH_MS, when the calendar's state changes (an event starts or ends) or on another day.
const CAL_CACHE = new Map();
const calendarData = (hass, id, today, onLoad) => {
  const st = hass.states[id];
  const stamp = `${today}|${st?.last_changed ?? ""}`;
  let c = CAL_CACHE.get(id);
  const stale = !c || c.stamp !== stamp || Date.now() - c.at > CALENDAR_REFRESH_MS;
  if (stale && !c?.loading && typeof hass.callApi === "function") {
    const ticket = { stamp, at: Date.now(), loading: true, list: c?.list ?? null, error: false, waiting: new Set([onLoad]) };
    CAL_CACHE.set(id, ticket);
    const start = new Date(keyMs(addDays(today, -PAST_DAYS))).toISOString();
    const end = new Date(keyMs(addDays(today, AHEAD_DAYS))).toISOString();
    Promise.resolve(hass.callApi("GET", `calendars/${id}?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`))
      .then((list) => Object.assign(ticket, { list: Array.isArray(list) ? list : [], loading: false, at: Date.now() }))
      .catch(() => Object.assign(ticket, { loading: false, error: true, at: Date.now() }))
      .finally(() => {
        for (const fn of ticket.waiting) fn();
        ticket.waiting.clear();
      });
    c = ticket;
  } else if (c?.loading) c.waiting.add(onLoad);
  return c;
};

// workday.check_date answers, shared by every card: entity|day → { at, workday (true / false / null while loading) }.
const WORKDAY_CACHE = new Map();
const checkDate = (hass, id, key, onLoad) => {
  const k = `${id}|${key}`;
  const c = WORKDAY_CACHE.get(k);
  if (c && (c.loading || Date.now() - c.at < CALENDAR_REFRESH_MS)) {
    if (c.loading) c.waiting.add(onLoad);
    return c.workday;
  }
  if (typeof hass.callWS !== "function") return null;
  const ticket = { at: Date.now(), loading: true, workday: c?.workday ?? null, waiting: new Set([onLoad]) };
  WORKDAY_CACHE.set(k, ticket);
  Promise.resolve(
    hass.callWS({
      type: "call_service",
      domain: "workday",
      service: "check_date",
      service_data: { check_date: key },
      target: { entity_id: id },
      return_response: true,
    }),
  )
    .then((res) => {
      const r = res?.response?.[id]?.workday;
      ticket.workday = typeof r === "boolean" ? r : null;
    })
    .catch(() => {
      ticket.workday = null;
    })
    .finally(() => {
      ticket.loading = false;
      ticket.at = Date.now();
      for (const fn of ticket.waiting) fn();
      ticket.waiting.clear();
    });
  return ticket.workday;
};

// ---- Discovery through the registries -------------------------------------

const _discovery = new WeakMap();
const regEntities = (hass) => Object.values(hass?.entities || {});
const discover = (hass) => {
  if (!hass?.entities) return {};
  const cached = _discovery.get(hass.entities);
  if (cached) return cached;
  const list = regEntities(hass);
  const name = (e) => String(hass.states[e.entity_id]?.attributes?.friendly_name ?? e.name ?? e.entity_id);
  const workday = list.find((e) => e.platform === "workday" && e.entity_id.startsWith("binary_sensor."))?.entity_id;
  const pub = list.find((e) => e.platform === "holiday" && e.entity_id.startsWith("calendar."))?.entity_id;
  const school = list.find(
    (e) =>
      e.entity_id.startsWith("calendar.") &&
      !["holiday", "workday"].includes(e.platform) &&
      /vacances|scolaire|school|ferien|vacaciones|vacanze|vakantie|ferie|lov/i.test(`${e.entity_id} ${name(e)}`),
  )?.entity_id;
  // Bin collections: the calendars of Waste Collection Schedule, or named after the bins; birthdays: by their name.
  const calendars = list.filter((e) => e.entity_id.startsWith("calendar.") && e.entity_id !== pub && e.entity_id !== school && !e.hidden);
  const birthdays = calendars.filter((e) => BIRTHDAY_RE.test(`${e.entity_id} ${name(e)}`)).map((e) => e.entity_id);
  const waste = calendars
    .filter((e) => !birthdays.includes(e.entity_id) && (e.platform === "waste_collection_schedule" || WASTE_RE.test(`${e.entity_id} ${name(e)}`)))
    .map((e) => e.entity_id);
  // Pronote: the timetables of each child (one device per child).
  const byDevice = new Map();
  for (const e of list) {
    if (e.platform !== "pronote" || !e.device_id) continue;
    const slot = { lessons_today: "today", lessons_tomorrow: "tomorrow", lessons_next_day: "next_day" }[e.translation_key];
    if (!slot) continue;
    if (!byDevice.has(e.device_id)) byDevice.set(e.device_id, {});
    byDevice.get(e.device_id)[slot] = e.entity_id;
  }
  const children = [...byDevice.entries()].map(([dev, ents]) => ({ name: childName(hass.devices?.[dev]), ...ents }));
  const out = { workday, public_holidays: pub, school_holidays: school, children, waste, birthdays };
  _discovery.set(hass.entities, out);
  return out;
};

// "Pronote - DUPONT Alex" → "Alex": the device name without the integration prefix, and without the family name
// when Pronote writes it in capitals.
const childName = (dev) => {
  const raw = String(dev?.name_by_user || dev?.name || "").replace(/^pronote\s*[-–:]\s*/i, "").trim();
  if (dev?.name_by_user) return raw;
  const words = raw.split(/\s+/);
  const given = words.filter((w) => w !== w.toLocaleUpperCase() || !/\p{L}/u.test(w));
  return given.length && given.length < words.length ? given.join(" ") : raw;
};


// ---- Pronote timetables ----------------------------------------------------

// What a Pronote timetable sensor says of its day: { day, start, end, lessons, canceled, subject } (times in ms,
// subject of the first lesson), or null.
const timetableOf = (s, tz) => {
  if (!valid(s)) return null;
  const a = s.attributes || {};
  const at = (v) => (v ? Date.parse(v) : Number.NaN);
  const lessons = (Array.isArray(a.lessons) ? a.lessons : []).filter((l) => Number.isFinite(at(l?.start_at))).sort((x, y) => at(x.start_at) - at(y.start_at));
  const live = lessons.filter((l) => !l.canceled);
  const start = Number.isFinite(at(a.day_start_at)) ? at(a.day_start_at) : live.length ? at(live[0].start_at) : Number.NaN;
  const end = Number.isFinite(at(a.day_end_at)) ? at(a.day_end_at) : live.length ? at(live[live.length - 1].end_at) : Number.NaN;
  const ref = Number.isFinite(start) ? start : lessons.length ? at(lessons[0].start_at) : Number.NaN;
  if (!Number.isFinite(ref)) return null;
  return {
    day: dayKey(ref, tz),
    start: Number.isFinite(start) ? start : null,
    end: Number.isFinite(end) ? end : null,
    lessons: live.length,
    canceled: lessons.length - live.length,
    subject: live.length ? String(live[0].lesson ?? "").trim() || null : null,
  };
};

// Pronote writes subjects in capitals ("MATHEMATIQUES"): shown as "Mathematiques"; mixed case is kept.
const subjectName = (s, locale) => {
  const v = String(s ?? "").trim();
  return v && /\p{L}/u.test(v) && v === v.toLocaleUpperCase(locale) ? upperFirst(v.toLocaleLowerCase(locale), locale) : v;
};

// ---------------------------------------------------------------------------
// Pictures of the days, animated (see the styles below)
// ---------------------------------------------------------------------------

const ART = {
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
const art = (kind) => `<svg class="art-svg" viewBox="0 0 24 24" aria-hidden="true">${ART[KINDS.includes(kind) ? kind : "unknown"]}</svg>`;

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const BASE_STYLE = `
  :host { --fd-accent: #d81b60; --fd-school: #1e88e5; --fd-weekend: var(--success-color, #43a047); --fd-holidays: #fb8c00;
          --fd-public: #5e35b1; --fd-off: #00897b; --fd-idle: var(--disabled-text-color, #9e9e9e); --fd-warn: var(--warning-color, #ffa600); }
  ha-card { overflow: hidden; container-type: inline-size; }
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
  .header:has(.sub) > .chip { margin-bottom: 14.4px; }
  .header:has(.sub.wrap) > .chip { align-self: flex-start; margin: 1px 0 0; }
  .titles { flex: 1 1 0; min-width: 5ch; }
  :host([hide-title]) .titles > .name:not(.answer), :host([hide-subtitle]) .titles > .sub:not(.countdown) { display: none; }
  .name { font-size: 16px; font-weight: 500; line-height: 1.25; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub { font-size: 12px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .sub.wrap { white-space: normal; }
  .badge { display: grid; place-items: center; flex: none; width: 40px; height: 40px; border-radius: 50%;
           background: color-mix(in srgb, var(--fd-accent) 16%, transparent); }
  .badge .icon { width: 24px; height: 24px; fill: var(--fd-accent); }
  .warning { padding: 16px; color: color-mix(in srgb, var(--fd-warn) 50%, var(--primary-text-color)); }
  .zoom { all: unset; flex: none; cursor: pointer; width: 24px; height: 24px; margin: -2px -4px 0 0; border-radius: 50%;
          display: grid; place-items: center; color: var(--secondary-text-color);
          background: color-mix(in srgb, var(--fd-idle) 10%, transparent); border: 1px solid color-mix(in srgb, var(--fd-idle) 25%, transparent); }
  .zoom .icon { width: 14px; height: 14px; }
  .zoom:hover { background: color-mix(in srgb, var(--fd-idle) 18%, transparent); color: var(--primary-text-color); }
  .zoom[aria-pressed="true"] { color: var(--fd-accent); border-color: color-mix(in srgb, var(--fd-accent) 45%, transparent); }
  .zoom:focus-visible { outline: 2px solid var(--primary-color, var(--fd-accent)); outline-offset: 1px; }
  @container (max-width: 300px) {
    .extras { margin-left: 0; }
    .extras.mini { margin-left: 12px; }
  }
  @container (max-width: 230px) {
    .chip { padding: 4px; flex: none; }
    .chip-text { display: none; }
    .header { gap: 6px; }
  }
`;

const ART_STYLE = `
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


const FULL_STYLE = `
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
  @container (max-width: 300px) {
    .headline .answer { font-size: 16px; }
    .headline { gap: 10px; }
    .headline .art { width: 32px; height: 32px; }
    .kids { margin-left: 0; }
    .line .end { display: none; }
  }
`;

const MINI_STYLE = `
  :host { --fd-natural-width: 300px; }
  ha-card.compact { padding-bottom: 12px; }
  /* The answer wraps rather than being cut: it is the whole point of the mini card. */
  .compact .name.answer { white-space: normal; overflow-wrap: break-word; }
  @container (max-width: 230px) {
    .compact .name.answer { font-size: 13px; }
    .compact .sub { font-size: 11px; }
    /* The answer says it already: the pill gives way to it. */
    .compact .chip { display: none; }
  }
`;

// ---------------------------------------------------------------------------
// Interaction helpers
// ---------------------------------------------------------------------------

// Element names of Home Assistant dialogs (more-info opened from the card, among others).
const DIALOG_TAGS = new Set(["HA-MORE-INFO-DIALOG", "HA-DIALOG", "DIALOG"]);
const isOutside = (card, ev) => {
  const path = ev.composedPath();
  return !path.includes(card) && !path.some((n) => DIALOG_TAGS.has(n.tagName));
};

// "A click elsewhere" is caught on the pointer, not only on the click event: on iOS a tap on something that is not
// clickable sends no click to the page. It counts when the press and the release are both outside the card; a scroll
// does not count (the browser cancels the pointer). Keyboard clicks still go through the click event.
const watchOutside = (card, handler) => {
  let downOutside = false;
  const onDown = (ev) => {
    downOutside = isOutside(card, ev);
  };
  const onUp = (ev) => {
    if (downOutside && isOutside(card, ev)) handler(ev);
    downOutside = false;
  };
  const onClick = (ev) => {
    if (ev.detail === 0 && isOutside(card, ev)) handler(ev);
  };
  return {
    on() {
      document.addEventListener("pointerdown", onDown, true);
      document.addEventListener("pointerup", onUp, true);
      document.addEventListener("click", onClick, true);
    },
    tap(ev) {
      onDown(ev);
      onUp(ev);
    },
    off() {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("pointerup", onUp, true);
      document.removeEventListener("click", onClick, true);
    },
  };
};

// Brings `from`'s children in line with `to`'s, position by position: nodes of the same kind are kept and updated
// (text, attributes, then their own children), the others replaced, added or removed. The animations of the pictures
// go on across updates, and a changed class starts the animations it names.
const morph = (from, to) => {
  const a = [...from.childNodes];
  const b = [...to.childNodes];
  b.forEach((nb, i) => {
    const na = a[i];
    if (!na) from.appendChild(nb);
    else if (na.nodeType !== nb.nodeType || na.nodeName !== nb.nodeName) from.replaceChild(nb, na);
    else if (nb.nodeType !== 1) {
      if (na.nodeValue !== nb.nodeValue) na.nodeValue = nb.nodeValue;
    } else {
      for (const at of [...na.attributes]) if (!nb.hasAttribute(at.name)) na.removeAttribute(at.name);
      for (const at of [...nb.attributes]) if (na.getAttribute(at.name) !== at.value) na.setAttribute(at.name, at.value);
      morph(na, nb);
    }
  });
  for (let i = a.length - 1; i >= b.length; i--) from.removeChild(a[i]);
};

// No rewrite of the card between a press and its click: an update under the pointer would replace the element
// pressed. While a press is in progress a render is left pending, done at the click or right after the release.
const holdUnderPress = (card, render) => {
  const root = card.shadowRoot;
  card._onPressEnd = () => {
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
    setTimeout(() => card._endPress(), 0);
  };
  card._endPress = () => {
    card._pressing = false;
    if (!card._dirty) return;
    card._dirty = false;
    render();
  };
  card._dropPress = () => {
    card._pressing = false;
    card._dirty = false;
    window.removeEventListener?.("pointerup", card._onPressEnd, true);
    window.removeEventListener?.("pointercancel", card._onPressEnd, true);
  };
  root.addEventListener?.("pointerdown", () => {
    card._pressing = true;
    window.addEventListener?.("pointerup", card._onPressEnd, true);
    window.addEventListener?.("pointercancel", card._onPressEnd, true);
  });
  root.addEventListener?.(
    "click",
    () => {
      card._pressing = false;
    },
    true,
  );
};

const sameDeps = (a, b) => !!a && a.length === b.length && a.every((d, i) => d === b[i]);

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

class FamilyDayBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._html = "";
    this._kinds = {};
    this._ghosts = {};
    this._swaps = {};
    this._loaded = 0;
    this._reload = () => {
      this._loaded++;
      this._update();
    };
    holdUnderPress(this, () => this._update());
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    this.shadowRoot.addEventListener("keydown", (ev) => {
      if ((ev.key !== "Enter" && ev.key !== " ") || ev.target?.getAttribute?.("role") !== "button") return;
      ev.preventDefault();
      ev.target.click();
    });
    // The picture that left has finished its animation: it is dropped.
    this.shadowRoot.addEventListener("animationend", (ev) => {
      const slot = ev.target?.dataset?.ghost;
      if (!slot || !this._ghosts[slot]) return;
      delete this._ghosts[slot];
      this._update();
    });
  }

  set hass(hass) {
    this._hass = hass;
    const deps = this._deps();
    if (deps && sameDeps(this._lastDeps, deps)) return;
    this._lastDeps = deps;
    this._update();
  }

  get hass() {
    return this._hass;
  }

  // What a render reads from hass: the states of its sources, the language, the day and the data loaded.
  _deps() {
    const h = this._hass;
    if (!h || !this._config) return null;
    const src = this._sources();
    const ids = [src.workday, src.school_holidays, src.public_holidays, ...src.waste, ...src.birthdays, ...src.children.flatMap((c) => [c.today, c.tomorrow, c.next_day])];
    return [h.entities, h.devices, h.language, h.locale, this._loaded, this._minute, ...ids.map((id) => (id ? h.states[id] : undefined))];
  }

  connectedCallback() {
    if (this._hass && this._config) this._update();
    // "Tomorrow" moves at midnight: checked every minute while the card is on the page.
    clearInterval(this._tick);
    this._tick = setInterval(() => {
      this._minute = Math.floor(Date.now() / 60000);
      if (this._hass) this.hass = this._hass;
    }, 60000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._tick = null;
    this._dropPress();
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    if (config.children !== undefined && !Array.isArray(config.children)) throw new Error("children must be a list");
    if (config.school_days !== undefined && !Array.isArray(config.school_days)) throw new Error("school_days must be a list of days");
    this._config = { ...config };
    this.toggleAttribute?.("hide-title", config.show_title === false);
    this.toggleAttribute?.("hide-subtitle", config.show_subtitle === false);
    this._html = "";
    this._lastDeps = null;
    this._update();
  }

  _t(key, vars) {
    return t(this._hass, this._config, key, vars);
  }

  _locale() {
    return intlLocale(this._hass, this._config);
  }

  _tz() {
    const h = this._hass;
    return h?.locale?.time_zone === "server" ? h.config?.time_zone : undefined;
  }

  // The entities read: the options, else what the registries tell (Workday, Holiday, a school holidays calendar,
  // the Pronote children). An option set to false (or an empty list of children) turns a source off.
  _sources() {
    const c = this._config;
    const found = discover(this._hass);
    const pick = (k) => (c[k] === false || c[k] === null ? undefined : c[k] || found[k]);
    const children = (c.children ?? found.children ?? [])
      .filter((ch) => ch && typeof ch === "object")
      .map((ch, i) => ({ name: String(ch.name ?? `#${i + 1}`), today: ch.today, tomorrow: ch.tomorrow ?? ch.entity, next_day: ch.next_day }));
    // Bins and birthdays: one calendar or a list; false turns them off.
    const many = (k) => {
      const v = c[k];
      if (v === false || v === null) return [];
      if (v) return (Array.isArray(v) ? v : [v]).filter((id) => typeof id === "string" && id.startsWith("calendar."));
      return found[k] || [];
    };
    return {
      workday: pick("workday"),
      school_holidays: pick("school_holidays"),
      public_holidays: pick("public_holidays"),
      children,
      waste: c.show_waste === false ? [] : many("waste"),
      birthdays: c.show_birthdays === false ? [] : many("birthdays"),
    };
  }

  _update() {
    if (!this._hass || !this._config) return;
    if (this._pressing) {
      this._dirty = true;
      return;
    }
    this._dirty = false;
    const html = this._render();
    if (html === this._html) return;
    this._html = html;
    const root = this.shadowRoot;
    if (!root.firstChild) {
      root.innerHTML = html;
      return;
    }
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    morph(root, tpl.content);
  }

  _onClick(ev) {
    const el = ev.composedPath().find((n) => n.dataset && (n.dataset.entity || n.dataset.action));
    if (!el) return;
    ev.stopPropagation();
    const { action, entity } = el.dataset;
    if (action === "zoom") return this._toggleZoom(ev);
    if (entity) this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: entity }, bubbles: true, composed: true }));
  }

  _toggleZoom() {}

  // ---- Data --------------------------------------------------------------

  // Everything a render needs: { today, tomorrow, day (what tomorrow is), school / pub (events, null while loading
  // or without the calendar), children (tomorrow's timetable of each), src, pending (calendar id → still loading) }.
  _model() {
    const h = this._hass;
    const tz = this._tz();
    const today = dayKey(Date.now(), tz);
    const tomorrow = addDays(today, 1);
    const src = this._sources();
    // A calendar that failed to load counts as absent; one still loading leaves tomorrow unknown.
    const pending = {};
    const events = (id, ignore) => {
      if (!id) return null;
      const c = calendarData(h, id, today, this._reload);
      if (!c?.list) {
        pending[id] = !!c?.loading;
        return null;
      }
      return parseEvents(c.list, tz, ignore);
    };
    const ignore = this._config.ignore === undefined ? DEFAULT_IGNORE : this._config.ignore;
    const school = events(src.school_holidays, ignore);
    const pub = events(src.public_holidays, "");
    const loading = Object.values(pending).some(Boolean);
    const day = loading ? { key: tomorrow, kind: "unknown", loading: true } : this._status(tomorrow, school, pub, src);
    const children = src.children.map((ch) => ({ name: ch.name, id: ch.tomorrow || ch.next_day || ch.today, day: this._childDay(ch, tomorrow, tz) }));
    return { today, tomorrow, day, school, pub, children, src, pending, extras: this._extrasOf(today, tomorrow, src, tz) };
  }

  // The chips under the answer: tomorrow's bin collections ("Recycling tonight"), today's and tomorrow's birthdays,
  // today's and tomorrow's name days. A calendar still loading shows nothing yet (it is never what tomorrow is).
  _extrasOf(today, tomorrow, src, tz) {
    const h = this._hass;
    const read = (id) => {
      const c = calendarData(h, id, today, this._reload);
      return c?.list ? parseEvents(c.list, tz, "") : [];
    };
    const waste = [];
    for (const id of src.waste) {
      for (const e of read(id)) {
        if (e.start === tomorrow && e.summary && !waste.some((w) => w.type === e.summary)) waste.push({ id, type: e.summary, color: binColor(e.summary) });
      }
    }
    const birthdays = [];
    for (const id of src.birthdays) {
      for (const e of read(id)) {
        if (e.start !== today && e.start !== tomorrow) continue;
        const name = birthdayName(e.summary);
        if (name && !birthdays.some((b) => b.name === name)) birthdays.push({ id, name, age: birthdayAge(e), tomorrow: e.start === tomorrow });
      }
    }
    birthdays.sort((a, b) => a.tomorrow - b.tomorrow);
    const c = this._config;
    // Today's name day, and tomorrow's ("St Albert · tomorrow"): the card speaks of tomorrow.
    const saints = (c.show_saint ?? lang(h, c) === "fr")
      ? [saintOf(today), saintOf(tomorrow) && { ...saintOf(tomorrow), tomorrow: true }].filter(Boolean)
      : [];
    return { waste, birthdays, saints };
  }

  // The chips' HTML (none: empty), under the answer on the full card and under the header on the mini card.
  _extrasHtml(m, cls = "") {
    const x = m.extras;
    const L = this._locale();
    const chip = (kind, icon, text, title, entity) => {
      const attrs = entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(entity)}"` : '"';
      return `<span class="xchip ${kind}${attrs} title="${esc(title)}">${svgIcon(icon)}<span>${esc(text)}</span></span>`;
    };
    const years = (n) => new Intl.NumberFormat(L, { style: "unit", unit: "year", unitDisplay: "long" }).format(n);
    const chips = [
      ...x.waste.map((w) => chip(`w-${w.color}`, ICONS.trash, this._t("waste_tonight", { type: w.type }), this._t("waste_title"), w.id)),
      ...x.birthdays.map((b) =>
        chip("x-birthday", ICONS.cake, [b.name, b.age !== null ? years(b.age) : "", b.tomorrow ? fmtRel(1, L) : ""].filter(Boolean).join(" · "), this._t("birthday_title"), b.id),
      ),
      ...x.saints.map((n) =>
        chip("x-saint", ICONS.flower, n.tomorrow ? `${n.name} · ${fmtRel(1, L)}` : n.name, [this._t("saint_title"), n.all.join(", ")].filter(Boolean).join(" : ")),
      ),
    ];
    return chips.length ? `<div class="extras${cls}">${chips.join("")}</div>` : "";
  }

  // What a day is: a public holiday, school holidays, a day without school (weekend), a day off for Workday, else
  // a school day: { key, kind, name, entity }.
  _status(key, school, pub, src) {
    const p = covering(pub, key);
    if (p) return { key, kind: "public_holiday", name: p.summary, entity: src.public_holidays };
    const s = covering(school, key);
    if (s) return { key, kind: "holidays", name: s.summary, entity: src.school_holidays };
    const wd = src.workday ? this._hass.states[src.workday] : undefined;
    if (!this._schoolDays(wd).includes(weekday(key))) return { key, kind: "weekend", entity: src.workday };
    if (this._workday(src.workday, wd, key) === false) return { key, kind: "day_off", entity: src.workday };
    return { key, kind: "school", entity: src.workday };
  }

  // Whether Workday counts tomorrow as a working day: its state with `days_offset: 1`, else workday.check_date
  // (true / false, null while loading or without Workday).
  _workday(id, wd, key) {
    if (!id || !wd) return null;
    if (Number(wd.attributes?.days_offset ?? 0) === 1 && valid(wd)) return wd.state === "on";
    return checkDate(this._hass, id, key, this._reload);
  }

  _schoolDays(wd) {
    const c = this._config.school_days;
    if (Array.isArray(c) && c.length) return c.map((d) => String(d).slice(0, 3).toLowerCase());
    const w = wd?.attributes?.workdays;
    if (Array.isArray(w) && w.some((d) => WEEKDAYS.includes(d))) return w.filter((d) => WEEKDAYS.includes(d));
    return DEFAULT_SCHOOL_DAYS;
  }

  // A child's timetable of a day, from whichever of its Pronote sensors is about that day: { id, start, lessons,
  // subject… }; a valid "tomorrow" sensor without lessons means no lessons; null when not known.
  _childDay(ch, key, tz) {
    for (const id of [ch.tomorrow, ch.next_day, ch.today]) {
      const tt = id ? timetableOf(this._hass.states[id], tz) : null;
      if (tt?.day === key) return { id, ...tt };
    }
    const s = ch.tomorrow ? this._hass.states[ch.tomorrow] : undefined;
    if (valid(s) && Array.isArray(s.attributes?.lessons) && !s.attributes.lessons.length) return { id: ch.tomorrow, lessons: 0, start: null, subject: null };
    return null;
  }

  // The earliest first lesson of the children (ms), when Pronote knows it.
  _firstLesson(m) {
    const starts = m.children.map((ch) => ch.day).filter((d) => d?.lessons && d.start !== null);
    return starts.length ? Math.min(...starts.map((d) => d.start)) : null;
  }

  // The school holidays going on today, else the next ones: { event, current }, or null.
  _holidays(m) {
    if (!m.school) return null;
    const cur = covering(m.school, m.today);
    if (cur) return { event: cur, current: true };
    const next = m.school.find((e) => e.start > m.today);
    return next ? { event: next, current: false } : null;
  }

  _kindLabel(kind) {
    return this._t(`kind_${kind}`);
  }

  _time(ms) {
    return fmtTime(ms, this._locale(), this._tz(), this._hass?.locale?.time_format);
  }

  // ---- Parts -------------------------------------------------------------

  // A picture that changes with the kind of day: the new one bounces in, the old one leaves (see the styles). The
  // first answer after loading (unknown before) comes in without it.
  _glyph(slot, kind, inner) {
    const prev = this._kinds[slot];
    if (prev && prev !== "unknown" && prev !== kind) {
      this._ghosts[slot] = prev;
      this._swaps[slot] = this._swaps[slot] === "a" ? "b" : "a";
    }
    this._kinds[slot] = kind;
    const swap = this._swaps[slot] ? ` swap-${this._swaps[slot]}` : "";
    const ghost = this._ghosts[slot];
    return `<span class="glyph${swap}">${inner(kind)}</span>${ghost ? `<span class="glyph ghost k-${ghost}" data-ghost="${slot}">${inner(ghost)}</span>` : ""}`;
  }

  // Badge, title and subtitle, status pill of tomorrow and the mini card's detail button.
  _header({ name, nameCls = "", sub, subCls = "", day }) {
    const pill = esc(this._kindLabel(day.kind));
    const attrs = day.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(day.entity)}"` : '"';
    return `
      <div class="header">
        <span class="badge">${svgIcon(ICONS.bag)}</span>
        <div class="titles">
          <div class="name${nameCls}">${esc(name)}</div>
          ${sub ? `<div class="sub${subCls}">${esc(sub)}</div>` : ""}
        </div>
        <span class="chip k-${day.kind}${attrs} title="${pill}" aria-label="${pill}"><span class="dot"></span><span class="chip-text">${pill}</span></span>
        ${this._zoomButton()}
      </div>`;
  }

  _zoomButton() {
    return "";
  }

  _errorCard(text) {
    return `<style>${BASE_STYLE}</style><ha-card><div class="warning">${esc(text)}</div></ha-card>`;
  }

  _noSource(m) {
    const s = m.src;
    return !s.workday && !s.school_holidays && !s.public_holidays && !s.children.length;
  }
}

class FamilyDayCard extends FamilyDayBase {
  static getConfigElement() {
    return document.createElement("family-day-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }

  _extraStyle() {
    return "";
  }

  _render() {
    const c = this._config;
    const m = this._model();
    if (this._noSource(m)) return this._errorCard(this._t("no_source"));
    const L = this._locale();
    const d = m.day;
    const kids = c.show_children !== false && d.kind === "school" ? this._kidsHtml(m) : "";
    return `<style>${BASE_STYLE}${ART_STYLE}${FULL_STYLE}${this._extraStyle()}</style>
      <ha-card>
        ${this._header({ name: c.title || this._t("title"), sub: upperFirst(fmtDay(m.tomorrow, L), L), day: d })}
        <div class="content">${this._headline(m)}${this._extrasHtml(m)}${kids}${this._footer(m)}</div>
      </ha-card>`;
  }

  // "School at 8:00" (the earliest first lesson), "School day" without Pronote, "No school — Weekend".
  _answer(m) {
    const d = m.day;
    if (d.loading) return this._t("loading");
    if (d.kind === "school") {
      const first = this._firstLesson(m);
      return first !== null ? this._t("school_at", { time: this._time(first) }) : this._t("school_day");
    }
    return this._t("no_school", { reason: d.name || this._kindLabel(d.kind) });
  }

  _headline(m) {
    const d = m.day;
    const attrs = d.entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(d.entity)}"` : '"';
    return `<div class="headline k-${d.kind}${attrs}>
        <span class="art">${this._glyph("tomorrow", d.kind, art)}</span>
        <span class="answer">${esc(this._answer(m))}</span>
      </div>`;
  }

  // One row per child: "8:00 · Mathematics", "No lessons", "Timetable not known yet".
  _kidsHtml(m) {
    if (!m.children.length) return "";
    const L = this._locale();
    const rows = m.children.map((ch) => {
      const d = ch.day;
      let what;
      if (!d) what = esc(this._t("timetable_unknown"));
      else if (!d.lessons) what = esc(this._t("no_lessons"));
      else what = [d.start !== null ? `<b>${esc(this._time(d.start))}</b>` : "", d.subject ? esc(subjectName(d.subject, L)) : ""].filter(Boolean).join(" · ");
      const id = d?.id || ch.id;
      const attrs = id ? ` clickable" role="button" tabindex="0" data-entity="${esc(id)}"` : '"';
      return `<div class="kid${attrs}><span class="who">${esc(ch.name)}</span><span class="what">${what}</span></div>`;
    });
    return `<div class="kids">${rows.join("")}</div>`;
  }

  _line(kind, icon, text, end, entity, extra = "") {
    const attrs = entity ? ` clickable" role="button" tabindex="0" data-entity="${esc(entity)}"` : '"';
    return `<div class="line k-${kind}${attrs}><div class="top">${svgIcon(icon)}<span class="txt">${text}</span>${end ? `<span class="end">${esc(end)}</span>` : ""}</div>${extra}</div>`;
  }

  // The school holidays going on ("Christmas holidays · back in 5 days", with their progress), else the next
  // ones ("Christmas holidays · in 34 days"); then the next public holiday ("Christmas Day · in 41 days").
  _footer(m) {
    const c = this._config;
    const L = this._locale();
    const lines = [];
    const loading = (id, kind, icon) => this._line(kind, icon, `<span class="muted">${esc(this._t("loading"))}</span>`, "", id);
    if (c.show_holidays !== false && m.src.school_holidays) {
      const h = this._holidays(m);
      const id = m.src.school_holidays;
      if (!m.school) lines.push(m.pending[id] ? loading(id, "holidays", ICONS.holidays) : "");
      else if (h?.current) {
        const e = h.event;
        const total = diffDays(e.start, e.end);
        const done = diffDays(e.start, m.today) + 1;
        const pct = Math.round((done / total) * 100);
        const bar = `<div class="bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div style="width:${pct}%"></div></div>`;
        const text = `<b>${esc(e.summary)}</b> · ${esc(this._t("back_rel", { rel: fmtRel(diffDays(m.today, e.end), L) }))}`;
        lines.push(this._line("holidays", ICONS.holidays, text, this._t("day_of", { n: done, total }), id, bar));
      } else if (h) {
        const e = h.event;
        lines.push(this._line("holidays", ICONS.holidays, `<b>${esc(e.summary)}</b> · ${esc(fmtRel(diffDays(m.today, e.start), L))}`, upperFirst(fmtWeekday(e.start, L), L), id));
      }
    }
    if (c.show_public_holidays !== false && m.src.public_holidays) {
      const id = m.src.public_holidays;
      const next = m.pub?.find((e) => e.start >= m.today);
      if (!m.pub) lines.push(m.pending[id] ? loading(id, "public_holiday", ICONS.calendar_star) : "");
      else if (next)
        lines.push(this._line("public_holiday", ICONS.calendar_star, `<b>${esc(next.summary)}</b> · ${esc(fmtRel(diffDays(m.today, next.start), L))}`, upperFirst(fmtWeekday(next.start, L), L), id));
    }
    const out = lines.filter(Boolean);
    return out.length ? `<div class="footer">${out.join("")}</div>` : "";
  }
}

// The mini card answers in one line ("Tomorrow: school 8:00 AM", "No school tomorrow") with tomorrow's pill and
// the holidays countdown under it; its detail button (top right, `zoom: false` removes it) unfolds the full card,
// and a click anywhere else on the page folds it back.
class FamilyDayMiniCard extends FamilyDayCard {
  constructor() {
    super();
    this._unzoom = watchOutside(this, () => {
      if (this._zoomed) this._setZoom(false);
    });
  }

  static getConfigElement() {
    return document.createElement("family-day-mini-card-editor");
  }

  connectedCallback() {
    super.connectedCallback();
    this._unzoom.on();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._unzoom.off();
    if (this._zoomed) {
      this._zoomed = false;
      this._html = "";
    }
  }

  getCardSize() {
    return this._zoomed ? super.getCardSize() : 1;
  }

  getGridOptions() {
    return { ...(this._zoomed ? super.getGridOptions() : { columns: 6, min_columns: 6 }), rows: "auto" };
  }

  _zoomButton() {
    if (this._config.zoom === false) return "";
    const z = !!this._zoomed;
    const label = esc(this._t(z ? "zoom_out" : "zoom_in"));
    return `<button class="zoom" data-action="zoom" title="${label}" aria-label="${label}" aria-pressed="${z}">${svgIcon(z ? ICONS.collapse : ICONS.expand)}</button>`;
  }

  _setZoom(on) {
    this._zoomed = on;
    this._update();
    this.dispatchEvent(new CustomEvent("iron-resize", { bubbles: true, composed: true }));
  }

  _toggleZoom(ev) {
    this._setZoom(!this._zoomed);
    if (ev?.detail === 0) this.shadowRoot.querySelector(".zoom")?.focus?.({ preventScroll: true });
  }

  _extraStyle() {
    return MINI_STYLE;
  }

  // "Tomorrow: school 8:00 AM" / "Tomorrow: school" / "No school tomorrow".
  _miniAnswer(m) {
    const d = m.day;
    if (d.loading) return this._t("loading");
    if (d.kind !== "school") return this._t("tomorrow_no_school");
    const first = this._firstLesson(m);
    return first !== null ? this._t("tomorrow_school_at", { time: this._time(first) }) : this._t("tomorrow_school");
  }

  // "Holidays in 34 days" / "Back to school in 5 days".
  _countdown(m) {
    const h = this._holidays(m);
    if (!h) return "";
    const L = this._locale();
    const e = h.event;
    return h.current ? this._t("back_to_school", { rel: fmtRel(diffDays(m.today, e.end), L) }) : this._t("holidays_rel", { rel: fmtRel(diffDays(m.today, e.start), L) });
  }

  _render() {
    if (this._zoomed) return super._render();
    const m = this._model();
    if (this._noSource(m)) return this._errorCard(this._t("no_source"));
    const sub = this._config.show_countdown === false ? "" : this._countdown(m);
    return `<style>${BASE_STYLE}${MINI_STYLE}</style>
      <ha-card class="compact">
        ${this._header({ name: this._miniAnswer(m), nameCls: " answer", sub, subCls: " countdown wrap", day: m.day })}
        ${this._extrasHtml(m, " mini")}
      </ha-card>`;
  }
}

// ---------------------------------------------------------------------------
// Visual editors (ha-form)
// ---------------------------------------------------------------------------

const LANGUAGES = [
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
const cleanConfig = (value, defaults) => {
  const config = { ...value };
  for (const [k, v] of Object.entries(config)) {
    if (v === "" || v === undefined || v === null || (Array.isArray(v) && !v.length && !(k in defaults)) || (k in defaults && JSON.stringify(v) === JSON.stringify(defaults[k]))) delete config[k];
  }
  return config;
};


class FamilyDayCardEditor extends HTMLElement {
  static get toggles() {
    return [
      ["show_title", true],
      ["show_subtitle", true],
      ["show_children", true],
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
      { name: "public_holidays", selector: { entity: { domain: "calendar" } } },
      { name: "waste", selector: { entity: { domain: "calendar", multiple: true } } },
      { name: "birthdays", selector: { entity: { domain: "calendar", multiple: true } } },
      {
        name: "school_days",
        selector: { select: { multiple: true, mode: "list", options: [...WEEKDAYS.slice(1), "sun"].map((value) => ({ value, label: upperFirst(weekdayName(value, L), L) })) } },
      },
      { type: "grid", name: "", schema: this.constructor.toggles.map(([name]) => ({ name, selector: { boolean: {} } })) },
      {
        name: "language",
        selector: { select: { mode: "dropdown", options: [{ value: "", label: tr("lang_auto") }, ...LANGUAGES.map(([value, label]) => ({ value, label }))] } },
      },
    ];
  }

  // The toggles' defaults for a config (a default may depend on the card's language).
  _defaults(config) {
    return Object.fromEntries(this.constructor.toggles.map(([name, def]) => [name, typeof def === "function" ? def(this._hass, config) : def]));
  }

  _render() {
    if (!this._hass || !this._config) return;
    const toggles = this.constructor.toggles;
    const tr = (k) => t(this._hass, this._config, k);
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => tr(`opt_${s.name}`);
      this._form.computeHelper = (s) => (["workday", "school_holidays", "public_holidays", "waste", "birthdays", "zoom", "school_days"].includes(s.name) ? tr(`help_${s.name}`) : undefined);
      this._form.addEventListener("value-changed", (ev) => {
        ev.stopPropagation();
        this._config = cleanConfig(ev.detail.value, this._defaults(ev.detail.value));
        this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: this._config }, bubbles: true, composed: true }));
      });
      this.appendChild(this._form);
    }
    const data = { ...this._config };
    const defaults = this._defaults(this._config);
    for (const [name] of toggles) if (data[name] === undefined) data[name] = defaults[name];
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
class FamilyDayMiniCardEditor extends FamilyDayCardEditor {
  static get toggles() {
    return [...FamilyDayCardEditor.toggles, ["show_countdown", true], ["zoom", true]];
  }
}

// ---------------------------------------------------------------------------
// Registration
// ---------------------------------------------------------------------------

const define = (name, cls) => {
  if (!customElements.get(name)) customElements.define(name, cls);
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
