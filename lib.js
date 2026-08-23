// lib.js — email via Resend HTTPS API (SMTP is blocked on Railway).
const mailConfigured = () =>
  !!(process.env.MAIL_FROM && process.env.RESEND_API_KEY);

async function sendMail({ to, subject, text, replyTo }) {
  if (!mailConfigured()) throw new Error("mail not configured");
  const body = {
    from: `Prodaco Services <${process.env.MAIL_FROM}>`,
    to: [to],
    subject,
    text,
  };
  if (replyTo) body.reply_to = replyTo;
  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.RESEND_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  if (!r.ok) {
    const d = await r.json().catch(() => ({}));
    throw new Error(d.message || "Resend error " + r.status);
  }
  return true;
}

module.exports = { sendMail, mailConfigured };
