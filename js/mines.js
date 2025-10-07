'use strict'

// Creates Array will all board Coordinates
function getAllBoardCellCords(board) {
    var boardCellsCords = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[i].length; j++) {
            boardCellsCords.push({ i: i, j: j })
        }
    }
    return boardCellsCords
}

// Random Mine Coord Finder
function randomMine(mineCount) {
    const randMineCords = []
    var n = gBoardCellCoords.length
    console.log('n: ', n)
    for (var i = 0; i < mineCount; i++) {
        randMineCords.push(gBoardCellCoords[randIntInclusive(0, n - 1)])
    }
    console.log('randMineCords: ', randMineCords)
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
