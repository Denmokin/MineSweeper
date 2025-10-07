'use strict'


// Global Level Setting.
const gLevel = {
    SIZE: 8,
    MINES: 12,
    DIFF: 'Medium',
}

// Global Game Properties.
const gGame = {
    isOn: false,
    lives: 3,
    revealedCount: 0,
    emptyCells: 0,
    markedCount: 0,
    secsPassed: 0,
}

// Global Hack Properties.
const gHacks = {
    hints: 3,
    removeMines: 1,
    megaHint: {
        isOn: false,
        count: 1,
        coords: [],
    },
    stepBack: {
        recCount: 0,
        count: 5,
    },
}

const gManualMines = {
    isOn: false,
    mineCount: 0,
    customMinesCoords: [],
}

// Global Arrays.
var gBoard = []
var gAllCellCoords = []
var gMineCoords = []

const gDifficulty = [
    { DIFF: 'Easy', SIZE: 4, MINES: 2, },
    { DIFF: 'Medium', SIZE: 8, MINES: 12, },
    { DIFF: 'Hard', SIZE: 12, MINES: 32, },
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
const MINEPLACER = '🤓'
const LIFE = '❤️'
const HIT = '💔'


function onInit() {

    // Game Properties Set.
    gamePropertiesSet()

    //Matrix Creation.
    gBoard = createSquareMatrix(gLevel.SIZE)

    //All possible locations finder (to prevent doubles).
    gAllCellCoords = getAllBoardCellCords(gBoard)

    // Game Board Creation.
    buildBoard() // builds a board
    renderBoard('.table-wrapper') // Rendering the board.
    gameInfoBehaviorCSS() // Change some CSS properties.

    // Render Score Board
    renderScores()

    // console.table(gBoard) // Test


    function gamePropertiesSet() {

        // Game Properties Set.
        gGame.isOn = false
        gGame.markedCount = gLevel.MINES
        gGame.emptyCells = (gLevel.SIZE ** 2) - gLevel.MINES

        //If less than 3 mines, Make Changes
        if (gLevel.MINES < 3) {
            gHacks.hints = 1
            gGame.lives = gLevel.MINES
        }

        // Remove Only One Mine (Mine Remover Hack)
        if (gLevel.DIFF === 'Easy') {
            gRemoveMineCount = 1
        }

        //Manual Mines 
        gManualMines.mineCount = gLevel.MINES

        markCountUpdate(0)
        lifeCountUpdate(false)
        hintCountUpdate(false)
        megaHintCountUpdate(false)
        removeMinesCountUpdate(false)
        stepBackCountUpdate(false)

        // 2 Right Clicks on Start Button (Wins The Game)
        gRightClickCounter = 0
    }
}

function gameStarter(coord) {

    gGame.isOn = true // starts the game

    // Manual Mine Placer
    if (gManualMines.customMinesCoords.length > 0) {
        gMineCoords = gManualMines.customMinesCoords
    }

    // Get Mine Locations
    else gMineCoords = randomMine(gLevel.MINES, coord)

    // Add random mines ( by running on the gMineCoords ).
    for (var i = 0; i < gMineCoords.length; i++) {
        var mineCoord = gMineCoords[i]
        gBoard[mineCoord.i][mineCoord.j].isMine = true
    }
    setMinesNbrCount() // Neighbor mines counter.

    // Get Timer For Score
    gScoreTimerInterval = setInterval(() => { gGame.secsPassed++ }, 1000)

    console.table(gBoard)  // Filled Game Board Test
}



// Cell Click Behavior.
function onCellClick(element, event) {

    // Disables Context Menu Behavior
    event.preventDefault()

    // Game is on?
    if (!gGame.isOn && gGame.revealedCount > 0) return

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

    // Manual Mines Start
    if (gManualMines.isOn) return manualMinePlacer(coord)

    // Toggle (start) Stopwatch (Only on when revealedCount is 0)
    if (gGame.revealedCount === 0) {
        gameStarter(coord) // Starts the game on first click (gets coords)
        toggleStopwatch()
    }

    // Mega Hint Start
    if (gHacks.megaHint.isOn) return megaHintCoordsPusher(coord)

    // Checks if the Cell is Revealed or Marked and then Proceeds
    if (!gBoard[coord.i][coord.j].isMarked) {

        // Adds stepRecCount Array for StepBack hack
        var stepBackCell = gHacks.stepBack.recCount
        gStepCellsRecorder[stepBackCell] = []

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
    else return
}

// Reveal all The Neighbor cells that don't contain a Mine
function revealCellsAround(coord) {

    renderRevealCell(coord) // reveals the first clicked cell

    // Cell Mines Count
    const cellMinesCount = gBoard[coord.i][coord.j].minesAroundCount

    // if number reveal only number
    if (cellMinesCount > 0) {
        // Step Back Recorder Print
        gHacks.stepBack.recCount++  // Step Back Record (count)
        return
    }

    nbrRecursiveReveal(coord)

    // Step Back Recorder Print
    gHacks.stepBack.recCount++ // Step Back Record (count)
}


// Function That reveals one cell at the time
function renderRevealCell(coord) {

    // Step Back Record
    stepBackHackRecorder(coord)

    // Mines Count
    const cellMinesCount = gBoard[coord.i][coord.j].minesAroundCount

    // Reveals the cell
    if (gBoard[coord.i][coord.j].isRevealed === false) {
        gBoard[coord.i][coord.j].isRevealed = true // Reveal Cell (Model)
        gGame.revealedCount++ // Counts Revealed Cells
        const elCell = getElementFromCoord(coord)
        elCell.id = 'revealed'

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
    const elBtn = document.querySelector('.restart')
    gGame.isOn = false // Stops Game (Stops clicking behavior).
    toggleStopwatch() // Toggle (stop) Stopwatch
    clearInterval(gScoreTimerInterval) // Stop Score Timer Interval

    // Lose Behavior
    if (isLose) {
        minesReveal() // Reveals all the mines.
        lifeIconChange(true)
        return elBtn.innerText = LOSE
    }

    // Victory Behavior.
    else {
        // Opens Score Form
        toggleModal()
        return elBtn.innerText = WIN
    }
}

// Switch Difficulty
function difficultyChange(num, el) {

    // Find all .selected buttons and remove
    removeSelectedCssFromCell()

    // Add Selected button
    el.classList.add('selected')

    // Change Difficulty
    gLevel.SIZE = gDifficulty[num].SIZE
    gLevel.MINES = gDifficulty[num].MINES

    // Change Diff Name for Score
    gLevel.DIFF = gDifficulty[num].DIFF

    // Restart Game
    restartGame()

    function removeSelectedCssFromCell() {
        const elAllDiff = document.querySelectorAll('.options')
        for (var i = 0; i < elAllDiff.length; i++) {
            elAllDiff[i].classList.remove('selected')
        }
    }
}

// Restart Game Difficulty
function restartGame() {

    // Restart DOM
    const elBtn = document.querySelector('.restart') // Reset Restart Button
    elBtn.innerText = SMILE

    const elTimer = document.querySelector('.timer')// Reset timer
    elTimer.innerText = '00:00'

    const elMarkIcon = document.querySelector('.mark-icon')
    elMarkIcon.innerText = MARKED

    lifeIconChange(false) // Life icon Change

    gGame.revealedCount = 0 // Reveal Count
    gGame.lives = 3 // Restart Lives
    gGame.secsPassed = 0 // Restart Lives

    // Reset Hacks 
    gHacks.hints = 3 // Restart Hints

    gHacks.megaHint.count = 1 // Restart megaHint
    gHacks.megaHint.isOn = false

    gHacks.removeMines = 1 // Restart RemoveMines
    gRemoveMineCount = 3
    removeMinesGlobalRestart()

    gHacks.stepBack.count = 5 // Restart stepBack
    gHacks.stepBack.recCount = 0 // Restart stepBack

    gManualMines.isOn = false // Restart Manual Mine Placer
    gManualMines.customMinesCoords = []

    clearInterval(gScoreTimerInterval) // Stop Score Timer Interval

    // Restart Cells Recorder
    gStepCellsRecorder = {}

    // Restart Matrix
    onInit()

    // Restart Stop Watch
    if (stopwatchRunning) {
        toggleStopwatch()
    }
}






