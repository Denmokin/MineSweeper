'use strict'


// Random integer [min, max] inclusive
function randIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
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

// Get Cell Element
function getElementFromCoord(coord) {
  const cellClass = classFromCoord(coord) // Get coords Class
  const elCell = document.querySelector(`.${cellClass}`) // Element from (DOM)
  return elCell
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

/// Maybe Global Count Updated***
function updateCounter(selector, value, decrease) {
  var newValue = decrease ? value - 1 : value
  var el = document.querySelector(selector)
  el.innerText = newValue
}

function toggleModal() {
  var el = document.querySelector('.modal')
  if (el) el.classList.toggle('modal-open')
}