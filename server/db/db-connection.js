const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// connect to the database
const dbPath = path.resolve(__dirname, "db.sqlite");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("❌ DB connection error:", err.message);
  else console.log("✅ Connected to SQLite database.");
});

// enable foreign keys
db.run("PRAGMA foreign_keys = ON");

module.exports = db;
