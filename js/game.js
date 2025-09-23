'use strict'


// Global Arrays.
var gBoard = []
var gAllCellCoords = []
var gMineCoords = []

const gDifficulty = [
    { boardSize: 4, minesCount: 2, },
    { boardSize: 8, minesCount: 12, },
    { boardSize: 12, minesCount: 32, },
]

// Global Level Setting.
const gLevel = {
    SIZE: 4,
    MINES: 2,
}

// Global Game Properties.
const gGame = {
    isOn: false,
    revealedCount: 0,
    markedCount: 0,
    secsPassed: 0
}

// Global Icons.
const MARKED = '🚩'
const MINE = '💣'
const UNMARKED = ''
const SMILE = '😀'
const LOSE = '😵'
const WIN = '😎'
const SHOCK = '😮'

function onInit() {

    // Game Properties Set.
    gGame.markedCount = gLevel.MINES
    gGame.isOn = true
    markCountUpdate(0)

    //Matrix Creation.
    gBoard = createSquareMatrix(gLevel.SIZE)

    //All possible locations finder (to prevent doubles).
    gAllCellCoords = getAllBoardCellCords(gBoard)

    // Game Board Creation.
    buildBoard() // builds a board and sets some mines.
    renderBoard('.table-wrapper') // Rendering the board.
    gameInfoBehaviorCSS() // Change some CSS properties.

    console.table(gBoard)
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
        return elBtn.innerText = LOSE
    }

    // Victory Behavior.
    else {
        return elBtn.innerText = WIN
    }
}

// Build a board.
function buildBoard() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            // Adds custom object cell.
            gBoard[i][j] = customCellObject()
        }
    }
}

// Cell Click Behavior.
function cellClicked(element, event) {

    // Disables Context Menu Behavior
    event.preventDefault()

    if (gGame.isOn) { // Game is on?
        var coord = coordFromClass(element.className) // Get Cell Cords

        // Switch click behavior
        switch (event.type) {
            case 'contextmenu': isMarked(coord); break // Right Click
            case 'click': revealCell(coord, element); break // Left Click
            default: return null
        }
    }
    else return
}

// RightCLick Function (MARK or UNMARK)
function isMarked(coord) {

    //If its Revealed do nothing
    if (gBoard[coord.i][coord.j].isRevealed) {
        return
    }

    // Checks if the Cell is Revealed or Marked and then Proceeds
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
    if (gBoard[coord.i][coord.j].isRevealed) {
        return
    }

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
            renderCell(coord, MINE) // (DOM)
            element.classList.add('boom') // Adds BG
            gameOver(true)
            return
        }
        // Else Proceeds to Reveal it
        else {
            revealCellsAround(coord) // (DOM)
            isVictory() // Every reveal (checks if all the Mine are marked and revealed)
            if (gGame.isOn) {
                faceChange() // Face Change (Like in the ORIGINAL)
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

    const cellClass = classFromCoord(coord) // Get coords Class
    const elCell = document.querySelector(`.${cellClass}`) // Element from (DOM)
    const cellMinesCount = gBoard[coord.i][coord.j].minesAroundCount // Mines Count

    // Reveals the cell
    if (gBoard[coord.i][coord.j].isRevealed === false) {
        elCell.id = 'revealed' // Used ID to Prevent BUG (With getCellCoords)
        gBoard[coord.i][coord.j].isRevealed = true // Reveal Cell (Model)
        gGame.revealedCount++ // Counts Revealed Cells
    }

    // If Revealed Removes Mark
    if (gBoard[coord.i][coord.j].isMarked) {
        gBoard[coord.i][coord.j].isMarked = false
        markCountUpdate(false) // Updates mark count
    }

    if (cellMinesCount !== 0) {// Skips 0 (Skips adding Mine count)
        renderCell(coord, cellMinesCount)
    }
}

// Is Victory Function (checks mine locations (gMineCoords) every mark)
function isVictory() {

    // if not revealed don't check victory
    if (gGame.revealedCount === 0) return

    var markCount = 0
    for (var i = 0; i < gMineCoords.length; i++) {
        var mineCoord = gMineCoords[i]
        if (gBoard[mineCoord.i][mineCoord.j].isMarked === true) {
            markCount++
        }
    }

    if (markCount === gLevel.MINES && // if all mines are marked
        gGame.revealedCount === (gLevel.SIZE ** 2 - gLevel.MINES)  // if all cells are revealed
    ) {
        return gameOver(false) // You Win!
    }

    else return
}

// Mark Count Updater Function
function markCountUpdate(marked) {
    if (marked !== 0) {
        marked ? gGame.markedCount-- : gGame.markedCount++
    }
    const elFlags = document.querySelector('.mark-count')
    elFlags.innerText = gGame.markedCount
}

// Switch Difficulty
function difficultyChange(num, el) {

    // Find all .selected buttons and remove
    const elAllDiff = document.querySelectorAll('.diff')
    for (var i = 0; i < elAllDiff.length; i++) {
        elAllDiff[i].classList.remove('selected')
    }

    // Add Selected button
    el.classList.add('selected')

    // Change Difficulty
    gLevel.SIZE = gDifficulty[num].boardSize
    gLevel.MINES = gDifficulty[num].minesCount

    // Restart Game
    restartGame()
}

// Restart Game Difficulty
function restartGame() {

    // Restart DOM
    const elBtn = document.querySelector('.btn')
    const elTimer = document.querySelector('.timer')
    elBtn.innerText = SMILE
    elTimer.innerText = '00:00'
    gGame.revealedCount = 0

    // Restart Matrix
    onInit()

    // Restart Stop Watch
    if (stopwatchRunning) {
        toggleStopwatch()
    }

    return
}

// Face Change Function
function faceChange() {
    const elBtn = document.querySelector('.btn')
    elBtn.innerText = SHOCK
    setTimeout(() => { elBtn.innerText = SMILE }, 200)
}

// Custom cell Object.
function customCellObject() {
    const cell = {
        minesAroundCount: 0,
        isRevealed: false,
        isMine: false,
        isMarked: false,
    }
    return cell
}


