'use strict'


function addHintCss(coord) {
    const elCell = getElementFromCoord(coord)
    elCell.classList.add('hint')

    // Removes CSS + coord from gEmptyCells Array
    setTimeout(() => {
        elCell.classList.remove('hint')
    }, 2000)
}

// Hint Reveal Function
function hintRandomEmptyCell() {

    if (!gGame.isOn || gHacks.hints === 0) return
    if (gGame.revealedCount === gGame.emptyCells) return

    const n = gEmptyCells.length

    // Gets rand coord from gEmptyCells
    var randNum = randIntInclusive(0, (n - 1))
    var randCoord = gEmptyCells[randNum]

    // Checks if Cell is already Revealed
    while (gBoard[randCoord.i][randCoord.j].isRevealed === true) {
        randNum = randIntInclusive(0, (n - 1))
        randCoord = gEmptyCells[randNum]
    }

    // Removes USED coord from Array
    gEmptyCells.splice[randNum, 1]

    addHintCss(randCoord)

    // Update Count
    hintCountUpdate(true)
}

// Hint Count Updater
function hintCountUpdate(isUsed) {
    if (isUsed) gHacks.hints--

    const elHints = document.querySelector('.hint-count')
    elHints.innerText = gHacks.hints
}


//////////////////////////////////////////////////////////////////////


// Mega Hint Clicked Cell Pusher
function megaHintCoordsPusher(coord) {

    const coords = gHacks.megaHint.coords

    // Adds Reveal CSS
    addHintCss(coord)

    // Pushes Clicked Cell
    coords.push(coord)

    // Gets 2 Cells and then Proceeds to Reveal
    if (coords.length === 2) {
        megaHint(coords[0], coords[1])
    }
}

// Mega Hint Creator
function megaHint(coord1, coord2) {

    const coords = []

    // Changes the Start and End point
    const iIdxStart = Math.min(coord1.i, coord2.i)
    const iIdxEnd = Math.max(coord1.i, coord2.i)

    const jIdxStart = Math.min(coord1.j, coord2.j)
    const jIdxEnd = Math.max(coord1.j, coord2.j)

    // Pushes all the coords between the (clicked coords)
    for (var i = iIdxStart; i <= iIdxEnd; i++) {
        for (var j = jIdxStart; j <= jIdxEnd; j++) {
            coords.push({ i, j })
        }
    }


    // Reveal Cells  
    globalRevealCellsAround(coords, false)

    // Reverse Reveal
    setTimeout(() => globalRevealCellsAround(coords, true), 2000)

    // Reset Mega Hint
    gHacks.megaHint.isOn = false
    gHacks.megaHint.coords = []

}

//Mega Hint Starter (If clicked revealCell Function gets A new Condition)
function megaHintStarter() {
    // Start only wen game is on
    if (!gGame.isOn || gHacks.megaHint.times === 0) return
    gHacks.megaHint.isOn = true
    megaHintCountUpdate(true)
}


// MegaHint Count Updater
function megaHintCountUpdate(isUsed) {
    if (isUsed) gHacks.megaHint.times--
    const elHints = document.querySelector('.megaHint-count')
    elHints.innerText = gHacks.megaHint.times
}


// Mega hint reveal cell
function megaHintRevealCell(coord, reverse) {

    // Mines Count
    const cellMinesCount = gBoard[coord.i][coord.j].minesAroundCount

    // If Reverse Render cells to the Original Condition
    if (reverse) {

        if (gBoard[coord.i][coord.j].isRevealed || gBoard[coord.i][coord.j].isMarked) return

        const elCell = getElementFromCoord(coord)
        elCell.id = ''

        return renderCell(coord, '')

    }

    // Reveal Mega hint coord Cells
    else {

        if (gBoard[coord.i][coord.j].isRevealed || gBoard[coord.i][coord.j].isMarked) return
        const elCell = getElementFromCoord(coord)
        elCell.id = 'megaHint'

        if (gBoard[coord.i][coord.j].isMine) renderCell(coord, MINE)

        else if (cellMinesCount !== 0) {// Skips 0 (Skips adding Mine count)
            return renderCell(coord, cellMinesCount)
        }

    }

}

// Global revealCellsAround
function globalRevealCellsAround(coords, reverse) {
    for (var i = 0; i < coords.length; i++) {
        var pos = coords[i]
        megaHintRevealCell(pos, reverse) // Reveal Cell
    }
}