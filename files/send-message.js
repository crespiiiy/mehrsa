// Vercel serverless function. Env vars: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID (+ optional SENDER_NAME, ALLOWED_ORIGIN)
const hits = new Map(); // simple per-instance rate limit (use a KV store for stricter limits)
export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ ok: false });
  const origin = process.env.ALLOWED_ORIGIN;
  if (origin && req.headers.origin !== origin) return res.status(403).json({ ok: false });
  const ip = String(req.headers['x-forwarded-for'] || 'x').split(',')[0].trim(), now = Date.now();
  const recent = (hits.get(ip) || []).filter(t => now - t < 600000);
  if (recent.length >= 5) return res.status(429).json({ ok: false });
  hits.set(ip, [...recent, now]);
  const raw = typeof req.body?.message === 'string' ? req.body.message : '';
  const message = raw.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, 1500);
  if (message.length < 2) return res.status(400).json({ ok: false });
  const text = `From: ${process.env.SENDER_NAME || 'Mehrsa'}\nMessage: ${message}\nSource: Tom & Mehrsa — Our Little Universe\nTimestamp: ${new Date().toISOString()}`;
  try {
    const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }) });
    const j = await r.json();
    return res.status(j.ok ? 200 : 502).json({ ok: !!j.ok });
  } catch { return res.status(502).json({ ok: false }); }
}
