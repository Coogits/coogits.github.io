// script.js

// Create the root container where we will render the puzzle grid
const rootContainer = document.getElementById('root');

const infoContainer = document.createElement('div');
infoContainer.classList.add('info-container');

const startButton = document.createElement('div');
startButton.classList.add('start-button');
startButton.textContent = 'Start'; // Add text to the button

const puzzleContainer = document.createElement('div');
puzzleContainer.classList.add('puzzle-container');

// Create the puzzle container (this is the grid wrapper)
const gridContainer = document.createElement('div');
gridContainer.id = 'grid-container'; // Same as in CSS

// Store the tiles for later reference
let tiles = [];

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
    const emptyTile = findEmptyTile();

    // Check if the clicked tile is adjacent to the empty tile
    if (isAdjacent(clickedTile, emptyTile)) {
        // Swap the positions of the clicked tile and the empty tile
        const clickedTileText = clickedTile.textContent;
        const emptyTileText = emptyTile.textContent;

        // Swap the text content
        clickedTile.textContent = emptyTileText;
        emptyTile.textContent = clickedTileText;

        // Swap the class to mark the empty tile
        clickedTile.classList.add('empty');
        emptyTile.classList.remove('empty');
    }
}

function generateSolvableGrid(){
    console.log('hello');
}

// Function to render the puzzle grid inside the root container
function renderPuzzle() {
    // Create the tiles and append them to the puzzle container
    createTiles();

    infoContainer.appendChild(startButton);
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
