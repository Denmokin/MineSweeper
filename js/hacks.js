'use strict'


// Hint Reveal Function
function hintRandomEmptyCell() {

    if (!gGame.isOn || gGame.hints === 0) return
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

    // Adds Reveal CSS
    const elCell = getElementFromCoord(randCoord)
    elCell.classList.add('hint')

    // Removes CSS + coord from gEmptyCells Array
    setTimeout(() => {
        elCell.classList.remove('hint')
        gEmptyCells.splice[randNum, 1]
    }, 2000)

    // Update Count
    hintCountUpdate(true)
}

// Hint Count Updater
function hintCountUpdate(isUsed) {
    if (isUsed) gGame.hints--

    const elHints = document.querySelector('.hint-count')
    elHints.innerText = gGame.hints
}