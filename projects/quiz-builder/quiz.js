let db;

async function initDB() {
    const SQL = await initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}` });
    return new SQL.Database();
}

// Create a new database from scratch
async function createNewDatabase() {
    db = await initDB();
    alert("New database created!");
    displayTables();
}

// Load an existing database file
document.getElementById("uploadDB").addEventListener("change", async function(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected!");
        return;
    }

    const reader = new FileReader();
    reader.onload = async function(event) {
        try {
            const SQL = await initSqlJs({ locateFile: filename => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${filename}` });
            db = new SQL.Database(new Uint8Array(event.target.result));

            alert("Database loaded successfully!");
            displayTables(); // Ensure tables are displayed after loading
        } catch (error) {
            alert("Error loading database: " + error.message);
            console.error("Error loading database:", error);
        }
    };

    reader.readAsArrayBuffer(file);
});

// Create a new table
function createTable() {
    if (!db) {
        alert("Please create or upload a database first!");
        return;
    }

    const tableName = document.getElementById("tableName").value.trim();
    if (!tableName) {
        alert("Enter a table name!");
        return;
    }

    db.run(`CREATE TABLE IF NOT EXISTS ${tableName} (id INTEGER PRIMARY KEY AUTOINCREMENT);`);
    alert(`Table '${tableName}' created successfully!`);
    displayTables();
}

// Display tables in the database
function displayTables() {
    if (!db) {
        alert("No database is loaded.");
        return;
    }

    const tableList = document.getElementById("table-list");
    tableList.innerHTML = ""; // Clear previous entries

    try {
        const result = db.exec("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';");

        if (result.length === 0) {
            tableList.innerHTML = "<p>No tables found.</p>";
            return;
        }

        result[0].values.forEach(row => {
            const tableName = row[0];
            const li = document.createElement("li");
            li.textContent = tableName;
            tableList.appendChild(li);
        });

        console.log("Tables displayed successfully!");
    } catch (error) {
        console.error("Error displaying tables:", error);
    }
}

// Save the database to a file
function saveDatabase() {
    if (!db) {
        alert("No database to save!");
        return;
    }

    try {
        const binaryArray = db.export();
        const blob = new Blob([binaryArray], { type: "application/x-sqlite3" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "quiz_database.sqlite";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    } catch (error) {
        alert("Error saving database: " + error.message);
        console.error("Error saving database:", error);
    }
}
