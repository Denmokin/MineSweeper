'use strict'

// Global Arrays.
var gEmptyCells = []


// is Mine CLicked?
function isMineClicked(coord, element) {

    renderCell(coord, MINE) // Render Mine (DOM)
    element.classList.add('boom') // Adds Red BG
    gBoard[coord.i][coord.j].isMarked = true // If blow up mark cell

    //Update counters
    markCountUpdate(true)
    lifeCountUpdate(true)

    if (gGame.lives === 0) gameOver(true)

    if (gGame.lives > 0) isVictory()

    if (gGame.isOn) { // If game over don't change Face
        faceChange(true) // Face When BlowUp
    }
    return
}

// Creates Array will all board Coordinates
function getAllBoardCellCords(board) {
    var arr = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            arr.push({ i: i, j: j })
        }
    }
    return arr
}

// Random Mine Places
function randomMine(mineCount, coord) {
    const randMineCords = []
    var cellCoords = gAllCellCoords.slice() // Copy of Global Coords 

    console.log('cellCoords: ', cellCoords)

    while (randMineCords.length !== mineCount) {
        var n = cellCoords.length
        var randNum = randIntInclusive(0, n - 1)
        var randCoord = cellCoords[randNum]

        // Skips the first click coord
        if (randCoord.i === coord.i && randCoord.j === coord.j) {
            cellCoords.splice(randNum, 1)
            continue
        }
        randMineCords.push(randCoord)
        cellCoords.splice(randNum, 1) // Remove only if used
    }

    gEmptyCells = cellCoords // gets Empty cell Cords (for HACKS)

    return randMineCords
}

// Checks is the cell contains a mine
function isMine(coord) {
    return gBoard[coord.i][coord.j].isMine === false
}

// Cell Mine Counter
function setMinesNbrCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j].minesAroundCount = countNeighborsObjects(gBoard, i, j)
        }
    }
}

// On game Over Reveals all the mines
function minesReveal() {
    for (var i = 0; i < gMineCoords.length; i++) {
        var mineCoord = gMineCoords[i]
        if (gBoard[mineCoord.i][mineCoord.j].isMarked === false) {
            renderCell(mineCoord, MINE)
        }
    }
}
