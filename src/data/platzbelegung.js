// ─── Platzbelegung TC Holzkirchen ─────────────────────────────────────────
// Wochentage nach JavaScript Date.getDay(): 0=So, 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa

// ── Medenspiele-Heimspieltage (Plätze 1–5 orange ab angegebener Uhrzeit) ──
// datum: 'YYYY-MM-DD', von: frühester Anpfiff des Tages
export const MEDENSPIELE_TERMINE = [
  // Mai
  { datum: '2026-05-01', von: '09:00' }, // Fr – U15m I
  { datum: '2026-05-02', von: '09:00' }, // Sa – U18m I, H40
  { datum: '2026-05-08', von: '15:00' }, // Fr – U15m III
  { datum: '2026-05-09', von: '09:00' }, // Sa – U12 I, U18m II, D30, D50 I
  { datum: '2026-05-10', von: '15:00' }, // So – MC
  { datum: '2026-05-11', von: '10:00' }, // Mo – H70
  { datum: '2026-05-15', von: '15:00' }, // Fr – U15m II
  { datum: '2026-05-16', von: '09:00' }, // Sa – U12 II, D50 I, H30, H50
  { datum: '2026-05-18', von: '10:00' }, // Mo – H70
  // Juni
  { datum: '2026-06-08', von: '10:00' }, // Mo – H70
  { datum: '2026-06-12', von: '15:00' }, // Fr – U15m I
  { datum: '2026-06-13', von: '09:00' }, // Sa – U18m I, U18m II, D30, H30
  { datum: '2026-06-14', von: '09:00' }, // So – Herren, MC
  { datum: '2026-06-19', von: '15:00' }, // Fr – U15m III
  { datum: '2026-06-20', von: '09:00' }, // Sa – U18m I, U18m II, D50 II, H50
  { datum: '2026-06-26', von: '15:00' }, // Fr – U15m II
  { datum: '2026-06-27', von: '09:00' }, // Sa – U12 I, U12 II, H30, H40
  { datum: '2026-06-29', von: '10:00' }, // Mo – H70
  // Juli
  { datum: '2026-07-03', von: '15:00' }, // Fr – U15m I, U15m III
  { datum: '2026-07-04', von: '09:00' }, // Sa – U12 II, D30, D50 I, H40
  { datum: '2026-07-05', von: '09:00' }, // So – H30, MC
  { datum: '2026-07-10', von: '15:00' }, // Fr – U15m III
  { datum: '2026-07-11', von: '09:00' }, // Sa – U12 I, U18m I, H40, H50
  { datum: '2026-07-12', von: '09:00' }, // So – Herren
  { datum: '2026-07-17', von: '15:00' }, // Fr – U15m I
  { datum: '2026-07-18', von: '09:00' }, // Sa – U18m I, D50 I
  { datum: '2026-07-19', von: '09:00' }, // So – Herren
];

// Für den Hero-Statusdot: generelle Medenspiele-Saison (Fallback)
export const MEDENSPIELE = {
  vonDatum:    '2026-05-01',
  bisDatum:    '2026-07-19',
};

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
      { wochentage: [1,3], von: '13:00', bis: '20:30' }, // Mo
      { wochentage: [2], von: '15:00', bis: '20:30' }, // Mo
      { wochentage: [4,5], von: '14:00', bis: '20:30' }, // Mo
      { wochentage: [6],              von: '09:00', bis: '16:00' }, // Sa
    ],
  },

  // Tennisschule Oberland – Platz 5 (Dienstag)
  {
    label:    'Tennisschule Oberland',
    plaetze:  [5],
    vonDatum: '2026-04-27',
    bisDatum: '2026-09-26',
    zeiten: [
      { wochentage: [3], von: '14:00', bis: '15:00' }, // Di
      { wochentage: [4], von: '15:00', bis: '20:00' }, // Di
    ],
  },

  // Freier Spielertreff – Plätze 1–5 (Mittwoch abend)
  {
    label:   'Freier Spielertreff',
    plaetze: [1, 2, 3, 4, 5],
    zeiten: [
      { wochentage: [3], von: '17:30', bis: '20:30' }, // Mi
    ],
  },

  // Jugend - Match and Practice – Plätze 1–4 (Mittwoch nachmittag)
  {
    label:   'Jugend - Match and Practice',
    plaetze: [1, 2, 3, 4],
    zeiten: [
      { wochentage: [3], von: '14:30', bis: '16:00' }, // Mi
    ],
  },  

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
