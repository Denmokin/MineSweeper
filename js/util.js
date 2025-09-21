'use strict'


// Random integer [min, max] inclusive
function randIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// Create matrix filled with value

function createMatrix(rows, cols, value) {
  var mat = []
  for (var i = 0; i < rows; i++) {
    var row = []
    for (var j = 0; j < cols; j++) {
      // Checks if Value is a Function (if you need new object every time)
      row.push(typeof value === 'function' ? value() : value)
    }
    mat.push(row)
  }
  return mat
}

// Create square matrix
function createSquareMatrix(size, fill) {
  return createMatrix(size, size, fill || '')
}

// Render board into a container (each cell gets a class like "cell-2-3")
function renderBoard(selector) {

  // change to what ever function you need
  const clickEvent = 'cellClicked(this,event)"'

  var strHTML = `<table><tbody>`
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr>`
    for (var j = 0; j < gBoard[0].length; j++) {
      strHTML += `<td oncontextmenu="cellClicked(this,event)" 
            onclick="${clickEvent}" 
            class="cell-${i}-${j}"></td>`
    }
    strHTML += `</tr>`
  }
  strHTML += `</tbody></table>`
  document.querySelector(selector).innerHTML = strHTML
}


// Check if coord inside the board
function inBounds(board, coord) {
  var i = coord.i
  var j = coord.j
  return i >= 0 && i < board.length && j >= 0 && j < board[0].length
}

// Render Cell
function renderCell(coord, value) {
  var el = document.querySelector(`.cell-${coord.i}-${coord.j}`)
  if (el) el.innerHTML = value
}

// From class "cell-2-7" to { i:2, j:7 }
function coordFromClass(className) {
  var parts = className.split('-')
  return { i: +parts[1], j: +parts[2] }
}

// From Coord { i:2, j:7 } to "cell-2-7"
function classFromCoord(coord) {
  return `cell-${coord.i}-${coord.j}`
}

// Neighbor Count Object
function countNeighborsObjects(board, rowIdx, colIdx) {
  var count = 0
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      var coord = { i: i, j: j }
      if (i === rowIdx && j === colIdx) continue
      if (!inBounds(board, coord)) continue
      if (board[i][j].isMine === true) count++
    }
  }
  return count
}

// Neighbor Count to Array
function countNeighborsArray(board, rowIdx, colIdx) {
  const arr = []
  for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
    for (var j = colIdx - 1; j <= colIdx + 1; j++) {
      var coord = { i: i, j: j }
      if (i === rowIdx && j === colIdx) continue
      if (!inBounds(board, coord)) continue
      if (isMine(coord)) arr.push(coord)
    }
  }
  return arr
}

// Switch to DarkMode
function switchDarkMode(elDrkBtn) {
  const isDarkMode = document.body.classList.toggle('darkmode')
  elDrkBtn.style.backgroundImage = `url('img/${isDarkMode ? 'whitemode' : 'darkmode'}.png')`
}

// Change some CSS properties Function (if GameBoard width is smaller tha 200px)
function gameInfoBehaviorCSS() {
    var elGameInfo = document.querySelector('.gameinfo-wrapper')
    var elBoardSize = document.querySelector('.table-wrapper')
    var size = elBoardSize.getBoundingClientRect()

    if (size.width < 200) {
        elGameInfo.style.flexDirection = 'column'
        elGameInfo.style.width = size.width + 'px'
    }
    else return
}