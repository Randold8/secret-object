let paddleWidth = 20;
let paddleHeight = 100;
let ballRadius = 20;
let leftPaddle, rightPaddle, ball;
let playerScore = 0;
let computerScore = 0;
let paddleDirection = 0;

function setup() {
  createCanvas(800, 600);
  leftPaddle = new Paddle(paddleWidth, height / 2 - paddleHeight / 2, paddleHeight);
  rightPaddle = new Paddle(width - paddleWidth, height / 2 - paddleHeight / 2, paddleHeight);
  ball = new Ball(width / 2, height / 2, ballRadius);
}

function draw() {
  background(0);
  leftPaddle.show();
  leftPaddle.move(paddleDirection); // Move the paddle based on the current direction
  rightPaddle.follow(ball);
  rightPaddle.show();
  ball.show();
  ball.update();
  ball.checkCollision(leftPaddle, rightPaddle);
  showScores();
}

function keyPressed() {
  if (keyCode === UP_ARROW) {
    paddleDirection = -1; // Move up
  } else if (keyCode === DOWN_ARROW) {
    paddleDirection = 1; // Move down
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW || keyCode === DOWN_ARROW) {
    paddleDirection = 0; // Stop moving
  }
}

class Paddle {
  constructor(x, y, height) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = paddleWidth;
    this.ySpeed = 0;
  }

  move(direction) {
    this.y += direction * 10; // Adjust the speed by multiplying the direction by a constant
    this.y = constrain(this.y, 0, height - this.height);
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
  }

  follow(ball) {
    this.y = ball.y - this.height / 2;
    this.y = constrain(this.y, 0, height - this.height);
  }
}

class Ball {
  constructor(x, y, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.xSpeed = Math.random() < 0.5 ? -5 : 5;
    this.ySpeed = random(-5, 5);
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.radius * 2);
  }

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  checkCollision(leftPaddle, rightPaddle) {
    if (this.x - this.radius < leftPaddle.x + leftPaddle.width) {
      if (this.y > leftPaddle.y && this.y < leftPaddle.y + leftPaddle.height) {
        this.xSpeed = abs(this.xSpeed);
      } else {
        computerScore++;
        resetBall();
      }
    } else if (this.x + this.radius > rightPaddle.x) {
      if (this.y > rightPaddle.y && this.y < rightPaddle.y + rightPaddle.height) {
        this.xSpeed = -abs(this.xSpeed);
      } else {
        playerScore++;
        resetBall();
      }
    }
    if (this.y - this.radius < 0 || this.y + this.radius > height
) {
      this.ySpeed = -this.ySpeed;
    }
  }
}

function showScores() {
  fill(255);
  textSize(32);
  text(`Player: ${playerScore}`, 20, 40);
  text(`Computer: ${computerScore}`, width - 200, 40);
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  this.xSpeed = Math.random() < 0.5 ? -5 : 5;
  ball.ySpeed = random(-5, 5);
}
