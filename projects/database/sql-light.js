// sql-light.js - Database Initialization and SQL Runner

let db;

// Initialize SQLite in-memory database
async function initDB() {
    if (typeof initSqlJs === 'undefined') return console.error("initSqlJs is not defined.");

    try {
        const SQL = await initSqlJs({
            locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}`
        });
        db = new SQL.Database();
        console.log("Database initialized.");
    } catch (error) {
        console.error("Failed to initialize database:", error);
    }
}

// Function to run SQL commands (generic)
function runSQL(sql, params = []) {
    if (!db) return console.error("Database not initialized!");
    try {
        return db.exec(sql, params);  // Pass parameters to avoid SQL injection
    } catch (error) {
        console.error("Error executing SQL:", error.message);
        return { error: error.message };
    }
}

