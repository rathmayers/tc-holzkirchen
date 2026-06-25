// ─── Platzbelegung TC Holzkirchen ─────────────────────────────────────────
// Wochentage nach JavaScript Date.getDay(): 0=So, 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa

// ── Medenspiele-Heimspieltage (Plätze 1–5 orange ab angegebener Uhrzeit) ──
// datum: 'YYYY-MM-DD', von: frühester Anpfiff des Tages
export const MEDENSPIELE_TERMINE = [
  // Mai
  { datum: '2026-05-02', zeiten: [
    { von: '12:00', mannschaften: ['H40 4er'] },
  ]},
  { datum: '2026-05-08', zeiten: [
    { von: '15:00', mannschaften: ['U15m III'] },
  ]},
  { datum: '2026-05-09', zeiten: [
    { von: '09:00', mannschaften: ['U12 I', 'U18m II'] },
    { von: '14:00', mannschaften: ['D30 4er', 'D50 I 4er'] },
  ]},
  { datum: '2026-05-10', zeiten: [
    { von: '15:00', mannschaften: ['U10 MC'] },
  ]},
  { datum: '2026-05-11', zeiten: [
    { von: '10:00', mannschaften: ['H70 4er'] },
  ]},
  { datum: '2026-05-15', zeiten: [
    { von: '15:00', mannschaften: ['U15m II'] },
  ]},
  { datum: '2026-05-16', zeiten: [
    { von: '09:00', mannschaften: ['U12 II'] },
    { von: '14:00', mannschaften: ['D50 I 4er', 'H30 6er'] },
  ]},
  { datum: '2026-05-18', zeiten: [
    { von: '10:00', mannschaften: ['H70 4er'] },
  ]},
  // Juni
  { datum: '2026-06-07', zeiten: [
    { von: '13:00', mannschaften: ['H50 6er'] },
  ]},
  { datum: '2026-06-08', zeiten: [
    { von: '10:00', mannschaften: ['H70 4er'] },
  ]},
  { datum: '2026-06-13', zeiten: [
    { von: '09:00', mannschaften: ['U18m I', 'U18m II'] },
    { von: '14:00', mannschaften: ['D30 4er', 'H30 6er'] },
  ]},
  { datum: '2026-06-14', zeiten: [
    { von: '15:00', mannschaften: ['U10 MC'] },
  ]},
  { datum: '2026-06-15', zeiten: [
    { von: '18:30', mannschaften: ['D40C'], plaetze: [3, 4], buffer: 15 },
  ]},
  { datum: '2026-06-19', zeiten: [
    { von: '15:00', mannschaften: ['U15m II'] },
  ]},
  { datum: '2026-06-20', zeiten: [
    { von: '09:00', mannschaften: ['U18m I', 'U18m II'] },
    { von: '14:00', mannschaften: ['D50 II 4er', 'H50 6er'] },
  ]},
  { datum: '2026-06-22', zeiten: [
    { von: '18:30', mannschaften: ['D40C'], plaetze: [3, 4], buffer: 15 },
  ]},
    { datum: '2026-06-23', zeiten: [
    { von: '08:30', mannschaften: ['Privatschule Tennis-Turnier'], plaetze: [1, 2,3, 4]},
    { von: '10:30', mannschaften: ['Privatschule Tennis-Turnier'], plaetze: [3, 4]},
  ]},
  { datum: '2026-06-27', zeiten: [
    { von: '07:30', mannschaften: ['U12 I', 'U12 II'] },
    { von: '14:00', mannschaften: ['H40 4er'] },
  ]},
  { datum: '2026-06-29', zeiten: [
    { von: '10:00', mannschaften: ['H70 4er'] },
  ]},
  // Juli
  { datum: '2026-07-03', zeiten: [
    { von: '15:00', mannschaften: ['U15m I', 'U15m III'] },
  ]},
  { datum: '2026-07-04', zeiten: [
    { von: '09:00', mannschaften: ['U12 II', 'H50 6er'] },
    { von: '14:00', mannschaften: ['D50 I 4er', 'D50 II 4er'] },
  ]},
  { datum: '2026-07-05', zeiten: [
    { von: '09:00', mannschaften: ['H40 4er'] },
    { von: '15:00', mannschaften: ['U10 MC'] },
  ]},
  { datum: '2026-07-10', zeiten: [
    { von: '15:00', mannschaften: ['U15m II'] },
    { von: '15:00', mannschaften: ['U15m III'] },
  ]},
  { datum: '2026-07-11', zeiten: [
    { von: '09:00', mannschaften: ['U12 I', 'U18m I'] },
    { von: '14:00', mannschaften: ['H30 6er', 'H40 4er'] },
  ]},
  { datum: '2026-07-12', zeiten: [
    { von: '09:00', mannschaften: ['Herren'] },
  ]},
  { datum: '2026-07-17', zeiten: [
    { von: '15:00', mannschaften: ['U15m I'] },
  ]},
  { datum: '2026-07-18', zeiten: [
    { von: '09:00', mannschaften: ['U18m I'] },
    { von: '13:00', mannschaften: ['D50 II 4er'] },
  ]},
  { datum: '2026-07-19', zeiten: [
    { von: '09:00', mannschaften: ['Herren'] },
  ]},
  { datum: '2026-07-24', zeiten: [
    { von: '15:00', mannschaften: ['U15m I'] },
  ]},
  { datum: '2026-07-25', zeiten: [
    { von: '09:00', mannschaften: ['Herren'] },
  ]},
  { datum: '2026-08-01', zeiten: [
    { von: '10:00', mannschaften: ['Mixed-Turnier des TC Holzkirchen mit Sommerfest'] },
  ]},

];

// Für den Hero-Statusdot: generelle Medenspiele-Saison (Fallback)
export const MEDENSPIELE = {
  vonDatum:    '2026-05-02',
  bisDatum:    '2026-07-25',
};

// ── Schulferien (für Lücken im Belegungsplan) ─────────────────────────────
export const SCHULFERIEN = [
  { label: 'Pfingstferien', vonDatum: '2026-05-19', bisDatum: '2026-06-07' },
];

// ── Feste Belegungen (rot) ────────────────────────────────────────────────
// Jeder Eintrag belegt einen oder mehrere Plätze zu definierten Zeiten.
// vonDatum / bisDatum optional – fehlt der Wert, gilt die Belegung ganzjährig.
export const BELEGUNGEN = [

  // Tennisschule Oberland – Platz 6
  {
    label:    'Tennisschule Oberland',
    plaetze:  [6],
    vonDatum: '2026-04-27',
    bisDatum: '2026-09-26',
    zeiten: [
      { wochentage: [1,3], von: '13:00', bis: '20:30' },
      { wochentage: [2], von: '14:30', bis: '20:30' },
      { wochentage: [4,5], von: '14:00', bis: '20:30' },
      { wochentage: [6], von: '09:00', bis: '16:00' },
    ],
  },

  // Tennisschule Oberland – Platz 5 (Mittwoch/Donnerstag)
  {
    label:    'Tennisschule Oberland',
    plaetze:  [5],
    vonDatum: '2026-04-27',
    bisDatum: '2026-09-26',
    zeiten: [
      { wochentage: [2], von: '15:30', bis: '16:30' },
      { wochentage: [3], von: '14:00', bis: '15:00' },
      { wochentage: [4], von: '15:00', bis: '20:00' },
    ],
  },

  /* Freier Spielertreff – Plätze 1–5 (Mittwoch abend) bis auf Weiteres ausgesetzt
  {
    label:   'Freier Spielertreff',
    plaetze: [1, 2, 3, 4, 5],
    zeiten: [
      { wochentage: [3], von: '17:30', bis: '20:30' },
    ],
  },
*/

  // Jugend - Match and Practice – Plätze 1–4 (Mittwoch nachmittag)
  {
    label:   'Jugend – Match and Practice',
    plaetze: [1, 2, 3, 4],
    zeiten: [
      { wochentage: [3], von: '14:30', bis: '16:00' },
    ],
  },

  /* weitere mögliche wöchentliche Belegungen hier eintragen:
  {
    label:   'Privatschule Tennis-Turnier',
    plaetze: [1, 2, 3, 4],
    vonDatum: '2026-06-23',   // optional
    bisDatum: '2026-06-23',   // optional
    zeiten: [
      { wochentage: [2], von: '8:30', bis: '10:00' },
    ],
  },
*/

  // Weitere Belegungen hier eintragen:
  // {
  //   label:    'Beschreibung',
  //   plaetze:  [1, 2],
  //   vonDatum: '2026-06-01',   // optional
  //   bisDatum: '2026-06-30',   // optional
  //   zeiten: [
  //     { wochentage: [1, 3], von: '10:00', bis: '12:00' },
  //   ],
  // },

];
