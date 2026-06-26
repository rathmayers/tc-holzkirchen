// api/admin-verify-code.mjs
// Prüft den eingegebenen Code gegen das Pending-Token und gibt einen Session-Token zurück.

import { createHmac, timingSafeEqual } from 'crypto';

function hmacHex(data, secret) {
  return createHmac('sha256', secret).update(data).digest('hex');
}

function safeEqual(a, b) {
  try {
    return timingSafeEqual(Buffer.from(a, 'hex'), Buffer.from(b, 'hex'));
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method not allowed' });

  const secret = process.env.ADMIN_SECRET;
  if (!secret) return res.status(500).json({ error: 'Server nicht konfiguriert' });

  const { pendingToken, otp } = req.body ?? {};
  if (!pendingToken || !otp)
    return res.status(400).json({ error: 'Fehlende Parameter' });

  // Pending-Token verifizieren
  const [payloadB64, tokenSig] = pendingToken.split('.');
  if (!payloadB64 || !tokenSig)
    return res.status(401).json({ error: 'Ungültiger Token' });

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
  } catch {
    return res.status(401).json({ error: 'Ungültiger Token' });
  }

  // Signatur prüfen
  const expectedSig = hmacHex(Buffer.from(payloadB64, 'base64url').toString(), secret);
  if (!safeEqual(tokenSig, expectedSig))
    return res.status(401).json({ error: 'Ungültiger Token' });

  // Ablaufzeit prüfen
  if (!payload.exp || Date.now() > payload.exp)
    return res.status(401).json({ error: 'Code abgelaufen – bitte neuen Code anfordern' });

  // OTP-Hash prüfen
  const otpHash = hmacHex(String(otp).trim(), secret);
  if (!safeEqual(otpHash, payload.otpHash))
    return res.status(401).json({ error: 'Ungültiger Code' });

  // Session-Token ausstellen (8 Stunden gültig)
  const sessionExp = Date.now() + 8 * 60 * 60 * 1000;
  const sessionPayload = JSON.stringify({ email: payload.email, exp: sessionExp });
  const sessionToken = Buffer.from(sessionPayload).toString('base64url') +
    '.' + hmacHex(sessionPayload, secret);

  return res.status(200).json({ success: true, sessionToken });
}
