const canvasElement = document.getElementById('canvas')
const gameSpace = canvasElement.getContext('2d')

// holds the state of the game at all times
// originalState defined in game.js
let state = originalState()

const xCoordinate = (column) => {
  return Math.round(column * canvasElement.width / state.columns)
}
const yCoordinate = (row) => {
  return Math.round(row * canvasElement.height / state.rows)
}

// arrow key event listener
window.addEventListener('keydown', e => {
  switch (e.key) {
    // set new state to old state plus the direction
    // directions defined in snake.js
    case 'ArrowUp': state = moveSnake(state, up); break
    case 'ArrowLeft':  state = moveSnake(state, left);  break
    case 'ArrowDown':  state = moveSnake(state, down); break
    case 'ArrowRight': state = moveSnake(state, right);  break
  }
})

const makeFood = () => {
  gameSpace.fillStyle = '#3dff84'
  gameSpace.fillRect(xCoordinate(state.food.x), yCoordinate(state.food.y), xCoordinate(1), yCoordinate(1))
}

const makeSnake = () => {
  gameSpace.fillStyle = '#FFFF'
  state.snake.map(position => gameSpace.fillRect(xCoordinate(position.x), yCoordinate(position.y), xCoordinate(1), yCoordinate(1)))
}

const makeGameBoard = () => {
  gameSpace.fillStyle = '#0000'
  gameSpace.fillRect(0, 0, canvasElement.width, canvasElement.height)
}

const refreshLoop = () => {
  gameSpace.fillStyle = '#20b6db'
  gameSpace.fillRect(0, 0, canvasElement.width, canvasElement.height)
}

const drawSnake = () => {

  refreshLoop()

  makeGameBoard()

  makeSnake()

  makeFood()
}

const recalculateSnakeState = timeStamp1 => (timeStamp2) => {
  if (timeStamp2 - timeStamp1 > 110) {
    state = next(state)
    drawSnake()
    window.requestAnimationFrame(recalculateSnakeState(timeStamp2))
  } else {
    window.requestAnimationFrame(recalculateSnakeState(timeStamp1))
  }
}

drawSnake();
// invoke step whenever 0 time has passed
window.requestAnimationFrame(recalculateSnakeState(0))
