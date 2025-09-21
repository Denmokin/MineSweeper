'use strict'


// Global Arrays.
var gBoard = []
var gBoardCellCoords = []
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
    gBoardCellCoords = getAllBoardCellCords(gBoard)

    //Mine Generator.
    gMineCoords = randomMine(gLevel.MINES)

    // Game Board Creation.
    buildBoard() // builds a board and sets some mines.
    setMinesNbrCount() // Neighbor mines counter.
    renderBoard('.table-wrapper') // Rendering the board.
    gameInfoBehaviorCSS() // Change some CSS properties.

    console.table(gBoard)
}

// Game over Function
function gameOver(isWin) {

    //Global Game Over Behaviors
    const elBtn = document.querySelector('.btn')
    gGame.isOn = false // Stops Game (Stops clicking behavior).
    toggleStopwatch() // Toggle (stop) Stopwatch

    // Lose Behavior
    if (isWin) {
        minesReveal() // Reveals all the mines.
        elBtn.innerText = LOSE
    }

    // Victory Behavior.
    else {
        elBtn.innerText = WIN
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

    // Add random mines ( by running on the gMineCoords ).
    for (var i = 0; i < gMineCoords.length; i++) {
        var mineCoord = gMineCoords[i]
        gBoard[mineCoord.i][mineCoord.j].isMine = true
    }
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

    // Checks if the Cell is Revealed or Marked and then Proceeds
    if (gBoard[coord.i][coord.j].isMarked === false &&
        gBoard[coord.i][coord.j].isRevealed === false) {

        gBoard[coord.i][coord.j].isMarked = true // Change ot Marked (Model)
        isVictory() // Every Mark (checks if all the Mine are marked)
        renderCell(coord, MARKED) // Render Mark (DOM)
        markCountUpdate(true) // Mark count update (DOM),(Modal)
    }
    else if (gBoard[coord.i][coord.j].isRevealed === false) {
        gBoard[coord.i][coord.j].isMarked = false
        renderCell(coord, UNMARKED)
        markCountUpdate(false)
    }
}

// Left Click Function (REVEAL CELL and the Neighbors Around)
function revealCell(coord, element) {

    if (gGame.revealedCount === 0) toggleStopwatch() // Toggle (start) Stopwatch

    // Checks if the Cell is Revealed or Marked and then Proceeds
    if (gBoard[coord.i][coord.j].isRevealed === false &&
        gBoard[coord.i][coord.j].isMarked === false
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
            gBoard[coord.i][coord.j].isRevealed = true // (Model)
            revealCellsAround(coord) // (DOM)
            element.classList.add('revealed') // Adds BG
            faceChange() // Face Change (Like in the ORIGINAL)
        }
    }
}

// Reveal all The Neighbor cells that don't contain a Mine
function revealCellsAround(coord) {

    // Creates an array with neighbor Coords
    const nbrOpenPoses = countNeighborsArray(gBoard, coord.i, coord.j)
    for (var i = 0; i < nbrOpenPoses.length; i++) {
        var emptyPos = nbrOpenPoses[i]
        renderRevealCell(emptyPos) // Reveal Cell
    }
}

// Function That reveals one cell at the time
function renderRevealCell(coord) {

    gGame.revealedCount++ // Counts Revealed Cells

    const cellClass = classFromCoord(coord) // Get coords Class
    const elCell = document.querySelector(`.${cellClass}`) // Element from (DOM)
    const minesCount = gBoard[coord.i][coord.j].minesAroundCount // Mines Count

    elCell.classList.add('revealed')
    gBoard[coord.i][coord.j].isRevealed = true

    if (minesCount !== 0) {// Skips 0 (Skips adding Mine count)
        renderCell(coord, minesCount)
    }
}

// Is Victory Function (checks mine locations (gMineCoords) every mark)
function isVictory() {

    // if not revealed don't check victory
    if (gGame.revealedCount === 0) return

    var count = 0
    for (var i = 0; i < gMineCoords.length; i++) {
        var mineCoord = gMineCoords[i]
        if (gBoard[mineCoord.i][mineCoord.j].isMarked === true) {
            count++
        }
    }
    if (count === gMineCoords.length) return gameOver(false)
    else return
}

// Face Change Function
function faceChange() {
    const elBtn = document.querySelector('.btn')
    elBtn.innerText = SHOCK
    setTimeout(() => { elBtn.innerText = SMILE }, 200)
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
    const elAllDiff = document.querySelectorAll('.diff')
    for (var i = 0; i < elAllDiff.length; i++) {
        elAllDiff[i].classList.remove('selected')
    }
    el.classList.add('selected')
    gLevel.SIZE = gDifficulty[num].boardSize
    gLevel.MINES = gDifficulty[num].minesCount
    onInit()
}


function restartGame() {

    // Restart DOM
    const elBtn = document.querySelector('.btn')
    const elTimer = document.querySelector('.timer')
    elBtn.innerText = SMILE
    elTimer.innerText = '00:00:00'

    // Restart Matrix
    onInit()

    // Restart Stop Watch
    if (gGame.revealedCount > 0) toggleStopwatch()
    gGame.revealedCount = 0
}