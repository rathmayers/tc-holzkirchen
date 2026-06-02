// teamid: BTV Team-ID für den Link auf btv.de/de/spielbetrieb/teamportrait.html?teamid=...
// Fehlende IDs auf btv.de nachschlagen und hier eintragen.
// Nur Stammdaten — Kontaktdaten (Mannschaftsführer, Telefon, E-Mail)
// werden live von BTV geholt (api/spielplan.mjs, 1h gecacht).
export const MANNSCHAFTEN = [
  { name: 'Herren',              kategorie: 'Herren',   teamid: '3577223' },
  { name: 'Herren 30',           kategorie: 'Herren',   teamid: '3582321' },
  { name: 'Herren 40',           kategorie: 'Herren',   teamid: '3575191' },
  { name: 'Herren 50',           kategorie: 'Herren',   teamid: '3575244' },
  { name: 'Herren 70',           kategorie: 'Herren',   teamid: '3580450' },
  { name: 'Damen 30',            kategorie: 'Damen',    teamid: '3573678' },
  { name: 'Damen 40',            kategorie: 'Damen',    teamid: '3720470' },
  { name: 'Damen 50',            kategorie: 'Damen',    teamid: '3580338' },
  { name: 'Damen 50 II',         kategorie: 'Damen',    teamid: '3577066' },
  { name: 'Junioren 18',         kategorie: 'Jugend',   teamid: '3581522' },
  { name: 'Junioren 18 II',      kategorie: 'Jugend',   teamid: '3578932' },
  { name: 'Knaben 15',           kategorie: 'Jugend',   teamid: '3573619' },
  { name: 'Knaben 15 II',        kategorie: 'Jugend',   teamid: '3642145' },
  { name: 'Knaben 15 III',       kategorie: 'Jugend',   teamid: '3642145' },
  { name: 'Bambini 12',          kategorie: 'Jugend',   teamid: '3584372' },
  { name: 'Bambini 12 II',       kategorie: 'Jugend',   teamid: '3572395' },
  { name: 'Dunlop Midcourt U10', kategorie: 'Jugend',   teamid: '3576707' },
];
