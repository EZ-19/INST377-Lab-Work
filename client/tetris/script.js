document.addEventListener('DOMContentLoaded', () => {
  const GRID = document.querySelector('.grid');
  let squares = Array.from(document.querySelectorAll('.grid div'));
  const SCORE_DISPLAY = document.querySelector('#score');
  const START_BTN = document.querySelector('#start-button');
  const WIDTH = 10;
  let nextRandom = 0;
  let timerID;
  const colors = [
    'orange',
    'red',
    'purple',
    'green',
    'blue'
  ];

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

  // Array of possible Tetrominoes
  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino];

  // Current variables of active Tetromino
  let currentPosition = 4;
  let currentRotation = 0;

  // Randomly select a Tetromino and its first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][0];

  // Draws the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add('tetromino');
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // Undraws the Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove('tetromino');
      squares[currentPosition + index].style.backgroundColor = '';
    });
  }

  // Previews the next Tetromino
  const DISPLAY_SQUARES = document.querySelectorAll('.mini-grid div');
  const DISPLAY_WIDTH = 4;
  const displayIndex = 0;

  // Tetrominoes without rotations
  const upNextTetrominoes = [
    [1, DISPLAY_WIDTH + 1, DISPLAY_WIDTH * 2 + 1, 2], // lTetromino
    [0, DISPLAY_WIDTH, DISPLAY_WIDTH + 1, DISPLAY_WIDTH * 2 + 1], // zTetromino
    [1, DISPLAY_WIDTH, DISPLAY_WIDTH + 1, DISPLAY_WIDTH + 2], // tTetromino
    [0, 1, DISPLAY_WIDTH, DISPLAY_WIDTH + 1], // oTetromino
    [1, DISPLAY_WIDTH + 1, DISPLAY_WIDTH * 2 + 1, DISPLAY_WIDTH * 3 + 1] // iTetromino
  ];

  // Displays the next Tetromino in the mini grid
  function displayShape() {
    // Remove previous preview Tetromino
    DISPLAY_SQUARES.forEach((square) => {
      square.classList.remove('tetromino');
      square.style.backgroundColor = '';
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      DISPLAY_SQUARES[displayIndex + index].classList.add('tetromino');
      DISPLAY_SQUARES[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  // Adds to score
  function addScore() {
    for (let i = 0; i < 199; i += WIDTH) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

      if (row.every((index) => squares[index].classList.contains('taken'))) {
        score += 10;
        SCORE_DISPLAY.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove('taken');
          squares[index].classList.remove('tetromino');
          squares[index].style.backgroundColor = '';
        });
        const SQUARES_REMOVED = squares.splice(i, WIDTH);
        squares = SQUARES_REMOVED.concat(squares);
        squares.forEach((cell) => GRID.appendChild(cell));
      }
    }
  }

  // Determine if there is a game over
  function gameOver() {
    if (current.some((index) => squares[currentPosition + index].classList.contains('taken'))) {
      SCORE_DISPLAY.innerHTML = 'end';
      clearInterval(timerID);
    }
  }

  // Freezes the Tetromino
  function freeze() {
    if (current.some((index) => squares[currentPosition + index + WIDTH].classList.contains('taken'))) {
      current.forEach((index) => squares[currentPosition + index].classList.add('taken'));
      // Make a new Tetromino fall
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
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

  // Rotates the Tetromino
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
  // timerID = setInterval(moveDown, 1000);

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

  // Allows button to stop and start
  START_BTN.addEventListener('click', () => {
    if (timerID) {
      clearInterval(timerID);
      timerID = null;
    } else {
      draw();
      timerID = setInterval(moveDown, 1000);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });

  document.addEventListener('keyup', control);
});
