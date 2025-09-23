'use strict'


// Mark Count Updater Function
function lifeCountUpdate(isLose) {
    if (isLose) gGame.lives--

    const elFlags = document.querySelector('.life-count')
    elFlags.innerText = gGame.lives
}

// life Change Function
function lifeIconChange(isLose) {
    const elLife = document.querySelector('.life-icon')
    if (isLose) elLife.innerText = HIT
    if (!isLose) elLife.innerText = LIFE
}

// Face Change Function
function faceChange(isMine) {
    const elBtn = document.querySelector('.btn')
    if (isMine) elBtn.innerText = OUTCH
    else elBtn.innerText = SHOCK
    setTimeout(() => { elBtn.innerText = SMILE }, 200)
}

// Mark Count Updater Function
function markCountUpdate(marked) {
    if (marked !== 0) {
        marked ? gGame.markedCount-- : gGame.markedCount++
    }
    const elFlags = document.querySelector('.mark-count')
    elFlags.innerText = gGame.markedCount
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
