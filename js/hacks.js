'use strict'


// Global STUFF:
var gRightClickCounter
var gRemoveMineCount = 3

// Global Arrays
var gStepCellsRecorder = {}


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

    const n = (gEmptyCells.length - 1)

    // Gets rand coord from gEmptyCells
    var randNum = randIntInclusive(0, n)
    var randCoord = gEmptyCells[randNum]

    // Checks if Cell is already Revealed
    while (gBoard[randCoord.i][randCoord.j].isRevealed === true) {
        randNum = randIntInclusive(0, n)
        randCoord = gEmptyCells[randNum]
    }

    // Removes USED coord from Array
    gEmptyCells.splice(randNum, 1)

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

    if (!gGame.isOn || gHacks.removeMines === 0 ||
        (gLevel.DIFF === 'Easy' && gGame.lives < 2)) return

    removeMinesCountUpdate(true)

    // Update Easy mode
    if (gLevel.DIFF === 'Easy') lifeCountUpdate(true)

    for (var i = 0; i < count; i++) {

        var n = (gMineCoords.length - 1)

        var randNum = randIntInclusive(0, n)
        var randMine = gMineCoords[randNum]

        while (gBoard[randMine.i][randMine.j].isRevealed === true) {
            randNum = randIntInclusive(0, n)
            randMine = gMineCoords[randNum]
        }

        // Removes USED coord from Array
        gMineCoords.splice(randNum, 1)
        gBoard[randMine.i][randMine.j].isMine = false
    }

    // Update Mark Count
    gGame.markedCount -= gRemoveMineCount
    markCountUpdate(0)

    // Update Update Mine Count and Empty Cell Count
    gLevel.MINES -= gRemoveMineCount
    gGame.emptyCells = (gLevel.SIZE ** 2) - gLevel.MINES

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

function removeMinesGlobalRestart() {
    var num = null

    if (gLevel.DIFF === 'Easy') num = 0
    else if (gLevel.DIFF === 'Medium') num = 1
    else if (gLevel.DIFF === 'Hard') num = 2
    gLevel.MINES = gDifficulty[num].MINES
}



//////////////-------- Step Back Hack --------///////////////

// Steps Recorder Function
function stepBackHackRecorder(coord) {
    var stepBackCell = gHacks.stepBack.recCount // Gets Step Back Array(Order)
    gStepCellsRecorder[stepBackCell].push(coord) // Pushes (Coords)
}


// StepsBack Hack Function
function stepBackHack() {

    // If These Behavior ar False Return
    if (!gGame.isOn || gHacks.stepBack.count === 0 ||
        isEmpty(gStepCellsRecorder)) return

    // Update Dom StepBack Count   
    stepBackCountUpdate(true)

    // Get The current coords Array
    const stepBackCoords = gStepCellsRecorder[gHacks.stepBack.recCount - 1]

    for (var i = 0; i < stepBackCoords.length; i++) {
        var coord = stepBackCoords[i]

        const elCell = getElementFromCoord(coord)
        elCell.removeAttribute('id') // Remove Reveal CSS

        // If its a mine Behavior
        if (gBoard[coord.i][coord.j].isMine && gBoard[coord.i][coord.j].isMarked) {
            gBoard[coord.i][coord.j].isRevealed = false
            gBoard[coord.i][coord.j].isMarked = false

            //Life Back
            gGame.lives++
            lifeCountUpdate(false)

            //Mark Back
            gGame.markedCount++
            markCountUpdate(0)

            // CSS Remove
            elCell.classList.remove('boom')
        }

        // Else Regular cells
        gBoard[coord.i][coord.j].isRevealed = false
        renderCell(coord, '')
    }

    // Delete the used Object
    delete gStepCellsRecorder[gHacks.stepBack.recCount - 1]
    gHacks.stepBack.recCount--
}

// Remove Mines Count Updater
function stepBackCountUpdate(isUsed) {
    if (isUsed) gHacks.stepBack.count--
    const elHints = document.querySelector('.stepBack-count')
    elHints.innerText = gHacks.stepBack.count
}

// is Object Empty
function isEmpty(obj) {
    return Object.keys(obj).length === 0
}


///////////////----------- Manual Mine Placer ----------/////////////////

// Manual Mine Placer Starter
function manualMinePlacerStarter() {

    if (gGame.isOn) return

    // Change Face and Mark Icon To bom icon
    const elMarkIcon = document.querySelector('.mark-icon')
    const elRestart = document.querySelector('.restart')

    elRestart.innerText = MINEPLACER
    elMarkIcon.innerText = MINE

    // Change gManualMines to ON
    gManualMines.isOn = true
    console.log('gManualMines.isOn: ', gManualMines.isOn)
}

// Manual Mine Placer
function manualMinePlacer(coord) {

    const coords = gManualMines.customMinesCoords

    // Adds Reveal CSS
    renderCell(coord, MINE)

    // Pushes Clicked Cell
    coords.push(coord)

    // Updated ManualMineCount
    markCountUpdate(true)

    // If all Mines are placed Reset The board
    // (gameStarter Function Gets The coords)

    if (coords.length === gLevel.MINES) {
        for (var i = 0; i < coords.length; i++) {
            var curCoord = coords[i]
            renderCell(curCoord, '')
        }

        gManualMines.isOn = false

        const elMarkIcon = document.querySelector('.mark-icon')
        const elRestart = document.querySelector('.restart')

        elRestart.innerText = SMILE
        elMarkIcon.innerText = MARKED

        gGame.markedCount = gLevel.MINES
        markCountUpdate(0)
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
        if (gRightClickCounter === 2) {
            revealHackCellsAround(gAllCellCoords)
            gameOver(false)
        }
    }
}

function revealHackCellsAround(coords) {
    for (var i = 0; i < coords.length; i++) {
        var pos = coords[i]
        revealHackReveal(pos) // Reveal Cell
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


// Add More Hacks (DEV-HACK)
function addMoreHacks(ev) {

    // Disables Context Menu Behavior
    ev.preventDefault()

    // Right Click Event
    if (ev.type === 'contextmenu') {

        // Add more Hacks
        gGame.lives = 5 // Restart Lives
        gHacks.hints = 10 // Restart Hints
        gHacks.megaHint.count = 5 // Restart megaHint
        gHacks.removeMines = 3 // Restart RemoveMines
        gHacks.stepBack.count = 10 // Restart stepBack

        lifeCountUpdate(false)
        hintCountUpdate(false)
        megaHintCountUpdate(false)
        removeMinesCountUpdate(false)
        stepBackCountUpdate(false)
    }

}


