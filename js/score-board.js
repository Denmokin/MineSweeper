'use strict'

var gScoreTimer // Global Score Timer Value
var gScoreName //  Global Score Name Value


// CLear all Scores Function
function clearScores() {
    // Hide Board
    const elBoardWrapper = document.querySelector('.score-board-container')
    elBoardWrapper.style.display = 'none'

    // Clear LocalStorage
    window.localStorage.clear()

    // Render Board
    renderScores()
}

function addScore(name) {
    // Get Timer
    const elScoreTime = document.querySelector('.timer')
    gScoreTimer = elScoreTime.innerText

    // Add Score with Entered name and Difficulty
    localStorage.setItem(name + `\n` + gLevel.DIFF, gScoreTimer)
    console.log('localStorage: ', localStorage)
    // Render Board
    renderScores()
}

// Render Board Function
function renderScores() {

    // if no scores Don't Run
    if (localStorage.length < 1) return

    // Display Score Board
    const elBoardWrapper = document.querySelector('.score-board-container')
    elBoardWrapper.style.display = 'flex'

    // Get Score Board Container
    const elScoresContainer = document.querySelector('.scores-container')

    // Create clearScores Button
    const resetButton = `<div class="btn score-btn" onclick="clearScores()">🗑️</div>`

    var strHtml = ''

    // Get object Array of Local Storage
    var scores = Object.entries(localStorage)

    // Adds Only One clearButton
    if (scores.length > 0) strHtml += resetButton
   
    //  Render the Scores Board
    for (var i = 0; i < scores.length; i++) {

        var name = scores[i][0]
        var time = scores[i][1]

        var score = `<div class="score">
                <p>${name}</p> 
                <p>${time}</p></div>`

        strHtml += score
    }

    elScoresContainer.innerHTML = strHtml
}

// Get Score name Function from FORM submission

function getScoreName(ev) {

    ev.preventDefault() // Prevents Send Behavior

    // Get Target from form
    const formElement = ev.currentTarget

    // Get Name Value
    const formName = formElement.elements.name.value
    console.log('formName: ', formName)
    // If Name not Submitted Don't Send
    if (!formName) return

    // Converts name from 'denis' or 'DENIS' to 'Denis'
    const scoreName = convertScoreName()

    addScore(scoreName) // Add The new Score
    toggleModal() // Close Form

    function convertScoreName() {
        var convertedName = ''
        var name = formName.toLowerCase()
        convertedName = name.substring(0, 1).toUpperCase() + name.substring(1, name.length)
        return convertedName
    }
}