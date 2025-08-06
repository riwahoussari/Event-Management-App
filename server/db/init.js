const db = require("./db-connection");

// enable foreign keys
db.exec("PRAGMA foreign_keys = ON");

// create table IF NOT EXISTSs
function createTables() {
  db.serialize(() => {
    // users Table
    db.run(
      `
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            account_type TEXT NOT NULL CHECK(account_type IN ('regular', 'organizer', 'admin')) DEFAULT 'regular',
            account_status TEXT NOT NULL CHECK(account_status IN ('active', 'suspended')) DEFAULT 'active',
            date_joined TEXT NOT NULL, 
            profile_pic TEXT, 
            fullname TEXT NOT NULL COLLATE NOCASE,
            gender TEXT NOT NULL CHECK(gender IN ('female', 'male')),
            email TEXT NOT NULL UNIQUE COLLATE NOCASE,
            phone_number TEXT,
            birthday TEXT, 
            organizer_name TEXT,
            promotion_date TEXT, 
            password_hash TEXT NOT NULL
        );
    `,
      (err) => {
        if (err)
          return console.error("Error creating users table:", err.message);
        console.log("✅ Users table created successfully.");
      }
    );

    // categories Table
    db.run(
      `
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY,
            category_name TEXT NOT NULL UNIQUE,
            date_created TEXT NOT NULL -- 'YYYY-MM-DD'
        );
    `,
      (err) => {
        if (err)
          return console.error("Error creating categories table:", err.message);
        console.log("✅ categories table created successfully.");
      }
    );

    // events Table
    db.run(
      `
        CREATE TABLE IF NOT EXISTS events (
            id INTEGER PRIMARY KEY,
            organizer_id INTEGER NOT NULL,
            date_created TEXT NOT NULL, -- 'YYYY-MM-DD'
            event_banner TEXT NOT NULL, -- file path or URL
            category INTEGER NOT NULL,
            title TEXT NOT NULL COLLATE NOCASE ,
            description TEXT NOT NULL,
            country TEXT NOT NULL COLLATE NOCASE,
            city TEXT NOT NULL COLLATE NOCASE,
            full_address TEXT NOT NULL,
            start_date TEXT NOT NULL, -- 'YYYY-MM-DD'
            start_time TEXT NOT NULL, -- 'HH:MM'
            end_date TEXT NOT NULL, -- 'YYYY-MM-DD'
            end_time TEXT NOT NULL, -- 'HH:MM'
            tags TEXT COLLATE NOCASE, -- comma-separated
            max_capacity INTEGER,
            registration_deadline_date TEXT NOT NULL, -- 'YYYY-MM-DD'
            registration_deadline_time TEXT NOT NULL, -- 'HH:MM'
            cancellation_deadline_date TEXT NOT NULL, -- 'YYYY-MM-DD'
            cancellation_deadline_time TEXT NOT NULL, -- 'HH:MM'
            views_count INTEGER DEFAULT 0,
            status TEXT NOT NULL CHECK(status IN ('active', 'cancelled', 'removed')) DEFAULT 'active',
            FOREIGN KEY (organizer_id) REFERENCES users(id),
            FOREIGN KEY (category) REFERENCES categories(id)
        );
    `,
      (err) => {
        if (err)
          return console.error("Error creating events table:", err.message);
        console.log("✅ events table created successfully.");
      }
    );

    // promotion_requests Table
    db.run(
      `
        CREATE TABLE IF NOT EXISTS promotion_requests (
            user_id INTEGER NOT NULL,
            status TEXT NOT NULL CHECK(status IN ('pending', 'accepted', 'rejected')) DEFAULT 'pending',
            request_date TEXT NOT NULL, -- 'YYYY-MM-DD'
            requested_organizer_name TEXT NOT NULL,
            why_message TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        );
    `,
      (err) => {
        if (err)
          return console.error(
            "Error creating promotion_requests table:",
            err.message
          );
        console.log("✅ promotion_requests table created successfully.");
      }
    );

    // likes Table
    db.run(
      `
        CREATE TABLE IF NOT EXISTS likes (
            user_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (event_id) REFERENCES events(id),
            PRIMARY KEY (user_id, event_id)
        );
    `,
      (err) => {
        if (err)
          return console.error("Error creating likes table:", err.message);
        console.log("✅ likes table created successfully.");
      }
    );

    // registrations Table
    db.run(
      `
        CREATE TABLE IF NOT EXISTS registrations (
            user_id INTEGER NOT NULL,
            event_id INTEGER NOT NULL,
            registration_date TEXT NOT NULL, -- 'YYYY-MM-DD'
            status TEXT NOT NULL CHECK(status IN ('active', 'cancelled', 'denied')) DEFAULT 'active',
            attendance TEXT CHECK(attendance IN ('true', 'false')) DEFAULT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (event_id) REFERENCES events(id),
            PRIMARY KEY (user_id, event_id)
        );
    `,
      (err) => {
        if (err)
          return console.error(
            "Error creating registrations table:",
            err.message
          );
        console.log("✅ registrations table created successfully.");
      }
    );
  });
}
createTables()

db.close()