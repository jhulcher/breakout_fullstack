var noteMaker = document.createElement('script');
noteMaker.src = './javascript/music.js';
document.head.appendChild(noteMaker);

var explode = document.createElement('script');
explode.src = './javascript/explode.js';
document.head.appendChild(explode);

var particles = document.createElement('script');
particles.src = './javascript/particles.js';
document.head.appendChild(particles);

var createBasicExplosion = document.createElement('script');
createBasicExplosion.src = './javascript/particles.js';
document.head.appendChild(createBasicExplosion);

var score = 0;
var lives = 5;
var level = 1;

var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var titleOver = true;
var titleSequence = canvas.height + 35;
var titleVert = canvas.height;
var levelTwoTimer = 0;

var x = canvas.width / 2;
var y = canvas.height - 20;

var ballDirectionX = 3;
var ballDirectionY = -3;
var ballRadius = 10;

var paddleHeight = 10;
var paddleWidth = 125;
var paddleX = (canvas.width - paddleWidth) / 2;
var paddleDirection = "right";

var rightPressed = false;
var leftPressed = false;

var blockRowCount = 6;
var blockColumnCount = 14;
var blockWidth = 40;
var blockHeight = 15;
var blockPadding = 0;
var cornerRadius = 10;
var blockOffsetTop = 135;
var blockOffsetLeft = 40;
var blocks = [];

var textSize = 0;
var offset = 10;
var colors = ["#180000", "#320000", "#4C0000", "#660000", "#6c0003",
              "#7E0000", "#980000", "#B20000", "#CC0000", "#E40000",
              "#CC0000", "#B20000", "#980000", "#7E0000", "#6c0003",
              "#660000", "#4C0000", "#320000", "#180000"];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
// document.addEventListener("mousemove", mouseMoveHandler, false);
// function mouseMoveHandler (e) {
//   var relativeX = e.clientX - canvas.offsetLeft;
//   if (relativeX > 10 && relativeX < canvas.width - 10) {
//     paddleX = relativeX - paddleWidth / 2;
//   }
// }

function drawWalls() {
  // left wall
  ctx.beginPath();
  ctx.rect(0, 50, 40, 415);
  ctx.fillStyle = "#484947";
  ctx.fill();
  ctx.closePath();
  // bottom of left wall
  ctx.beginPath();
  ctx.rect(0, 465, 40, 20);
  ctx.fillStyle = "#004df8";
  ctx.fill();
  ctx.closePath();
  //  top of walls
  ctx.beginPath();
  ctx.rect(40, 50, 560, 30);
  ctx.fillStyle = "#484947";
  ctx.fill();
  ctx.closePath();
  // bottom of right wall
  ctx.beginPath();
  ctx.rect(600, 465, 40, 15);
  ctx.fillStyle = "#a64802";
  ctx.fill();
  ctx.closePath();
  // right wall
  ctx.beginPath();
  ctx.rect(600, 50, 40, 415);
  ctx.fillStyle = "#484947";
  ctx.fill();
  ctx.closePath();
}

function setBlocks () {
  blocks = [];
  for (var c = 0; c < blockColumnCount; c++) {
    blocks[c] = [];
    for (var r = 0; r < blockRowCount; r++) {
      if (r === 0) {
        blocks[c][r] = { x: 0, y: 0, status: 1, color: "#6c0003" };
      } else if (r === 1) {
        blocks[c][r] = { x: 0, y: 0, status: 1, color: "#a64802" };
      } else if (r === 2) {
        blocks[c][r] = { x: 0, y: 0, status: 1, color: "#5b6c01" };
      } else if (r === 3) {
        blocks[c][r] = { x: 0, y: 0, status: 1, color: "#009d19" };
      } else if (r === 4) {
        blocks[c][r] = { x: 0, y: 0, status: 1, color: "#40fe06" };
      } else {
        blocks[c][r] = { x: 0, y: 0, status: 1, color: "#004df8" };
      }
    }
  }
}

function drawBlocks () {
  for (var c = 0; c < blockColumnCount; c++) {
    for (var r = 0; r < blockRowCount; r++) {
      if (blocks[c][r].status > 0) {
        var blockX = (c * (blockWidth + blockPadding)) + blockOffsetLeft;
        var blockY = (r * (blockHeight + blockPadding)) + blockOffsetTop;
        blocks[c][r].x = blockX;
        blocks[c][r].y = blockY;
        ctx.beginPath();
        ctx.rect(blockX, blockY, blockWidth, blockHeight);
        ctx.fillStyle = blocks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function keyDownHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = true;
    paddleDirection = "right";
  } else if (e.keyCode === 37) {
    leftPressed = true;
    paddleDirection = "left";
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function collisionDetection () {
  for (var c = 0; c < blockColumnCount; c++) {
    for (var r = 0; r < blockRowCount; r++) {
      var b = blocks[c][r];
      if (b.status > 0) {
        // touching bottom of block
        if ((x + ballDirectionX > b.x - 10) &&
            (x + ballDirectionX < (b.x + (blockWidth + 10))) &&
            (y + ballDirectionY > b.y) &&
            (y + ballDirectionY < (b.y + 16)) &&
            (y + ballDirectionY > b.y + 9) &&
            (ballDirectionY < 0)) {
                if (r < 5 && (blocks[c][r + 1].status === 0)) {
                  noteMaker(r);
                  ballDirectionY = -ballDirectionY;
                  b.status = 0;
                  createBasicExplosion(b.x, b.y, b.color);
                  explode();
                } else if (r === 5) {
                  noteMaker(r);
                  ballDirectionY = -ballDirectionY;
                  b.status = 0;
                  createBasicExplosion(b.x, b.y, b.color);
                  explode();
                }
        } else if (
         // touching right side of block
         (y > b.y) &&
         (y < (b.y + blockHeight)) &&
         (x > b.x) &&
         (x < (b.x + blockWidth + 7))) {
             noteMaker(r);
             ballDirectionX = -ballDirectionX;
             b.status = 0;
             createBasicExplosion(b.x, b.y, b.color);
             explode();
         } else if (
          // touching left side of block
            (y > b.y) &&
            (y < (b.y + blockHeight)) &&
            (x > b.x - blockWidth + 18) &&
            (x < b.x)) {
                noteMaker(r);
                ballDirectionX = -ballDirectionX;
                b.status = 0;
                createBasicExplosion(b.x, b.y, b.color);
                explode();
         } else if (
          // touching top of block
              (x + ballDirectionX > b.x - 19) &&
              (x + ballDirectionX < (b.x + (blockWidth + 10))) &&
              (y + ballDirectionY + 4 < b.y) &&
              (y + ballDirectionY + 4 > (b.y - 7)) &&
              (y + ballDirectionY < b.y) &&
              (ballDirectionY > 0)) {
                  if (r > 0 && (blocks[c][r - 1].status === 0)) {
                   noteMaker(r);
                   ballDirectionY = -ballDirectionY;
                   b.status = 0;
                   createBasicExplosion(b.x, b.y, b.color);
                   explode();
                 } else if (r === 0) {
                   noteMaker(r);
                   ballDirectionY = -ballDirectionY;
                   b.status = 0;
                   createBasicExplosion(b.x, b.y, b.color);
                   explode();
                 }
         }
         if (b.status === 0) {
           if (r === 5) {
             score += 1;
           } else if (r === 4) {
             score += 1;
           } else if (r === 3) {
             score += 4;
           } else if (r === 2) {
             score += 4;
           } else if (r === 1) {
             score += 7;
           } else {
             score += 7;
             if (ballDirectionX > 0) {
               ballDirectionX = 5;
             } else {
               ballDirectionX = -5;
             }
             if (ballDirectionY > 0) {
               ballDirectionY = 5;
             } else {
               ballDirectionY = -5;
             }
           }
         }
      }
    }
  }
}

function drawBall() {
    ctx.beginPath();
    ctx.rect(x, y, 10, 10);
    ctx.fillStyle = "#bf4646";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle () {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#a64802";
  ctx.fill();
  ctx.closePath();
}

function drawScore () {
  ctx.font = "50px Imagine";
  ctx.fillStyle = "#484947";
  if (score.toString().length === 1) {
    var newScore = "0  0  " + score;
  } else if (score.toString().length === 2) {
        newScore = "0  " + score.toString()[0] + "  " +
        score.toString()[1];
  } else if (score.toString().length === 3) {
        newScore = score.toString()[0] + "  " +
        score.toString()[1] + "  " + score.toString()[2];
  }
  ctx.fillText(newScore, 85, 42);
}

function drawLives () {
  ctx.font = "50px Imagine";
  ctx.fillStyle = "#484947";
  ctx.fillText(lives, 410, 42);
}

function drawLevel () {
  ctx.font = "50px Imagine";
  ctx.fillStyle = "#484947";
  ctx.fillText(level, 540, 42);
}

function drawTitle () {
  if (titleVert === 264) {
        var color = "grey";
        ctx.font = "20px Imagine";
        ctx.font = textSize;
        ctx.fillStyle = "white";
        ctx.fillText("Inspired by the original Atari 2600 Game", 76, 450);
  } else {
    color = colors.shift();
    colors.push(color);
  }
    ctx.font = textSize + "px Imagine";
    ctx.font = textSize;
    ctx.fillStyle = color;
    ctx.fillText("BREAKOUT", (canvas.width / 2) - offset, titleVert);
  if (titleVert > 265) {
    textSize += 1.25;
    offset += 3.5;
  }
}

function draw () {
  if (titleSequence <= 200) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  // start the title sequence
  if (titleSequence > 200) {
    drawTitle();
    if (titleVert > 264) {
      titleVert -= 3;
    }
    titleSequence -= 1;
  }
  // level 1 title
  if (titleSequence <= 200 && titleSequence > 50) {
    drawWalls();
    drawBlocks();
    drawScore();
    drawLives();
    drawLevel();
    if (titleSequence < 150) {
      ctx.font = "50px Imagine";
      ctx.fillStyle = "#484947";
      ctx.fillText("Wall 1", 230, titleVert + 15);
    }
    titleSequence -= 1;
    if (titleSequence === 50) {
      noteMaker(7);
    }
  }
  // after title sequence is over play game
  if (titleSequence <= 50) {
    drawWalls();
    drawBall();
    drawPaddle();
    collisionDetection();
    drawBlocks();
    drawScore();
    drawLives();
    drawLevel();
    x += ballDirectionX;
    y += ballDirectionY;
  }
  // if game over
  if (lives === 0) {
    ballDirectionY = 0;
    ballDirectionX = 0;
    x = 300;
    y = -15;
    ctx.font = "50px Imagine";
    ctx.fillStyle = "#484947";
    ctx.fillText("GAME OVER", 165, titleVert + 15);
    setTimeout(function () {
      document.location.reload();
    }, 5000);
  }
  // ball hits sides of screen
  if (x + ballDirectionX > ((canvas.width - ballRadius) - 40) ||
      x + ballDirectionX < (ballRadius + 29)) {
    noteMaker(7);
    ballDirectionX = -ballDirectionX;
  }
  // ball hits top of screen
  if (y + ballDirectionY < ballRadius + 71 &&
      y + ballDirectionY > ballRadius + 65) {
    noteMaker(7);
    ballDirectionY = -ballDirectionY;
  }

  if ((y + ballDirectionY > canvas.height - 20) &&
      (y + ballDirectionY < canvas.height - (ballDirectionY * 4)) &&
      (x + ballDirectionX < (paddleX + paddleWidth + 4)) &&
      (x + ballDirectionX > (paddleX + paddleWidth))) {
        //  ball hits right side of paddle
          noteMaker(6);
          if (rightPressed) {
            ballDirectionX = 5;
          } else {
            ballDirectionX = 4;
          }
          ballDirectionY = -3;
  } else if ((y + ballDirectionY > canvas.height - 20) &&
             (y + ballDirectionY < canvas.height - (ballDirectionY * 4)) &&
             (x + ballDirectionX < (paddleX)) &&
             (x + ballDirectionX > (paddleX - 12))) {
                // ball hits left side of paddle
                 noteMaker(6);
                 if (leftPressed) {
                   ballDirectionX = -5;
                 } else {
                   ballDirectionX = -4;
                 }
                 ballDirectionY = -3;
  }

  if (y + ballDirectionY > canvas.height - 20 &&
      y + ballDirectionY < canvas.height - 10) {
    if (x > (paddleX - 8) && x < (paddleX + paddleWidth)) {
      if (rightPressed) {
          if (ballDirectionX === -2) {
            ballDirectionX += 1;
          } else if (ballDirectionX === -1) {
            ballDirectionX = -1;
          } else {
            if (ballDirectionX < 4) {
              ballDirectionX += 2;
            }
          }
      } else if (leftPressed) {
          if (ballDirectionX === 2) {
            ballDirectionX -= 1;
          } else if (ballDirectionX === 1) {
            ballDirectionX = 1;
          } else {
            if (ballDirectionX > -4) {
              ballDirectionX -= 2;
            }
          }
      } else {
        if (Math.abs(ballDirectionY) < 5) {
          ballDirectionY += 1;
        }
      }
      noteMaker(6);
      ballDirectionY = -ballDirectionY;
    }
  }
  // if ball is lost at bottom of screen
  if ((y + ballDirectionY) > (canvas.height )) {
    x = 300;
    y = -11;
    lives -= 1;
      if (lives > 0) {
      var newValue = (Math.floor(Math.random() * 500) + 1);
      if (newValue < 70) {
        newValue = 70;
      } else if (newValue > 570) {
        newValue = 570;
      }
      // this is only for left/right direction
      if (x < 320) {
        ballDirectionX = 2;
      } else {
        ballDirectionX = -2;
      }
      // this serves a new ball after a lost ball
      ballDirectionY = 0;
      ballDirectionX = 0;
      setTimeout(function () {
        x = newValue;
        y = canvas.height - 20;
        noteMaker(7);
        ballDirectionX = 3;
        ballDirectionY = -3;
      }, 2500);
    }
  }
  //  moves paddle left and right
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 14;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 14;
  }
  // when player beats level 1
  if (score === 336 && levelTwoTimer < 100) {
    levelTwoTimer += 1;
    level = 2;
    setBlocks();
    drawBlocks();
    x = 300;
    y = -15;
    ballDirectionX = 0;
    ballDirectionY = 0;
    ctx.font = "50px Imagine";
    ctx.fillStyle = "#484947";
    ctx.fillText("Wall 2", 230, titleVert + 15);
  }
  // starts level 2
  if (levelTwoTimer === 100) {
    levelTwoTimer = 101;
    x = canvas.width / 2;
    y = canvas.height - 20;
    paddleX = (canvas.width / 2) - (paddleWidth / 2);
    noteMaker(7);
    ballDirectionX = 3;
    ballDirectionY = -2;
  }
  // If the game is won
  if (level === 2 && score === 672) {
    x = 300;
    y = -10;
    ballDirectionX = 0;
    ballDirectionY = 0;
    ctx.fillText("Congratulations!", 49, 250);
    ctx.fillText("You've Won!", 150, 310);
    setTimeout(function () {
      document.location.reload();
    }, 5000);
  }
  update(50);
  requestAnimationFrame(draw);
}

function update (time) {
  for (var i = 0; i < particles.length; i++) {
    var particle = particles[i];
    particle.update(time);
    particle.draw(ctx);
  }
}

setBlocks();
draw();
