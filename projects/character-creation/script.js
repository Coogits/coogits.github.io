// project.js - Character Creation Specific Logic

async function initProjectDB() {
    await initDB();
    createCharacterTable();
}

// Create the 'characters' table with an additional ID field
function createCharacterTable() {
    const query = `
        CREATE TABLE IF NOT EXISTS characters (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idString TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            surname TEXT,
            gender TEXT NOT NULL,
            age INTEGER NOT NULL,
            race TEXT NOT NULL,
            occupation TEXT NOT NULL,
            backstory TEXT
        );
    `;
    const result = runSQL(query);
    if (result.error) {
        console.error("Error creating table:", result.error);
    } else {
        console.log("Table 'characters' created.");
    }
}

// Generate the unique ID
function generateCharacterID() {
    return 'char_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}


// Show characters as a list with Load & Delete buttons
function showCharacterList() {
    const query = "SELECT * FROM characters";
    const result = runSQL(query);

    if (result.error) {
        console.error("Error fetching characters:", result.error);
        return;
    }

    const listContainer = document.getElementById("characterList");
    listContainer.innerHTML = ""; // Clear previous list

    if (result[0] && result[0].columns && result[0].values) {
        const { columns, values } = result[0];

        values.forEach(row => {
            let charObj = {};
            columns.forEach((col, index) => {
                charObj[col] = row[index];
            });

            // 🔹 Generate ID (name + surname or just name)
            const charId = charObj.surname 
                ? `${charObj.name}_${charObj.surname}`.toLowerCase() 
                : charObj.name.toLowerCase();

            // Create a list item for each character
            const listItem = document.createElement("div");
            listItem.classList.add("character-item");

            listItem.innerHTML = `
                <span><strong>${charId}</strong></span>
                <button onclick="loadCharacter(${charObj.id})">Load</button>
                <button onclick="deleteCharacter(${charObj.id})">Delete</button>
            `;

            listContainer.appendChild(listItem);
        });
    }
}


let loadedCharacterId = null; // Keep track of which character is loaded

// SAVE NEW CHARACTER
function saveNewCharacter(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const gender = document.getElementById("gender").value;
    const age = parseInt(document.getElementById("age").value, 10);
    const race = document.getElementById("race").value;
    const occupation = document.getElementById("occupation").value;
    const backstory = document.getElementById("backstory").value;

    if (!name || !gender || isNaN(age) || !race || !occupation) {
        alert("All fields except 'Backstory' and 'Surname' are required!");
        return;
    }

    const idString = generateCharacterID(); // Generate a unique ID

    const insertQuery = `
        INSERT INTO characters (idString, name, surname, gender, age, race, occupation, backstory)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const insertResult = runSQL(insertQuery, [idString, name, surname, gender, age, race, occupation, backstory]);

    if (insertResult.error) {
        console.error("Error inserting character:", insertResult.error);
        return;
    } else {
        logMessage(`Character created: ${name} ${surname}`);
    }

    showCharacterList();
}

// OVERRIDE EXISTING CHARACTER
function overrideCharacter(event) {
    event.preventDefault();

    if (!loadedCharacterId) {
        alert("No character is loaded to override!");
        return;
    }

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const gender = document.getElementById("gender").value;
    const age = parseInt(document.getElementById("age").value, 10);
    const race = document.getElementById("race").value;
    const occupation = document.getElementById("occupation").value;
    const backstory = document.getElementById("backstory").value;

    if (!name || !gender || isNaN(age) || !race || !occupation) {
        alert("All fields except 'Backstory' and 'Surname' are required!");
        return;
    }

    const updateQuery = `
        UPDATE characters
        SET name = ?, surname = ?, gender = ?, age = ?, race = ?, occupation = ?, backstory = ?
        WHERE id = ?;
    `;
    const updateResult = runSQL(updateQuery, [name, surname, gender, age, race, occupation, backstory, loadedCharacterId]);

    if (updateResult.error) {
        console.error("Error updating character:", updateResult.error);
        return;
    } else {
        logMessage(`Character updated: ${name} ${surname}`);
    }

    showCharacterList();
}

// LOAD CHARACTER INTO FORM
function loadCharacter(characterId) {
    if (!characterId) {
        resetForm();
        return;
    }

    const query = "SELECT * FROM characters WHERE id = ?";
    const result = runSQL(query, [characterId]);

    if (result.error || !result[0] || !result[0].values.length) {
        console.error("Error fetching character:", result.error);
        return;
    }

    const { columns, values } = result[0];
    const row = values[0];

    let character = {};
    columns.forEach((col, index) => {
        character[col] = row[index];
    });

    // Populate form fields
    document.getElementById("name").value = character.name;
    document.getElementById("surname").value = character.surname || "";
    document.getElementById("gender").value = character.gender;
    document.getElementById("age").value = character.age;
    document.getElementById("race").value = character.race;
    document.getElementById("occupation").value = character.occupation;
    document.getElementById("backstory").value = character.backstory || "";

    loadedCharacterId = characterId; // Track the loaded character
}

// RESET FORM
function resetForm() {
    document.getElementById("character-form").reset();
    loadedCharacterId = null; // No character is loaded
}

// DELETE CHARACTER
function deleteCharacter(characterId) {
    if (!confirm("Are you sure you want to delete this character?")) {
        return;
    }

    const query = "DELETE FROM characters WHERE id = ?";
    const result = runSQL(query, [characterId]);

    if (result.error) {
        console.error("Error deleting character:", result.error);
        return;
    }

    logMessage("Character deleted.");
    showCharacterList();
}

// UNIQUE ID GENERATOR
function generateCharacterID() {
    return 'char_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
}

// BIND BUTTONS
document.getElementById("save-new").addEventListener("click", saveNewCharacter);
document.getElementById("override").addEventListener("click", overrideCharacter);


// Log messages
function logMessage(message) {
    const logContainer = document.getElementById('log-container');
    const logMessage = document.createElement('p');
    logMessage.textContent = message;
    logContainer.appendChild(logMessage);
    logContainer.scrollTop = logContainer.scrollHeight;
}


// Initialize database on load
initProjectDB();
