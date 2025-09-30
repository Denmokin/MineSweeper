'use strict'


// Life Count Updater Function
function lifeCountUpdate(isLose) {
    if (isLose) gGame.lives--

    const elLives = document.querySelector('.life-count')
    elLives.innerText = gGame.lives
}

// life Change Function
function lifeIconChange(isLose) {
    const elLife = document.querySelector('.life-icon')
    if (isLose) elLife.innerText = HIT
    if (!isLose) elLife.innerText = LIFE
}

// Mark Count Updater Function
function markCountUpdate(isMarked) {
    if (isMarked !== 0) {
        isMarked ? gGame.markedCount-- : gGame.markedCount++
    }
    const elFlags = document.querySelector('.mark-count')
    elFlags.innerText = gGame.markedCount
}

// Face Change Function
function faceChange(isMine) {
    const elBtn = document.querySelector('.restart')
    if (isMine) elBtn.innerText = OUTCH
    else elBtn.innerText = SHOCK
    setTimeout(() => { elBtn.innerText = SMILE }, 200)
}

// Switch to DarkMode
function switchDarkMode(elDrkBtn) {
    const isDarkMode = document.body.classList.toggle('darkmode')
    elDrkBtn.style.backgroundImage = `url('img/${isDarkMode ? 'whitemode' : 'darkmode'}.png')`
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

// Build a board.
function buildBoard() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[i].length; j++) {
            gBoard[i][j] = customCellObject()
        }
    }
}

// Render board into a container
function renderBoard(selector) {

    // change to what ever function you need
    const clickEvent = 'onCellClick(this,event)"'

    var strHTML = `<table><tbody>`
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < gBoard[0].length; j++) {
            strHTML += `<td oncontextmenu="${clickEvent}" 
            onclick="${clickEvent}" 
            class="cell-${i}-${j}"></td>`
        }
        strHTML += `</tr>`
    }
    strHTML += `</tbody></table>`
    document.querySelector(selector).innerHTML = strHTML
}


// Change some CSS properties Function (if GameBoard width is smaller tha 200px)
function gameInfoBehaviorCSS() {

    var elGameInfo = document.querySelector('.gameinfo-wrapper')
    var elBoardSize = document.querySelector('.table-wrapper')
    var size = elBoardSize.getBoundingClientRect()

    if (size.width < 250) {
        elGameInfo.style.flexDirection = 'column'
        elGameInfo.style.width = size.width + 'px'
    }
    else {
        elGameInfo.style.flexDirection = 'row'
        elGameInfo.style.width = '100%'
    }
}

function disableContextMenu(ev) {
    ev.preventDefault()
}