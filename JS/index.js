// Set up the canvas
var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

// Set up the game variables
var direction, newDirection, snake, food, score, highScore;

// Set up the game over variables
var gameOverContainer = document.getElementById("game-over-container");
var restartButton = document.getElementById("restart-button");

// Set up touch event variables
var touchStartX = null;
var touchStartY = null;

// Resize canvas to be responsive
window.addEventListener('resize', resizeCanvas);

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientWidth;
  drawCanvas();
}

// Initial setup
initGame();

function initGame() {
  direction = "right";
  newDirection = direction;
  snake = [{ x: 10, y: 10 }];
  food = { x: 0, y: 0 };
  score = 0;
  highScore = localStorage.getItem("snakeHighScore") || 0;

  resizeCanvas();
  updateScore();
  generateFood();
  moveSnake();
}

function resizeCanvas() {
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientWidth;
  drawCanvas();
}

// Set up the game functions
function moveSnake() {
  var head = { x: snake[0].x, y: snake[0].y };
  switch (newDirection) {
    case "left":
      head.x--;
      break;
    case "up":
      head.y--;
      break;
    case "right":
      head.x++;
      break;
    case "down":
      head.y++;
      break;
  }
  direction = newDirection;

  // Check if the snake hit a wall
  if (head.x < 0 || head.x >= canvas.width / 10 || head.y < 0 || head.y >= canvas.height / 10) {
    gameOver();
    return;
  }

  // Check if the snake hit itself
  for (var i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
      return;
    }
  }

  // Check if the snake ate the food
  if (head.x === food.x && head.y === food.y) {
    snake.push({ x: 0, y: 0 });
    score++;
    updateScore();
    generateFood();
  }

  // Move the snake
  for (var i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }
  snake[0].x = head.x;
  snake[0].y = head.y;

  // Redraw the canvas
  drawCanvas();

  // Call this function again in 100 milliseconds
  setTimeout(moveSnake, 100);
}

function generateFood() {
  food.x = Math.floor(Math.random() * ((canvas.width / 10) - 4)) + 2;
  food.y = Math.floor(Math.random() * ((canvas.height / 10) - 4)) + 2;
}

function updateScore() {
  document.getElementById("score").textContent = score;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("snakeHighScore", highScore);
    document.getElementById("high-score").textContent = highScore;
  }
}

function drawCanvas() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw the snake
  ctx.fillStyle = "green"; // Voorbeeld: groene slang
  for (var i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x * 10, snake[i].y * 10, 10, 10);
  }

  // Draw the food
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * 10, food.y * 10, 10, 10);
}

function gameOver() {
  // Stop the snake from moving
  direction = null;

  // Show the game over screen
  gameOverContainer.style.display = "flex";

  // Add event listeners to restart button and enter key
  restartButton.addEventListener("click", restartGame);
  document.addEventListener("keydown", function (event) {
    if (event.keyCode === 13) { // Enter key
      restartGame();
    }
  });
}

function restartGame() {
  // Reset the game variables
  direction = "right";
  newDirection = direction;
  snake = [{ x: 10, y: 10 }];
  food = { x: 0, y: 0 };
  score = 0;
  
  // Hide the game over screen
  gameOverContainer.style.display = "none";
  
  // Update the score
  updateScore();
  
  // Generate the initial food
  generateFood();
  
  // Start the game loop
  moveSnake();
}

// Add event listener to the document to listen for arrow key presses
document.addEventListener("keydown", function (event) {
  switch (event.keyCode) {
    case 37:
      if (direction !== "right") {
        newDirection = "left";
      }
      break;
    case 38:
      if (direction !== "down") {
        newDirection = "up";
      }
      break;
    case 39:
      if (direction !== "left") {
        newDirection = "right";
      }
      break;
    case 40:
      if (direction !== "up") {
        newDirection = "down";
      }
      break;
  }
  event.preventDefault(); // Prevent the default action (scrolling)
});

// Add touch event listeners for swipe controls
document.addEventListener("touchstart", function (event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

document.addEventListener("touchmove", function (event) {
  if (!touchStartX || !touchStartY) {
    return;
  }

  var touchEndX = event.touches[0].clientX;
  var touchEndY = event.touches[0].clientY;

  var deltaX = touchEndX - touchStartX;
  var deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && direction !== "left") {
      newDirection = "right";
    } else if (deltaX < 0 && direction !== "right") {
      newDirection = "left";
    }
  } else {
    // Vertical swipe
    if (deltaY > 0 && direction !== "up") {
      newDirection = "down";
    } else if (deltaY < 0 && direction !== "down") {
      newDirection = "up";
    }
  }

  touchStartX = null;
  touchStartY = null;
});
