const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- ROUTES ---

// 1. GET All Sets
app.get('/api/sets', (req, res) => {
    const sql = `SELECT * FROM vocab_sets ORDER BY createdAt DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });

        // Fetch words for each set to match old legacy format expected by client
        const promises = rows.map(set => {
            return new Promise((resolve, reject) => {
                db.all(`SELECT * FROM words WHERE setId = ?`, [set.id], (err, words) => {
                    if (err) resolve({ ...set, words: [] });
                    else resolve({ ...set, words: words });
                });
            });
        });

        Promise.all(promises).then(fullSets => {
            res.json(fullSets);
        });
    });
});

// 2. CREATE Set
app.post('/api/sets', (req, res) => {
    const { id, timestamp, words } = req.body;
    const wordCount = words ? words.length : 0;

    const sqlSet = `INSERT INTO vocab_sets (id, timestamp, wordCount) VALUES (?, ?, ?)`;

    db.run(sqlSet, [id, timestamp, wordCount], function (err) {
        if (err) return res.status(400).json({ error: err.message });

        if (words && words.length > 0) {
            const sqlWord = `INSERT INTO words (setId, word, ipa, type, meaning, example) VALUES (?, ?, ?, ?, ?, ?)`;
            const stmt = db.prepare(sqlWord);
            words.forEach(w => {
                stmt.run(id, w.word, w.ipa || '', w.type || '', w.meaning || '', w.example || '');
            });
            stmt.finalize();
        }
        res.json({ message: "Set saved successfully", id: id });
    });
});

// 3. DELETE Set
app.delete('/api/sets/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM vocab_sets WHERE id = ?`, id, function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Deleted", changes: this.changes });
    });
});

// 4. GET Results
app.get('/api/results', (req, res) => {
    db.all(`SELECT * FROM game_results ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

// 5. SAVE Result
app.post('/api/results', (req, res) => {
    const { id, type, setName, result, timestamp } = req.body;
    const sql = `INSERT INTO game_results (timestamp, type, setName, result, dateFormatted) VALUES (?, ?, ?, ?, ?)`;
    db.run(sql, [id, type, setName, result, timestamp], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Result saved", id: this.lastID });
    });
});

// 6. Cleanup Endpoint (or auto-run)
app.post('/api/cleanup', (req, res) => {
    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const cutoff = now - sevenDays;

    db.run(`DELETE FROM game_results WHERE timestamp < ?`, [cutoff], function (err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: `Cleaned up ${this.changes} old results` });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
