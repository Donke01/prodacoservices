// db.js — SQLite via node:sqlite (Node 22.5+). Stores contact-form leads.
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const db = new DatabaseSync(process.env.DB_PATH || path.join(__dirname, "prodaco.db"));
try { db.exec("PRAGMA journal_mode = WAL"); } catch {}
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  county TEXT,
  service TEXT,
  message TEXT NOT NULL,
  source TEXT DEFAULT 'contact-form',
  status TEXT NOT NULL DEFAULT 'new',       -- new | contacted | closed
  ip TEXT,
  user_agent TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_leads_created ON leads(created_at DESC);
`);

module.exports = db;
