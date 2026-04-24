// api/spielplan.mjs – Vercel Serverless Function
//
// Kombiniert:
// 1. Statische Mannschaftsdaten (aus btv.de bekannt, jährlich anpassen)
// 2. Dynamische Ansprechpartner von btv.de (serverseitig lesbar)
// 3. Links zu tennis.de Spielplan

const BTV_URL = 'https://www.btv.de/de/mein-verein/vereinsseite/tc-holzkirchen.html';

// ── Statische Vereins- & Mannschaftsdaten (Saison 2025) ───────────────
// Quelle: btv.de/de/mein-verein/vereinsseite/tc-holzkirchen.html
// Bitte jährlich zu Saisonbeginn aktualisieren
const VEREINSINFO = {
  name:              'TC Holzkirchen e.V.',
  gruendung:         '1958',
  vereinsnr:         '02166',
  adresse:           'Krankenhausstr. 8, 83607 Holzkirchen',
  freiplätze:        '6',
  hallenplätze:      '0',
  wettspielplätze:   '5',
  mitgliederGesamt:  '486',
  mitgliederJugend:  '179',
  mitgliederErwachsen: '307',
};

const MANNSCHAFTEN = [
  { name: 'Herren',          kategorie: 'Aktive',   fuehrer: 'Felix Schneider' },
  { name: 'Herren 30',       kategorie: 'Senioren', fuehrer: 'Christoph Benkert / Jan Depping' },
  { name: 'Herren 40',       kategorie: 'Senioren', fuehrer: 'Christian Heimerl' },
  { name: 'Herren 50',       kategorie: 'Senioren', fuehrer: 'Christian Neubauer' },
  { name: 'Herren 70',       kategorie: 'Senioren', fuehrer: 'Peter Gerds' },
  { name: 'Damen 30',        kategorie: 'Damen',    fuehrer: 'Marlies Vetterl' },
  { name: 'Damen 50',        kategorie: 'Damen',    fuehrer: 'Ulrike Schneider' },
  { name: 'Damen 50 II',     kategorie: 'Damen',    fuehrer: 'Sabine Schmid' },
  { name: 'Junioren 18',     kategorie: 'Jugend',   fuehrer: 'Vinzenz Schuler' },
  { name: 'Junioren 18 II',  kategorie: 'Jugend',   fuehrer: 'Julian Franzky' },
  { name: 'Knaben 15',       kategorie: 'Jugend',   fuehrer: 'Tom Weichert' },
  { name: 'Knaben 15 II',    kategorie: 'Jugend',   fuehrer: 'Leopold Vetterl' },
  { name: 'Knaben 15 III',   kategorie: 'Jugend',   fuehrer: 'Philip Häcker' },
  { name: 'Bambini 12',      kategorie: 'Jugend',   fuehrer: 'Sebastian Depping' },
  { name: 'Bambini 12 II',   kategorie: 'Jugend',   fuehrer: 'Lilienne Doussal' },
  { name: 'Dunlop Midcourt U10', kategorie: 'Jugend', fuehrer: 'Tom Merzinger' },
];

const HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'de-DE,de;q=0.9',
};

export default async function handler(req, res) {
  // Ansprechpartner & Begegnungen von btv.de laden (best effort)
  let ansprechpartner = [];
  let begegnungen     = [];

  try {
    const res = await fetch(BTV_URL, { headers: HEADERS });
    if (res.ok) {
      const html      = await res.text();
      ansprechpartner = parseAnsprechpartner(html);
      begegnungen     = parseBegegnungen(html);
    }
  } catch (err) {
    console.warn('btv.de nicht erreichbar:', err.message);
  }

  // Trennen: Vorstand/Funktionäre vs. Mannschaftsführer
  const MF_KEYWORDS = ['herren', 'damen', 'junioren', 'knaben', 'mädchen', 'bambini', 'midcourt', '(4er)'];
  const istMF = (p) => MF_KEYWORDS.some(kw => p.funktion.toLowerCase().includes(kw));

  const vorstand           = ansprechpartner.filter(p => !istMF(p));
  const mannschaftsfuehrer = ansprechpartner.filter(p =>  istMF(p));

  // Kontaktdaten der Mannschaftsführer in Mannschaftsliste einpflegen
  const mannschaftenMitKontakt = MANNSCHAFTEN.map(m => {
    const mf = mannschaftsfuehrer.find(p =>
      p.funktion.toLowerCase().includes(m.name.toLowerCase()) ||
      m.name.toLowerCase().split(' ').filter(w => w.length > 2)
        .every(w => p.funktion.toLowerCase().includes(w))
    );
    return {
      ...m,
      fuehrer: mf?.name    ?? m.fuehrer,
      mobil:   mf?.mobil   ?? '',
      telefon: mf?.telefon ?? '',
      email:   mf?.email   ?? '',
    };
  });

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  return res.status(200).json({
      abgerufen:        new Date().toISOString(),
      vereinsinfo:      VEREINSINFO,
      mannschaften:     mannschaftenMitKontakt,
      begegnungen,
      vorstand,
      mannschaftsfuehrer,
      ansprechpartner,
  });
}

// ── Ansprechpartner aus btv.de HTML ──────────────────────────────────
function parseAnsprechpartner(html) {
  const personen = [];

  // btv.de rendert: <h3>Name</h3>\nFunktion\nTelefon: ...\nMobil: ...
  const h3Regex = /<h3[^>]*>([\s\S]*?)<\/h3>([\s\S]*?)(?=<h3|<h2|<footer|$)/gi;
  let m;

  while ((m = h3Regex.exec(html)) !== null) {
    const name   = stripTags(m[1]).trim();
    const block  = m[2];

    if (!name || name.length < 3 || name.length > 60) continue;
    // Nur Personen (keine Sektionsüberschriften)
    if (name.match(/^(Funktionäre|Mannschaftsführer|Ansprechpartner|Verein|Plätze|Mitglieder)$/i)) continue;

    const funktion  = extractFunktion(block);
    const telMatch  = /(?:Telefon|Tel\.)[:\s]+([\d\s\/\-\+\.]+)/i.exec(block);
    const mobMatch  = /Mobil[:\s]+([\d\s\/\-\+\.]+)/i.exec(block);
    const mailMatch = /mailto:([^\s"'<>]+)/i.exec(block);

    personen.push({
      name,
      funktion:  funktion || '',
      telefon:   telMatch  ? telMatch[1].replace(/\s+/g,' ').trim() : '',
      mobil:     mobMatch  ? mobMatch[1].replace(/\s+/g,' ').trim() : '',
      email:     mailMatch ? mailMatch[1].trim() : '',
    });
  }

  // Deduplizieren: gleicher Name + gleiche Funktion
  return personen
    .filter((p, i, arr) =>
      arr.findIndex(x => x.name === p.name && x.funktion === p.funktion) === i
    )
    .slice(0, 50);
}

// ── Begegnungen aus btv.de (falls vorhanden) ─────────────────────────
function parseBegegnungen(html) {
  const begegnungen = [];
  const rows = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) ?? [];

  for (const row of rows) {
    const zellen = (row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi) ?? [])
      .map(td => stripTags(td).replace(/\s+/g,' ').trim())
      .filter(Boolean);

    if (zellen.length < 3) continue;
    const datumZelle = zellen.find(c => /\d{2}\.\d{2}\.\d{4}/.test(c));
    if (!datumZelle) continue;

    const datum    = datumZelle.match(/\d{2}\.\d{2}\.\d{4}/)[0];
    const uhrzeit  = zellen.find(c => /^\d{2}:\d{2}$/.test(c.trim())) ?? '';
    const ergebnis = zellen.find(c => /^\d{1,2}:\d{1,2}$/.test(c.trim())) ?? '';
    const namen    = zellen.filter(c =>
      c.length >= 4 &&
      !/^\d{2}\.\d{2}\.\d{4}/.test(c) &&
      !/^\d{2}:\d{2}$/.test(c) &&
      !/^\d{1,2}:\d{1,2}$/.test(c) &&
      !/^\d+$/.test(c)
    );

    const heim = namen[0] ?? '';
    const gast = namen[1] ?? '';
    if (!heim) continue;

    begegnungen.push({
      datum, uhrzeit,
      heim:     heim.substring(0, 80),
      gast:     gast.substring(0, 80),
      ergebnis,
      istHeim:  heim.toLowerCase().includes('holzkirchen'),
      gespielt: !!ergebnis,
    });
  }

  return begegnungen
    .sort((a,b) => a.datum.split('.').reverse().join('').localeCompare(b.datum.split('.').reverse().join('')))
    .slice(0, 100);
}

// ── Hilfsfunktionen ───────────────────────────────────────────────────
function stripTags(html) {
  return (html ?? '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g,'&').replace(/&nbsp;/g,' ')
    .replace(/&uuml;/g,'ü').replace(/&auml;/g,'ä')
    .replace(/&ouml;/g,'ö').replace(/&szlig;/g,'ß')
    .replace(/\s+/g,' ').trim();
}

function extractFunktion(block) {
  // Erster Textinhalt nach dem Namen-Tag, vor Telefon/Mobil
  const m = /<(?:p|div|span|li)[^>]*>\s*([A-Za-zÄÖÜäöüß\/\s\-\.]{5,60})\s*<\//.exec(block);
  if (m) return stripTags(m[1]).trim();
  // Fallback: erste Zeile mit Text
  const lines = stripTags(block).split('\n').map(l => l.trim()).filter(l => l.length > 4 && !l.match(/^(Tel|Mob|Schreiben)/i));
  return lines[0]?.substring(0, 60) || '';
}
