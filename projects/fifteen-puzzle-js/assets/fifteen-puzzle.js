// script.js

// Create the root container where we will render the puzzle grid
const rootContainer = document.getElementById('root');

const infoContainer = document.createElement('div');
infoContainer.classList.add('info-container');

const startButton = document.createElement('div');
startButton.classList.add('start-button');
startButton.textContent = 'Start'; // Add text to the button

const info = document.createElement('div');
info.classList.add("info")

const timeDisplay = document.createElement('div');
timeDisplay.classList.add("time-display");
timeDisplay.textContent = "Time: 0s";
info.appendChild(timeDisplay);

const moveDisplay = document.createElement('div');
moveDisplay.classList.add("move-display");
moveDisplay.textContent = "Moves: 0";
info.appendChild(moveDisplay);

const puzzleContainer = document.createElement('div');
puzzleContainer.classList.add('puzzle-container');

// Create the puzzle container (this is the grid wrapper)
const gridContainer = document.createElement('div');
gridContainer.id = 'grid-container'; // Same as in CSS

// Store the tiles for later reference
let tiles = [];

// Timer variables
let timer;
let seconds = 0;
let moveCount = 0;
let isRunning = false;

// Function to create the tiles dynamically
function createTiles() {
    const totalTiles = 16; // 4x4 grid, so 16 tiles in total

    for (let i = 0; i < totalTiles; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile'); // Add the tile class
        
        if (i === totalTiles - 1) {
            // Last tile is the empty space
            tile.id = 'tile-empty';
            tile.classList.add('empty');
        } else {
            tile.textContent = i + 1; // Fill numbers for the tiles
            tile.id = `tile-${i + 1}`;
        }

        // Add each tile to the puzzle container
        gridContainer.appendChild(tile);
        tiles.push(tile);
    }
}

// Function to find the empty tile (empty space)
function findEmptyTile() {
    return tiles.find(tile => tile.classList.contains('empty'));
}

// Function to check if two tiles are adjacent (either horizontally or vertically)
function isAdjacent(tile1, tile2) {
    const index1 = tiles.indexOf(tile1);
    const index2 = tiles.indexOf(tile2);
    // Check if they are adjacent in a 4x4 grid
    const row1 = Math.floor(index1 / 4);
    const col1 = index1 % 4;
    const row2 = Math.floor(index2 / 4);
    const col2 = index2 % 4;

    const diffRow = Math.abs(row1 - row2);
    const diffCol = Math.abs(col1 - col2);

    return (diffRow === 1 && diffCol === 0) || (diffRow === 0 && diffCol === 1);
}

// Function to move the tile
function moveTile(clickedTile) {

    if(!isRunning) 
        return; 
    const emptyTile = findEmptyTile();

    // Check if the clicked tile is adjacent to the empty tile
    if (isAdjacent(clickedTile, emptyTile)) {
        // Increment the move counter on screen
        incrementMoveCounter();
        // Swap the positions of the clicked tile and the empty tile
        const clickedTileText = clickedTile.textContent;
        const emptyTileText = emptyTile.textContent;

        // Swap the text content
        clickedTile.textContent = emptyTileText;
        emptyTile.textContent = clickedTileText;

        // Swap the class to mark the empty tile
        clickedTile.classList.add('empty');
        emptyTile.classList.remove('empty');

        checkIfSolved();
    }
}

function incrementMoveCounter() {
    moveCount++;
    moveDisplay.textContent = `Moves: ${moveCount}`;
}

function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timeDisplay.textContent = "Time: 0s";
    isRunning = true;
    timer = setInterval(() => {
        seconds++;
        timeDisplay.textContent = `Time: ${seconds}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
    isRunning = false;
}

function generateSolvableGrid() {
    stopTimer();
    startTimer();
    
    let numbers = Array.from({ length: 15 }, (_, i) => i + 1); // Numbers 1-15
    numbers.push(null); // The empty tile

    do {
        numbers = shuffleArray(numbers);
    } while (!isSolvable(numbers));

    // Assign shuffled numbers to tiles
    tiles.forEach((tile, index) => {
        if (numbers[index] === null) {
            tile.textContent = '';
            tile.classList.add('empty');
        } else {
            tile.textContent = numbers[index];
            tile.classList.remove('empty');
        }
    });
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to check if the grid configuration is solvable
function isSolvable(arr) {
    let inversions = 0;
    const flatArr = arr.filter(num => num !== null);

    for (let i = 0; i < flatArr.length; i++) {
        for (let j = i + 1; j < flatArr.length; j++) {
            if (flatArr[i] > flatArr[j]) inversions++;
        }
    }

    const emptyIndex = arr.indexOf(null);
    const emptyRow = Math.floor(emptyIndex / 4);

    return (inversions % 2 === 0) === (emptyRow % 2 !== 0);
}

function checkIfSolved() {
    const currentOrder = tiles.map(tile => tile.textContent.trim());
    const expectedOrder = [...Array(15).keys()].map(i => (i + 1).toString()).concat('');
    if (JSON.stringify(currentOrder) === JSON.stringify(expectedOrder)) {
        stopTimer();
        alert(`Congratulations! You solved the puzzle in ${seconds} seconds and ${moveCount} moves.`);
        isRunning = false;
    }
}

// Function to render the puzzle grid inside the root container
function renderPuzzle() {
    // Create the tiles and append them to the puzzle container
    createTiles();

    infoContainer.appendChild(startButton);
    infoContainer.appendChild(info);
    puzzleContainer.appendChild(infoContainer);
    puzzleContainer.appendChild(gridContainer)
    // Append the puzzle container to the root container
    rootContainer.appendChild(puzzleContainer);


    // Add click event listener to each tile
    tiles.forEach(tile => {
        tile.addEventListener('click', function () {
            if (!tile.classList.contains('empty')) {
                moveTile(tile);
            }
        });
    });
    startButton.addEventListener('click', generateSolvableGrid)
}

// Call the render function
renderPuzzle();
