// server.js — zero-dependency Node server for Prodaco Services.
// Serves ./public as static files, plus POST /api/contact for the enquiry form.
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const db = require("./db.js");
const { sendMail, mailConfigured } = require("./lib.js");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const INFO_INBOX = process.env.INFO_INBOX || "info@prodacoservices.com";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico":  "image/x-icon",
  ".xml":  "application/xml; charset=utf-8",
  ".txt":  "text/plain; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function safePath(url) {
  // Strip query, decode, resolve, and confine to PUBLIC_DIR.
  const clean = decodeURIComponent(url.split("?")[0]);
  let rel = clean === "/" ? "/index.html" : clean;
  if (!path.extname(rel)) rel = rel.replace(/\/?$/, "/index.html");
  const abs = path.join(PUBLIC_DIR, rel);
  if (!abs.startsWith(PUBLIC_DIR)) return null;
  return abs;
}

function serveStatic(req, res) {
  const p = safePath(req.url);
  if (!p) { res.writeHead(400).end("bad path"); return; }
  fs.stat(p, (err, st) => {
    if (err || !st.isFile()) {
      // 404 → send the branded not-found (fall back to plain text)
      const notFound = path.join(PUBLIC_DIR, "404.html");
      fs.readFile(notFound, (e, buf) => {
        if (e) { res.writeHead(404, { "Content-Type": "text/plain" }).end("Not found"); return; }
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" }).end(buf);
      });
      return;
    }
    const ext = path.extname(p).toLowerCase();
    const type = MIME[ext] || "application/octet-stream";
    res.writeHead(200, {
      "Content-Type": type,
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600",
    });
    fs.createReadStream(p).pipe(res);
  });
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let buf = "";
    req.on("data", (c) => { buf += c; if (buf.length > 10_000) reject(new Error("payload too large")); });
    req.on("end", () => {
      try { resolve(buf ? JSON.parse(buf) : {}); } catch { reject(new Error("invalid json")); }
    });
    req.on("error", reject);
  });
}

function json(res, code, obj) {
  res.writeHead(code, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(obj));
}

// Simple per-IP rate limit for /api/contact (5 posts / 10 min)
const bucket = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const rec = bucket.get(ip) || { count: 0, reset: now + 10 * 60_000 };
  if (now > rec.reset) { rec.count = 0; rec.reset = now + 10 * 60_000; }
  rec.count += 1;
  bucket.set(ip, rec);
  return rec.count > 5;
}

async function handleContact(req, res) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "";
  if (rateLimited(ip)) return json(res, 429, { error: "Too many messages from your network. Please try again in a few minutes or call +254 716 767371." });

  let body;
  try { body = await readJson(req); }
  catch (e) { return json(res, 400, { error: e.message }); }

  const s = (v) => String(v || "").trim().slice(0, 2000);
  // Honeypot: silently accept-drop bots that filled the hidden 'website' field.
  // Run BEFORE validation so bots don't get hints about which fields are required.
  if (s(body.website)) return json(res, 200, { ok: true });

  const name = s(body.name), phone = s(body.phone), email = s(body.email),
        county = s(body.county), service = s(body.service), message = s(body.message);

  if (name.length < 2) return json(res, 400, { error: "Please enter your name." });
  if (phone.length < 7) return json(res, 400, { error: "Please enter a phone number so we can call you back." });
  if (message.length < 5) return json(res, 400, { error: "Please tell us a bit about your farm." });

  try {
    db.prepare(`INSERT INTO leads (name, phone, email, county, service, message, ip, user_agent)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`)
      .run(name, phone, email || null, county || null, service || null, message, ip, s(req.headers["user-agent"]));
  } catch (e) {
    console.error("DB insert failed:", e.message);
    return json(res, 400, { error: "Could not save your message. Please call +254 716 767371." });
  }

  if (mailConfigured()) {
    const text = [
      "New enquiry from prodacoservices.com",
      "",
      `Name:    ${name}`,
      `Phone:   ${phone}`,
      `Email:   ${email || "—"}`,
      `County:  ${county || "—"}`,
      `Service: ${service || "—"}`,
      "",
      "Message:",
      message,
      "",
      `IP: ${ip}`,
    ].join("\n");
    try {
      await sendMail({
        to: INFO_INBOX,
        subject: `New enquiry — ${name} (${service || "no service picked"})`,
        text,
        replyTo: email || undefined,
      });
    } catch (e) {
      // Don't fail the user's request if email delivery hiccups — we already saved the lead.
      console.error("Mail send failed:", e.message);
    }
  }
  return json(res, 200, { ok: true });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/contact") return handleContact(req, res);
    if (req.method === "GET"  || req.method === "HEAD")     return serveStatic(req, res);
    res.writeHead(405, { "Content-Type": "text/plain" }).end("method not allowed");
  } catch (e) {
    console.error("Handler error:", e);
    json(res, 400, { error: "Something went wrong. Please call +254 716 767371." });
  }
});

server.listen(PORT, () => {
  console.log(`Prodaco Services listening on :${PORT}`);
  console.log(`  mail: ${mailConfigured() ? "configured (Resend)" : "NOT configured — leads saved but no email"}`);
});
