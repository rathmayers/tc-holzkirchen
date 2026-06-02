// api/delete-news.mjs – Vercel Serverless Function
// Löscht eine MDX-Datei aus dem GitHub-Repository.

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

  const { filename } = req.body ?? {};
  if (!filename || !filename.endsWith('.mdx') || filename.includes('/'))
    return res.status(400).json({ error: 'Ungültiger Dateiname' });

  const path   = `src/content/news/${filename}`;
  const apiUrl = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${encodeURIComponent(path)}`;
  const headers = {
    Authorization:  `Bearer ${token}`,
    Accept:         'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'User-Agent':   'TCH-Admin',
  };

  // SHA holen
  const existing = await fetch(apiUrl, { headers });
  if (!existing.ok) return res.status(404).json({ error: 'Datei nicht gefunden' });
  const { sha } = await existing.json();

  const response = await fetch(apiUrl, {
    method:  'DELETE',
    headers,
    body:    JSON.stringify({ message: `news: ${filename} gelöscht`, sha, branch: BRANCH }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    return res.status(response.status).json({ error: err.message ?? 'GitHub API Fehler' });
  }

  return res.status(200).json({ success: true });
}
