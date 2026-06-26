// api/save-platzbelegung.mjs – Vercel Serverless Function
// Schreibt src/data/platzbelegung.js direkt ins GitHub-Repository.
// Benötigt Umgebungsvariable: GITHUB_TOKEN (Personal Access Token mit contents:write)

import { verifySession } from './_verify-session.mjs';

const OWNER  = 'rathmayers';
const REPO   = 'tc-holzkirchen';
const BRANCH = 'main';
const PATH   = 'src/data/platzbelegung.js';

function generateJS(data) {
  const { medenspieleTermine, medenspiele, schulferien, belegungen } = data;

  const termineLines = medenspieleTermine.map(t => {
    const zeitenLines = t.zeiten.map(z => {
      const mannschaften = JSON.stringify(z.mannschaften);
      const plaetze = z.plaetze ? `, plaetze: ${JSON.stringify(z.plaetze)}` : '';
      const bis     = z.bis     ? `, bis: '${z.bis}'` : '';
      return `    { von: '${z.von}', mannschaften: ${mannschaften}${plaetze}${bis} },`;
    });
    return `  { datum: '${t.datum}', zeiten: [\n${zeitenLines.join('\n')}\n  ]},`;
  });

  const schulferienLines = schulferien.map(s =>
    `  { label: '${s.label}', vonDatum: '${s.vonDatum}', bisDatum: '${s.bisDatum}' },`
  );

  const belegungLines = belegungen.map(b => {
    const zeitenLines = b.zeiten.map(z => {
      const wt = JSON.stringify(z.wochentage);
      return `      { wochentage: ${wt}, von: '${z.von}', bis: '${z.bis}' },`;
    });
    const vonDatum = b.vonDatum ? `\n    vonDatum: '${b.vonDatum}',` : '';
    const bisDatum = b.bisDatum ? `\n    bisDatum: '${b.bisDatum}',` : '';
    return `  {\n    label:    '${b.label}',\n    plaetze:  ${JSON.stringify(b.plaetze)},${vonDatum}${bisDatum}\n    zeiten: [\n${zeitenLines.join('\n')}\n    ],\n  },`;
  });

  return `// ─── Platzbelegung TC Holzkirchen ─────────────────────────────────────────
// Wochentage nach JavaScript Date.getDay(): 0=So, 1=Mo, 2=Di, 3=Mi, 4=Do, 5=Fr, 6=Sa

// ── Medenspiele-Heimspieltage (Plätze 1–5 orange ab angegebener Uhrzeit) ──
// datum: 'YYYY-MM-DD', von: frühester Anpfiff des Tages
export const MEDENSPIELE_TERMINE = [
${termineLines.join('\n')}
];

// Für den Hero-Statusdot: generelle Medenspiele-Saison (Fallback)
export const MEDENSPIELE = {
  vonDatum:    '${medenspiele.vonDatum}',
  bisDatum:    '${medenspiele.bisDatum}',
};

// ── Schulferien (für Lücken im Belegungsplan) ─────────────────────────────
export const SCHULFERIEN = [
${schulferienLines.join('\n')}
];

// ── Feste Belegungen (rot) ────────────────────────────────────────────────
// Jeder Eintrag belegt einen oder mehrere Plätze zu definierten Zeiten.
// vonDatum / bisDatum optional – fehlt der Wert, gilt die Belegung ganzjährig.
export const BELEGUNGEN = [

${belegungLines.join('\n\n')}

];
`;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });
  if (!verifySession(req))      return res.status(401).json({ error: 'Nicht autorisiert' });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN nicht konfiguriert' });

  const { medenspieleTermine, medenspiele, schulferien, belegungen } = req.body ?? {};
  if (!medenspieleTermine || !medenspiele || !schulferien || !belegungen)
    return res.status(400).json({ error: 'Unvollständige Daten' });

  const jsContent = generateJS({ medenspieleTermine, medenspiele, schulferien, belegungen });

  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(PATH)}`;
  const headers = {
    Authorization:  `Bearer ${token}`,
    Accept:         'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent':   'TCH-Admin',
  };

  let sha;
  try {
    const existing = await fetch(apiUrl, { headers });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch (_) {}

  const body = {
    message: 'platzbelegung: Termine aktualisiert (Admin)',
    content: Buffer.from(jsContent, 'utf-8').toString('base64'),
    branch:  BRANCH,
  };
  if (sha) body.sha = sha;

  const response = await fetch(apiUrl, {
    method:  'PUT',
    headers,
    body:    JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return res.status(response.status).json({ error: err.message ?? 'GitHub API Fehler' });
  }

  return res.status(200).json({ success: true });
}
