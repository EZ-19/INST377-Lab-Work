document.addEventListener('DOMContentLoaded', () => {
  const GRID = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const SCORE_DISPLAY = document.querySelector('#score');
  const START_BTN = document.querySelector('#start-button');
  const WIDTH = 10;

  // The Tetriminoes
  const lTetromino = [
    [1, WIDTH + 1, WIDTH * 2 + 1, 2],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 2],
    [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2]
  ];

  const zTetromino = [
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
    [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
    [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1]
  ];

  const tTetromino = [
    [1, WIDTH, WIDTH + 1, WIDTH + 2],
    [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
    [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1]
  ];

  const oTetromino = [
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1],
    [0, 1, WIDTH, WIDTH + 1]
  ];

  const iTetromino = [
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
    [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
    [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3]
  ];

  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][0];

  // Draws the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino')
    });
  }

  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino')
    });
  }

  // Freezes the Tetromino
  function freeze() {
    if (current.some((index) => squares[currentPosition + index + WIDTH].classList.contains('taken'))) {
      current.forEach((index) => squares[currentPosition + index].classList.add('taken'));
      // Make a new Tetromino fall
      random = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
    }
  }

  // Moves the Tetromino down
  function moveDown() {
    undraw();
    currentPosition += WIDTH;
    draw();
    freeze();
  }

  // Moves the Tetromino left
  function moveLeft() {
    undraw();
    const IS_LEFT_EDGE = current.some((index) => (currentPosition + index) % WIDTH === 0);

    if (!IS_LEFT_EDGE) currentPosition -= 1;

    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition += 1;
    }

    draw();
  }

  // Moves the Tetromino right
  function moveRight() {
    undraw();
    const IS_RIGHT_EDGE = current.some((index) => (currentPosition + index) % WIDTH === WIDTH - 1);

    if (!IS_RIGHT_EDGE) currentPosition += 1;

    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -= 1;
    }

    draw();
  }

  function rotate() {
    undraw();
    currentRotation += 1;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    current = theTetrominoes[random][currentRotation]
    draw();
  }

  // Move the Tetromino down every second
  timerID = setInterval(moveDown, 1000);

  // Assigning functions to keycodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 38) {
      rotate();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 40) {
      moveDown();
    }
  }
  document.addEventListener('keyup', control)
});
