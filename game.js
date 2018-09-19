// Use X and Y coordinates to determine direction
const up = { x: 0, y:-1 }
const down = { x: 0, y: 1 }
const right  = { x: 1, y: 0 }
const left  = { x:-1, y: 0 }

// helper functions
const merge = o1 => o2 => Object.assign({}, o1, o2)
const map = f => xs => xs.map(f)
const objectOf = k => v => { var o = {}; o[k] = v; return o }
const spec = o => x => Object.keys(o)
  .map(k => objectOf(k)(o[k](x)))
  .reduce((acc, o) => Object.assign(acc, o))
const range = n => m => Array.apply(null, Array(m - n)).map((_, i) => n + i)
const rep = c => n => map(k(c))(range(0)(n))
const random = min => max => Math.floor(Math.random() * max) + min
const mod = x => y => ((y % x) + x) % x

// initial state declaration
const originalState = () => ({
  columns:  30,
  rows:  20,
  moves: [left],
  snake: [],
  food: { x: 25, y: 12 },
})

const coordinates = point1 => point2 => point1.x == point2.x && point1.y == point2.y

const eat = (appState) => {
  return coordinates(snakeFront(appState))(appState.food)
}

const crash = (appState) => {
  return appState.snake.find(coordinates(snakeFront(appState)))
}

const dropFirst = (direction) => {
  return direction.slice(1)
}

const dropLast = (direction) => {
  return direction.slice(0, direction.length - 1)
}

const nextMoves = (appState) => {
  return appState.moves.length > 1 ? dropFirst(appState.moves) : appState.moves
}

const nextFood = (appState) => {
  return eat(appState) ? nextPosition(appState) : appState.food
}

const snakeFront  = (appState) => {
  return appState.snake.length == 0 ? { x: 4, y: 4 }
  : {
    x: mod(appState.columns)(appState.snake[0].x + appState.moves[0].x),
    y: mod(appState.rows)(appState.snake[0].y + appState.moves[0].y)
  }
}

const nextSnake = (appState) => {
  return crash(appState)
    ? []
    : (eat(appState)
      ? [snakeFront(appState)].concat(appState.snake)
      : [snakeFront(appState)].concat(dropLast(appState.snake)))
}

const nextPosition = (gameBoard) => ({
  x: random(0)(gameBoard.columns - 1),
  y: random(0)(gameBoard.rows - 1)
})

const prop = k => o => o[k]
const next = spec({
  rows:  prop('rows'),
  columns:  prop('columns'),
  moves: nextMoves,
  snake: nextSnake,
  food: nextFood
})

const moveSnake = (appState, move) => merge(appState)({ moves: appState.moves.concat([move]) })
