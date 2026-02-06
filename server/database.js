const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Connect to SQLite database
const dbPath = path.resolve(__dirname, 'visual_vocab.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Could not connect to database', err);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create Tables
db.serialize(() => {
    // 1. Sets Table
    db.run(`CREATE TABLE IF NOT EXISTS vocab_sets (
        id TEXT PRIMARY KEY,
        timestamp TEXT,
        wordCount INTEGER,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Words Table
    db.run(`CREATE TABLE IF NOT EXISTS words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        setId TEXT,
        word TEXT,
        ipa TEXT,
        type TEXT,
        meaning TEXT,
        example TEXT,
        FOREIGN KEY(setId) REFERENCES vocab_sets(id) ON DELETE CASCADE
    )`);

    // 3. Game Results Table
    db.run(`CREATE TABLE IF NOT EXISTS game_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        timestamp TEXT, -- Original ID from client
        type TEXT,
        setName TEXT,
        result TEXT,
        dateFormatted TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

module.exports = db;
