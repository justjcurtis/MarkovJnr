const dim = 51
let cells = []
let cellSize = 0
let mark
let w
let h

const reset = () => {
  solving = false
  cells = new Array(Math.floor(w / cellSize)).fill(0).map(_ => new Array(dim).fill(0).map(_ => ({ color: "black" })))

  cells[Math.floor(Math.floor(cells.length / 2))][Math.floor(dim / 2)].color = 'red'
  mark = new MarkovJnr([
    ["Rbb", "GGR"], ["RGG", "wwR"], // maze gen
    ["Bw", "PB"], ["PBb", "BYb"], ["PBY", "BYY"], ["BR", "PR"], ["PPB", "PBY"], // maze solve
    ["Y", "w"] // cleanup
  ])
  loop()
}

function setup() {
  w = window.innerWidth
  h = window.innerHeight
  createCanvas(w, h)
  background(51)
  cellSize = h / dim

  // loop erased random walk
  // cells[Math.floor(Math.floor(cells.length / 2))][Math.floor(dim / 2)].color = 'red'
  // mark = new MarkovJnr([["Rbb", "wwR"], ["Rbw", "GwP"], ["PwG", "PbY"], ["Yww", "bbY"], ["YwP", "bbR"]])

  // random maze gen
  // cells[Math.floor(Math.floor(cells.length / 2))][Math.floor(dim / 2)].color = 'red'
  // mark = new MarkovJnr([["Rbb", "GGR"], ["RGG", "wwR"]])

  // growth
  // cells[Math.floor(Math.floor(cells.length / 2))][Math.floor(dim / 2)].color = 'white'
  // mark = new MarkovJnr([["wb", "ww"]])
  reset()
}

let canReset = false
let falseCount = 0
let solving = false
function draw() {
  for (let i = 0; i < cells.length; i++) {
    for (let j = 0; j < cells[0].length; j++) {
      const { color } = cells[i][j]
      fill(color)
      stroke(color)
      rect(i * cellSize, j * cellSize, cellSize, cellSize)
    }
  }
  falseCount += !mark.update(cells) ? 1 : 0
  if (falseCount > 10) {
    if (!solving) {
      solving = true
      // set entry point for solver
      outer: for (let i = 0; i < cells.length; i++) {
        for (let j = 1; j < cells[0].length; j++) {
          const { color } = cells[i][j]
          if (color == 'white') {
            cells[i][j - 1].color = 'blue'
            break outer
          }
        }
      }
      falseCount = 0
    } else {
      // enable reset on tap
      falseCount = 0
      canReset = true
      noLoop()
    }
  }
}

function mouseClicked() {
  if (canReset) {
    canReset = false
    reset()
  }
}