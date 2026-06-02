// api/upload-image.mjs – Vercel Serverless Function
// Lädt ein Bild in public/images/news/ des GitHub-Repos hoch.

const OWNER  = 'rathmayers';
const REPO   = 'tc-holzkirchen';
const BRANCH = 'main';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const MAX_SIZE_MB   = 5;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN nicht konfiguriert' });

  const { filename, content, mimeType } = req.body ?? {};
  if (!filename || !content || !mimeType)
    return res.status(400).json({ error: 'filename, content und mimeType erforderlich' });

  if (!ALLOWED_TYPES.includes(mimeType))
    return res.status(400).json({ error: 'Nur JPEG, PNG, WebP und GIF erlaubt' });

  // Größe prüfen (Base64 ist ~33% größer als Original)
  const sizeBytes = (content.length * 3) / 4;
  if (sizeBytes > MAX_SIZE_MB * 1024 * 1024)
    return res.status(400).json({ error: `Bild zu groß (max. ${MAX_SIZE_MB} MB)` });

  // Dateiname bereinigen
  const safeName = filename
    .toLowerCase()
    .replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
    .replace(/[^a-z0-9._-]/g, '-')
    .replace(/-+/g, '-');

  const path   = `public/images/news/${safeName}`;
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  const headers = {
    Authorization:  `Bearer ${token}`,
    Accept:         'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent':   'TCH-Admin',
  };

  // Bestehendes SHA holen (falls Datei schon existiert)
  let sha;
  try {
    const existing = await fetch(apiUrl, { headers });
    if (existing.ok) sha = (await existing.json()).sha;
  } catch (_) {}

  const body = {
    message: `bild: ${safeName} hochgeladen`,
    content,   // bereits Base64
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

  return res.status(200).json({
    success: true,
    url: `/images/news/${safeName}`,
  });
}
