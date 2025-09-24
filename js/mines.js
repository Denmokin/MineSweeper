'use strict'

// is Mine CLicked?
function isMineClicked(coord, element) {
    renderCell(coord, MINE) // Render Mine (DOM)
    element.classList.add('boom') // Adds Red BG
    gBoard[coord.i][coord.j].isMarked = true // If blow up mark cell

    //Update counters
    markCountUpdate(true)
    lifeCountUpdate(true)

    if (gGame.lives === 0) {
        gameOver(true)
    }

    if (gGame.isOn) { // If game over don't change Face
        faceChange(true) // Face When blowup
    }
    return
}

//Mine Generator.
function mineGenerator(coord) {

    // Get Mine Locations
    gMineCoords = randomMine(gLevel.MINES, coord)

    // Add random mines ( by running on the gMineCoords ).
    for (var i = 0; i < gMineCoords.length; i++) {
        var mineCoord = gMineCoords[i]
        gBoard[mineCoord.i][mineCoord.j].isMine = true
    }
    setMinesNbrCount() // Neighbor mines counter.
    console.table(gBoard)  // Test
}

// Creates Array will all board Coordinates
function getAllBoardCellCords(board) {
    var arr = []
    for (var i = 0; i < board.length - 1; i++) {
        for (var j = 0; j < board[i].length - 1; j++) {
            arr.push({ i: i, j: j })
        }
    }
    return arr
}

// Random Mine Places
function randomMine(mineCount, coord) {
    const randMineCords = []
    var cellCoords = gAllCellCoords.slice() // Copy of global 

    while (randMineCords.length !== mineCount) {
        var n = cellCoords.length
        var randNum = randIntInclusive(0, (n - 1))
        var randCoord = cellCoords[randNum]

        // Skips the first click coord
        if (randCoord.i === coord.i && randCoord.j === coord.j) {
            cellCoords.splice(randNum, 1)
            continue
        }
        randMineCords.push(randCoord)
        cellCoords.splice(randNum, 1) // Remove only if used
    }
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
