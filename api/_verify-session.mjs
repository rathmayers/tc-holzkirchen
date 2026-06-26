// api/_verify-session.mjs – prüft den Session-Token aus dem Authorization-Header
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

export function verifySession(req) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const auth = req.headers['authorization'] ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  if (!token) return false;

  const [payloadB64, sig] = token.split('.');
  if (!payloadB64 || !sig) return false;

  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString());
  } catch {
    return false;
  }

  const expectedSig = hmacHex(Buffer.from(payloadB64, 'base64url').toString(), secret);
  if (!safeEqual(sig, expectedSig)) return false;

  if (!payload.exp || Date.now() > payload.exp) return false;

  return true;
}
