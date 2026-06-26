// api/admin-request-code.mjs
// Generiert einen 6-stelligen Einmal-Code und sendet ihn per E-Mail.
// Benötigt: ADMIN_EMAIL_1, ADMIN_EMAIL_2, ADMIN_SECRET, RESEND_API_KEY

import { createHmac } from 'crypto';

const ALLOWED_EMAILS = () =>
  [process.env.ADMIN_EMAIL_1, process.env.ADMIN_EMAIL_2].filter(Boolean).map(e => e.toLowerCase());

function hmacHex(data, secret) {
  return createHmac('sha256', secret).update(data).digest('hex');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.ADMIN_SECRET;
  const resendKey = process.env.RESEND_API_KEY;
  if (!secret || !resendKey)
    return res.status(500).json({ error: 'Server nicht vollständig konfiguriert' });

  const { email } = req.body ?? {};
  if (!email || typeof email !== 'string')
    return res.status(400).json({ error: 'E-Mail fehlt' });

  const normalizedEmail = email.toLowerCase().trim();

  // Auch wenn die E-Mail nicht bekannt ist, geben wir dieselbe Antwort zurück
  // (verhindert E-Mail-Enumeration)
  if (!ALLOWED_EMAILS().includes(normalizedEmail)) {
    return res.status(200).json({ success: true });
  }

  // 6-stelligen Code generieren
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const exp = Date.now() + 15 * 60 * 1000; // 15 Minuten gültig

  // OTP-Hash + signiertes Pending-Token (client speichert es, server kennt den OTP-Hash darin)
  const otpHash = hmacHex(otp, secret);
  const pendingPayload = JSON.stringify({ email: normalizedEmail, otpHash, exp });
  const pendingToken = Buffer.from(pendingPayload).toString('base64url') +
    '.' + hmacHex(pendingPayload, secret);

  // E-Mail via Resend senden
  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'TC Holzkirchen Admin <noreply@tc-holzkirchen.de>',
      to: normalizedEmail,
      subject: 'Dein Admin-Code – TC Holzkirchen',
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:0 auto;padding:32px">
          <p style="font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#999;margin-bottom:8px">TC Holzkirchen · Admin</p>
          <h1 style="font-size:28px;margin:0 0 24px">Dein Einmal-Code</h1>
          <div style="background:#f5f0ea;padding:24px;text-align:center;font-size:36px;letter-spacing:8px;font-weight:bold;margin-bottom:24px">
            ${otp}
          </div>
          <p style="color:#666;font-size:14px">Dieser Code ist <strong>15 Minuten</strong> gültig.</p>
          <p style="color:#999;font-size:12px;margin-top:32px">Falls du diesen Code nicht angefordert hast, ignoriere diese E-Mail.</p>
        </div>
      `,
    }),
  });

  if (!emailRes.ok) {
    console.error('Resend error:', await emailRes.text());
    return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' });
  }

  return res.status(200).json({ success: true, pendingToken });
}
