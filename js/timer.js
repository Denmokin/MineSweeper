'use strict'

/* Global toggle timer Function*/

var stopwatchStart = null
var stopwatchTimerId = null
var stopwatchRunning = false

/* ----------------------------------*/

function toggleStopwatch(selector) {
  var sel = selector || '.timer'
  if (!stopwatchRunning) {
    stopwatchStart = Date.now()
    stopwatchTimerId = setInterval(function () {
      var elapsed = Date.now() - stopwatchStart
      var min = String(Math.floor(elapsed / 60000)).padStart(2, '0')
      var sec = String(Math.floor((elapsed % 60000) / 1000)).padStart(2, '0')
      var ms = String(Math.floor((elapsed % 1000) / 10)).padStart(2, '0') // Did't used
      var el = document.querySelector(sel)
      if (el) el.innerText = `${min}:${sec}`
    }, 10)
  } else {
    clearInterval(stopwatchTimerId)
  }
  stopwatchRunning = !stopwatchRunning
}