const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS test (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  )`);
});

module.exports = db;
