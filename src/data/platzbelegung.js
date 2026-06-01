// ─── Platzbelegung TC Holzkirchen ─────────────────────────────────────────
// Wochentage nach JavaScript Date.getDay(): 0=So, 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa

// ── Medenspiele-Saison ────────────────────────────────────────────────────
// In diesem Zeitraum werden Fr 15:00 – So 20:00 alle Plätze orange markiert.
export const MEDENSPIELE = {
  vonDatum:    '2026-05-02',
  bisDatum:    '2026-07-19',
  freitag_ab:  '15:00',   // Freitag ab dieser Uhrzeit
  sonntag_bis: '20:00',   // Sonntag bis zu dieser Uhrzeit
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
      { wochentage: [1, 2, 3, 4, 5], von: '14:00', bis: '20:30' }, // Mo–Fr
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
      { wochentage: [2], von: '14:00', bis: '15:00' }, // Di
    ],
  },

  // Vereinstraining – Plätze 1–5 (Mittwoch abend)
  {
    label:   'Vereinstraining',
    plaetze: [1, 2, 3, 4, 5],
    zeiten: [
      { wochentage: [3], von: '18:30', bis: '20:30' }, // Mi
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
