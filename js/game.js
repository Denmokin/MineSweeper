'use strict'


// Global Level Setting.
const gLevel = {
    SIZE: 8,
    MINES: 12,
    EMPTYCELLS: 0,
}

// Global Game Properties.
const gGame = {
    isOn: false,
    revealedCount: 0,
    emptyCells: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
}

// Global Arrays.
var gBoard = []
var gAllCellCoords = []
var gMineCoords = []


const gDifficulty = [
    { SIZE: 4, MINES: 2, },
    { SIZE: 8, MINES: 12, },
    { SIZE: 12, MINES: 32, },
]

// Global Icons.
const MARKED = '🚩'
const MINE = '💣'
const UNMARKED = ''
const SMILE = '😀'
const LOSE = '😵'
const WIN = '😎'
const SHOCK = '😮'
const OUTCH = '😖'
const LIFE = '❤️'
const HIT = '💔'



function onInit() {

    // Game Properties Set.
    gGame.markedCount = gLevel.MINES
    gGame.emptyCells = (gLevel.SIZE ** 2) - gLevel.MINES
    gGame.isOn = true

    //If less than 3 mines, set lives as Mine Count.
    if (gLevel.MINES < 3) {
        gGame.lives = gLevel.MINES
    }

    markCountUpdate(0)
    lifeCountUpdate(false)

    //Matrix Creation.
    gBoard = createSquareMatrix(gLevel.SIZE)

    //All possible locations finder (to prevent doubles).
    gAllCellCoords = getAllBoardCellCords(gBoard)

    // Game Board Creation.
    buildBoard() // builds a board
    renderBoard('.table-wrapper') // Rendering the board.
    gameInfoBehaviorCSS() // Change some CSS properties.

    console.table(gBoard) // Test
}

// Cell Click Behavior.
function onCellClick(element, event) {

    // Disables Context Menu Behavior
    event.preventDefault()

    // Game is on?
    if (!gGame.isOn) return

    var coord = coordFromClass(element.className) // Get Cell Cords

    switch (event.type) { // Switch click behavior
        case 'contextmenu': isMarked(coord); break // Right Click
        case 'click': revealCell(coord, element); break // Left Click
        default: return null
    }
}

// RightCLick Function (MARK or UNMARK)
function isMarked(coord) {

    //If its Revealed do nothing
    if (gBoard[coord.i][coord.j].isRevealed) return

    // Checks if the Cell is Revealed or Marked and then Proceeds.
    if (!gBoard[coord.i][coord.j].isMarked &&
        !gBoard[coord.i][coord.j].isRevealed
    ) {
        gBoard[coord.i][coord.j].isMarked = true // Change ot Marked (Model)
        renderCell(coord, MARKED) // Render Mark (DOM)
        markCountUpdate(true) // Mark count update (DOM),(Modal)
        isVictory() // Every Mark (checks if all the Mine are marked and revealed)
    }

    else if (gBoard[coord.i][coord.j].isRevealed === false) {
        gBoard[coord.i][coord.j].isMarked = false
        renderCell(coord, UNMARKED)
        markCountUpdate(false)
    }
}

// Left Click Function (REVEAL CELL and the Neighbors Around)
function revealCell(coord, element) {

    //If its Revealed do nothing
    if (gBoard[coord.i][coord.j].isRevealed) return

    // Toggle (start) Stopwatch (Only on when revealedCount is 0)
    if (gGame.revealedCount === 0) {
        mineGenerator(coord) // Render Mines on first click (gets coords)
        toggleStopwatch()
    }

    // Checks if the Cell is Revealed or Marked and then Proceeds
    if (!gBoard[coord.i][coord.j].isRevealed &&
        !gBoard[coord.i][coord.j].isMarked
    ) {
        // Checks if the Cell is Mine
        if (gBoard[coord.i][coord.j].isMine === true) {
            return isMineClicked(coord, element)
        }
        // Else Proceeds to Reveal it
        else {
            revealCellsAround(coord) // (DOM)
            isVictory() // Every reveal (checks if all the Mine are marked and revealed)

            if (gGame.isOn) { // If game over don't change Face
                faceChange(false) // Face Change (Like in the ORIGINAL)
            }
        }
    }
}

// Reveal all The Neighbor cells that don't contain a Mine
function revealCellsAround(coord) {

    renderRevealCell(coord) // reveals the clicked cell

    // Creates an array with neighbor Coords
    const nbrOpenPoses = countNeighborsArray(gBoard, coord.i, coord.j)
    for (var i = 0; i < nbrOpenPoses.length; i++) {
        var emptyPos = nbrOpenPoses[i]
        renderRevealCell(emptyPos) // Reveal Cell
    }
}

// Function That reveals one cell at the time
function renderRevealCell(coord) {

    // Mines Count
    const cellMinesCount = gBoard[coord.i][coord.j].minesAroundCount

    // Reveals the cell
    if (gBoard[coord.i][coord.j].isRevealed === false) {
        gBoard[coord.i][coord.j].isRevealed = true // Reveal Cell (Model)
        gGame.revealedCount++ // Counts Revealed Cells
        addCSStoRevealCell()
    }

    // If Revealed Removes Mark
    if (gBoard[coord.i][coord.j].isMarked) {
        gBoard[coord.i][coord.j].isMarked = false
        markCountUpdate(false) // Updates mark count
    }

    if (cellMinesCount !== 0) {// Skips 0 (Skips adding Mine count)
        renderCell(coord, cellMinesCount)
    }

    function addCSStoRevealCell() {
        const cellClass = classFromCoord(coord) // Get coords Class
        const elCell = document.querySelector(`.${cellClass}`) // Element from (DOM)
        elCell.id = 'revealed'
    }
}


// Is Victory Function 
function isVictory() {

    // if not revealed don't check victory
    if (gGame.revealedCount === 0) return

    var markCount = 0

    // Checks mine locations if marked
    for (var i = 0; i < gMineCoords.length; i++) {
        var mineCoord = gMineCoords[i]
        if (gBoard[mineCoord.i][mineCoord.j].isMarked === true) {
            markCount++
        }
    }

    if (markCount === gLevel.MINES && // if all mines are Marked
        gGame.revealedCount === gGame.emptyCells)  // if all cells are Revealed
    {
        return gameOver(false) // You Win!
    }

    else return
}

// Game over Function
function gameOver(isLose) {

    //Global Game Over Behaviors
    const elBtn = document.querySelector('.btn')
    gGame.isOn = false // Stops Game (Stops clicking behavior).
    toggleStopwatch() // Toggle (stop) Stopwatch


    // Lose Behavior
    if (isLose) {
        minesReveal() // Reveals all the mines.
        lifeIconChange(true)
        return elBtn.innerText = LOSE
    }

    // Victory Behavior.
    else {
        return elBtn.innerText = WIN
    }
}

// Switch Difficulty
function difficultyChange(num, el) {

    // Find all .selected buttons and remove
    removeSelectedCell()

    // Add Selected button
    el.classList.add('selected')

    // Change Difficulty
    gLevel.SIZE = gDifficulty[num].SIZE
    gLevel.MINES = gDifficulty[num].MINES

    // Restart Game
    restartGame()

    function removeSelectedCell() {
        const elAllDiff = document.querySelectorAll('.options-btn')
        for (var i = 0; i < elAllDiff.length; i++) {
            elAllDiff[i].classList.remove('selected')
        }
    }
}

// Restart Game Difficulty
function restartGame() {

    // Restart DOM
    const elBtn = document.querySelector('.btn') // Reset Restart Button
    elBtn.innerText = SMILE

    const elTimer = document.querySelector('.timer')// Reset timer
    elTimer.innerText = '00:00'

    lifeIconChange(false) // Life icon Change

    gGame.revealedCount = 0 // Reveal Count
    gGame.lives = 3 // Restart Lives
    lifeCountUpdate(false)

    // Restart Matrix
    onInit()

    // Restart Stop Watch
    if (stopwatchRunning) {
        toggleStopwatch()
    }
}






