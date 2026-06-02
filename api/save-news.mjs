// api/save-news.mjs – Vercel Serverless Function
// Schreibt eine MDX-Datei direkt in das GitHub-Repository.
// Benötigt Umgebungsvariable: GITHUB_TOKEN (Personal Access Token mit contents:write)

const OWNER  = 'rathmayers';
const REPO   = 'tc-holzkirchen';
const BRANCH = 'main';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const token = process.env.GITHUB_TOKEN;
  if (!token) return res.status(500).json({ error: 'GITHUB_TOKEN nicht konfiguriert' });

  const { filename, content } = req.body ?? {};
  if (!filename || !content)
    return res.status(400).json({ error: 'filename und content erforderlich' });

  // Nur .mdx-Dateien im news-Verzeichnis erlaubt
  if (!filename.endsWith('.mdx') || filename.includes('/'))
    return res.status(400).json({ error: 'Ungültiger Dateiname' });

  const path   = `src/content/news/${filename}`;
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  const headers = {
    Authorization:  `Bearer ${token}`,
    Accept:         'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent':   'TCH-Admin',
  };

  // Bestehendes SHA holen (nötig für Updates)
  let sha;
  try {
    const existing = await fetch(apiUrl, { headers });
    if (existing.ok) {
      const data = await existing.json();
      sha = data.sha;
    }
  } catch (_) {}

  const body = {
    message: sha ? `news: ${filename} aktualisiert` : `news: ${filename} erstellt`,
    content: Buffer.from(content, 'utf-8').toString('base64'),
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

  return res.status(200).json({ success: true, action: sha ? 'updated' : 'created' });
}
