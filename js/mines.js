'use strict'

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
    console.table(gBoard)
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
    var n = gAllCellCoords.length

    while (randMineCords.length !== mineCount) {
        var randCoord = gAllCellCoords[randIntInclusive(0, (n - 1))]

        // Skips the first click coord
        if (randCoord.i === coord.i && randCoord.j === coord.j) continue
        randMineCords.push(randCoord)
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
