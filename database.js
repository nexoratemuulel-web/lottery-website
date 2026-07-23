const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./database.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Database connected.");
    }
});

db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS cars (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            model TEXT,
            image TEXT,
            description TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS participants (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            phone TEXT UNIQUE,
            car_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS winners (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            participant_id INTEGER,
            car_id INTEGER,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

});

module.exports = db;