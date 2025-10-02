'use strict'

var gRemoveMineCount = 3


function addHintCss(coord) {
    const elCell = getElementFromCoord(coord)
    elCell.classList.add('hint')

    console.log('coord: ', elCell)
    // Removes CSS + coord from gEmptyCells Array
    setTimeout(() => {
        elCell.classList.remove('hint')
    }, 2000)
}


////////////////////--------- Hint HACK ----------//////////////////////////

// Hint Reveal Function
function hintRandomEmptyCell() {

    if (!gGame.isOn || gHacks.hints === 0) return
    if (gGame.revealedCount === gGame.emptyCells) return

    const n = gEmptyCells.length

    // Gets rand coord from gEmptyCells
    var randNum = randIntInclusive(0, n)
    var randCoord = gEmptyCells[randNum]

    // Checks if Cell is already Revealed
    while (gBoard[randCoord.i][randCoord.j].isRevealed === true) {
        randNum = randIntInclusive(0, n)
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


////////////////////------Mega Hint HACK----------//////////////////////////


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
    megaHintRevealCellsAround(coords, false)

    // Reverse Reveal
    setTimeout(() => megaHintRevealCellsAround(coords, true), 2000)

    // Reset Mega Hint
    gHacks.megaHint.isOn = false
    gHacks.megaHint.coords = []

}

//Mega Hint Starter (If clicked revealCell Function gets A new Condition)
function megaHintStarter() {
    // Start only wen game is on
    if (!gGame.isOn || gHacks.megaHint.count === 0) return
    gHacks.megaHint.isOn = true
    megaHintCountUpdate(true)
}


// MegaHint Count Updater
function megaHintCountUpdate(isUsed) {
    if (isUsed) gHacks.megaHint.count--
    const elHints = document.querySelector('.megaHint-count')
    elHints.innerText = gHacks.megaHint.count
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

// Global Mega Hint Reveal Cells Around
function megaHintRevealCellsAround(coords, reverse) {
    for (var i = 0; i < coords.length; i++) {
        var pos = coords[i]
        megaHintRevealCell(pos, reverse) // Reveal Cell
    }
}


//////////////--------Remove Mines Hack--------///////////////


// Remove Mines Hack Function

function removeMinesHack(count) {


    if (!gGame.isOn || gHacks.removeMines === 0) return

    removeMinesCountUpdate(true)

    const mineCoordsCopy = gMineCoords.slice()

    var n = mineCoordsCopy.length

    console.log('gMineCoords: ', gMineCoords)
    for (var i = 0; i <= count; i++) {

        var randNum = randIntInclusive(0, n - 1)
        var randMine = mineCoordsCopy[randNum]

        while (gBoard[randMine.i][randMine.j].isRevealed === true) {
            randNum = randIntInclusive(0, n - 1)
            randMine = mineCoordsCopy[randNum]
        }

        // Removes USED coord from Array
        mineCoordsCopy.splice[randNum, 1]

        gBoard[randMine.i][randMine.j].isMine = false

    }

    setMinesNbrCount() // Count Mines Again
    removeMinesRevealUpdate() // Reveal Update
}

// Remove Mines Count Updater
function removeMinesCountUpdate(isUsed) {
    if (isUsed) gHacks.removeMines--
    const elHints = document.querySelector('.removeMines-count')
    elHints.innerText = gHacks.removeMines
}


// Remove Mines Reveal Update Function
function removeMinesRevealUpdate() {

    for (var i = 0; i < gAllCellCoords.length; i++) {

        var coord = gAllCellCoords[i]

        var cellMinesCount = gBoard[coord.i][coord.j].minesAroundCount

        if (gBoard[coord.i][coord.j].isRevealed) {
            if (gBoard[coord.i][coord.j].isMine) renderCell(coord, MINE)
            else if (cellMinesCount === 0) renderCell(coord, '')
            else renderCell(coord, cellMinesCount)
        }
    }
}


///////////////-----------DEV HACKS----------/////////////////



// Right Click WIN (TEST-HACK)
function winGameHack(ev) {

    // Disables Context Menu Behavior
    ev.preventDefault()

    if (!gGame.isOn) return

    // Right Click Event
    if (ev.type === 'contextmenu') {
        gRightClickCounter++
        if (gRightClickCounter === 2)
            gameOver(false)
    }
}


// Right revealHack (TEST-HACK)
function revealHack(ev) {

    // Disables Context Menu Behavior
    ev.preventDefault()

    if (!gGame.isOn) return

    // Right Click Event
    if (ev.type === 'contextmenu') {
        revealHackCellsAround(gAllCellCoords)
    }

    function revealHackCellsAround(coords) {
        for (var i = 0; i < coords.length; i++) {
            var pos = coords[i]
            renderRevealCell2(pos) // Reveal Cell
        }
    }
}

function revealHackReveal(coord) {

    // Mines Count
    const cellMinesCount = gBoard[coord.i][coord.j].minesAroundCount

    const elCell = getElementFromCoord(coord)
    elCell.id = 'revealed'

    if (gBoard[coord.i][coord.j].isMine) renderCell(coord, MINE)
    else if (cellMinesCount === 0) renderCell(coord, '')
    else renderCell(coord, cellMinesCount)

}