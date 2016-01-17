var noteMaker = document.createElement('script');
// noteMaker.src = '/app/assets/javascripts/music.js';
document.head.appendChild(noteMaker);

var explode = document.createElement('script');
// noteMaker.src = './javascripts/explode.js';
document.head.appendChild(explode);

var particles = document.createElement('script');
// noteMaker.src = './javascript/particles.js';
document.head.appendChild(particles);

var createBasicExplosion = document.createElement('script');
// noteMaker.src = './javascript/particles.js';
document.head.appendChild(createBasicExplosion);

var score = 0;
var lives = 5;
var level = 1;
var scores = [];


var name = "";
var gameOver = false;
var scoreEntered = false;
var highScores = [];
var scoreDrawn = false;



var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var sequenceCount = canvas.height + 35;
var titleVert = canvas.height;
var levelTimer = 0;

var x = canvas.width / 2;
var y = canvas.height - 20;

var ballDirectionX = 3;
var ballDirectionY = -3;
var ballSize = 10;

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
var blocksTopPadding = 135;
var blocksLeftPadding = 40;
var blocks = [];

var begin = false;
var textSize = 0;
var offset = 10;
var titleColors = ["#180000", "#320000", "#4C0000", "#660000", "#6c0003",
                   "#7E0000", "#980000", "#B20000", "#CC0000", "#E40000",
                   "#CC0000", "#B20000", "#980000", "#7E0000", "#6c0003",
                   "#660000", "#4C0000", "#320000", "#180000"];

var startColors = ["#FDCDA9", "#FDC297", "#FDB885", "#FDAE73", "#FDA361",
                   "#FC994F", "#FC8E3D", "#FC842B", "#FC7A19", "#FC6F07",
                   "#FC7A19", "#FC842B", "#FC8E3D", "#FC994F", "#FDA361",
                   "#FDAE73", "#FDB885", "#FDC297", "#FDCDA9"];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseHandler, false);



function createScore (username, userscore, userlevel) {
  $.ajax({
    url: "/api/scores",
    data: {
            score:
            {
              name: username,
              num: userscore,
              level: userlevel
            }
          },
    method: "POST",
    success: function (response) {
      scoreEntered = true;
      scores = response;
    }
  });
}

function getScores () {
  $.ajax({
    url: "/api/scores",
    method: "GET",
    success: function (response) {
      scores = response;
    }
  });
}



function reset () {
    score = 0;
    lives = 5;
    level = 1;
    name = "";
    gameOver = false;
    scoreEntered = false;
    highScores = [];
    scoreDrawn = false;
    x = canvas.width / 2;
    y = canvas.height - 20;
    paddleX = (canvas.width - paddleWidth) / 2;
    sequenceCount = canvas.height + 35;
    titleVert = canvas.height;
    levelTimer = 0;
    ballDirectionX = 3;
    ballDirectionY = -3;
    blockRowCount = 6;
    begin = false;
    textSize = 0;
    offset = 10;
    titleColors = ["#180000", "#320000", "#4C0000", "#660000", "#6c0003",
                   "#7E0000", "#980000", "#B20000", "#CC0000", "#E40000",
                   "#CC0000", "#B20000", "#980000", "#7E0000", "#6c0003",
                   "#660000", "#4C0000", "#320000", "#180000"];
    setBlocks();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawWalls () {
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
        var rowColor = "#6c0003";
      } else if (r === 1) {
            rowColor = "#a64802";
      } else if (r === 2) {
            rowColor = "#5b6c01";
      } else if (r === 3) {
            rowColor = "#009d19";
      } else if (r === 4) {
            rowColor = "#40fe06";
      } else if (r === 5) {
            rowColor = "#004df8";
      } else if (r === 6) {
            rowColor = "#1a1aff";
      } else if (r === 7 ){
            rowColor = "#4400cc";
      } else if (r === 8) {
            rowColor = "#2b0080";
      } else {
            rowColor = "#6c0003";
      }
      blocks[c][r] = { x: 0, y: 0, status: 1, color: rowColor };
    }
  }
}

function drawBlocks () {
  for (var c = 0; c < blockColumnCount; c++) {
    for (var r = 0; r < blockRowCount; r++) {
      if (blocks[c][r].status > 0) {
        var blockX = (c * (blockWidth + blockPadding)) + blocksLeftPadding;
        var blockY = (r * (blockHeight + blockPadding)) + blocksTopPadding;
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
  } else if (e.keyCode === 8) {
    e.preventDefault();
    name = name.substring(0, name.length - 1);
  }

  if (name.length < 3) {
    if (e.keyCode === 65) {
      name += "A";
    } else if (e.keyCode === 66) {
      name += "B";
    } else if (e.keyCode === 67) {
      name += "C";
    } else if (e.keyCode === 68) {
      name += "D";
    } else if (e.keyCode === 69) {
      name += "E";
    } else if (e.keyCode === 70) {
      name += "F";
    } else if (e.keyCode === 71) {
      name += "G";
    } else if (e.keyCode === 72) {
      name += "H";
    } else if (e.keyCode === 73) {
      name += "I";
    } else if (e.keyCode === 74) {
      name += "J";
    } else if (e.keyCode === 75) {
      name += "K";
    } else if (e.keyCode === 76) {
      name += "L";
    } else if (e.keyCode === 77) {
      name += "M";
    } else if (e.keyCode === 78) {
      name += "N";
    } else if (e.keyCode === 79) {
      name += "O";
    } else if (e.keyCode === 80) {
      name += "P";
    } else if (e.keyCode === 81) {
      name += "Q";
    } else if (e.keyCode === 82) {
      name += "R";
    } else if (e.keyCode === 83) {
      name += "S";
    } else if (e.keyCode === 84) {
      name += "T";
    } else if (e.keyCode === 85) {
      name += "U";
    } else if (e.keyCode === 86) {
      name += "V";
    } else if (e.keyCode === 87) {
      name += "W";
    } else if (e.keyCode === 88) {
      name += "X";
    } else if (e.keyCode === 89) {
      name += "Y";
    } else if (e.keyCode === 90) {
      name += "Z";
    }
  }

  if (e.keyCode === 13 && sequenceCount === canvas.height + 35) {
    begin = true;
    sequenceCount = 200;
  } else if (e.keyCode === 13 && gameOver === true &&
             scoreEntered === false && name.length === 3) {
    console.log("Entering text now: " + name);
    createScore(name, score, level);
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    rightPressed = false;
  } else if (e.keyCode === 37) {
    leftPressed = false;
  }
}

function mouseHandler (e) {
  var mouseX = e.clientX - canvas.offsetLeft;
  if (mouseX > paddleWidth / 2 && mouseX < canvas.width - (paddleWidth / 2)) {
    paddleX = mouseX - paddleWidth / 2;
  }
}

function collisionDetection () {
  for (var c = 0; c < blockColumnCount; c++) {
    for (var r = 0; r < blockRowCount; r++) {
      var b = blocks[c][r];
      if (b.status > 0) {
        // touching bottom of block
        if ((x + ballDirectionX > b.x - 10) &&
            (x + ballDirectionX < b.x + (blockWidth + 10)) &&
            (y + ballDirectionY > b.y) &&
            (y + ballDirectionY < (b.y + 16)) &&
            (y + ballDirectionY > b.y + 9) &&
            (ballDirectionY < 0)) {
                if (r < blockRowCount - 1 && (blocks[c][r + 1].status === 0)) {
                  noteMaker(r);
                  ballDirectionY = -ballDirectionY;
                  b.status = 0;
                  createBasicExplosion(b.x, b.y, b.color);
                  explode();
                } else if (r === blockRowCount - 1) {
                  noteMaker(r);
                  ballDirectionY = -ballDirectionY;
                  b.status = 0;
                  createBasicExplosion(b.x, b.y, b.color);
                  explode();
                }
        // touching right side of block
        } else if ((y > b.y) &&
                   (y < (b.y + blockHeight)) &&
                   (x > b.x) &&
                   (x < (b.x + blockWidth + 7))) {
                       noteMaker(r);
                       ballDirectionX = -ballDirectionX;
                       b.status = 0;
                       createBasicExplosion(b.x, b.y, b.color);
                       explode();
         // touching left side of block
        } else if ((y > b.y) &&
                   (y < b.y + blockHeight) &&
                   (x > b.x - blockWidth + 18) &&
                   (x < b.x)) {
                      noteMaker(r);
                      ballDirectionX = -ballDirectionX;
                      b.status = 0;
                      createBasicExplosion(b.x, b.y, b.color);
                      explode();
         // touching top of block
        } else if ((x + ballDirectionX > b.x - 19) &&
                   (x + ballDirectionX < b.x + (blockWidth + 10)) &&
                   (y + ballDirectionY + 4 < b.y) &&
                   (y + ballDirectionY + 4 > b.y - 7) &&
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
          if (r === 5 || r === 6 || r === 7 || r === 8 || r === 9) {
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

function drawScores () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.rect(140, 0, 15, canvas.height);
  ctx.fillStyle = "#484947";
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  ctx.rect(498, 0, 15, canvas.height);
  ctx.fillStyle = "#484947";
  ctx.fill();
  ctx.closePath();

  ctx.font = "40px Imagine";
  ctx.fillStyle = "#E40000";
  ctx.fillText("high scores", 185, 50);

  getScores();
  var vert = 55;
  scores.forEach(function (thisScore) {
    vert += 40;
    ctx.font = "40px Imagine";
    ctx.fillStyle = "white";
    ctx.fillText(thisScore.name[0] + thisScore.name[1] +
                 thisScore.name[2], 185, vert);
    var num = thisScore.score;
    num = num.toString();
    var numArr = num.split("");
    var newArr = [];
    numArr.forEach(function (el) {
      if (el === "1") {
        newArr.push("  |");
      } else {
        newArr.push(el);
      }
    });
    if (num.length === 4) {
      ctx.fillText(newArr[0] + newArr[1] + newArr[2] + newArr[3], 353, vert);
    } else if (newArr.length === 3) {
      ctx.fillText("   " + newArr[0] + newArr[1] + newArr[2], 353, vert);
    } else if (newArr.length === 2) {
      ctx.fillText("      " + newArr[0] + newArr[1], 353, vert);
    } else if (newArr.length === 1) {
      ctx.fillText("         " + newArr[0], 353, vert);
    }
  });
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
    color = titleColors.shift();
    titleColors.push(color);
  }
  if (titleVert > 265) {
    textSize += 1.25;
    offset += 3.5;
  }
  ctx.font = textSize + "px Imagine";
  ctx.font = textSize;
  ctx.fillStyle = color;
  ctx.fillText("BREAKOUT", (canvas.width / 2) - offset, titleVert);
}

function beatLevel () {
  setBlocks();
  drawBlocks();
  x = 300;
  y = -15;
  ballDirectionX = 0;
  ballDirectionY = 0;
  ctx.font = "50px Imagine";
  ctx.fillStyle = "white";
  ctx.fillText("Level " + level, 215, 316);
}

function startNewLevel () {
  x = canvas.width / 2;
  y = canvas.height - 20;
  paddleX = (canvas.width / 2) - (paddleWidth / 2);
  noteMaker(11);
  ballDirectionX = 3;
  ballDirectionY = -2;
}

function draw () {
  if (sequenceCount <= 200) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  if (begin === false) {
    drawTitle();
    if (titleVert > 264) {
      titleVert -= 3;
    }
    var startColor = startColors.shift();
    startColors.push(startColor);
    setTimeout(function () {
      ctx.font = "35px Imagine";
      ctx.fillStyle = startColor;
      ctx.fillText("Press Enter", 178, 359);
    }, 2600);
  }
  // level 1 title
  if (begin === true) {
    if (sequenceCount <= 200 && sequenceCount > 50) {
      drawWalls();
      drawBlocks();
      drawScore();
      drawLives();
      drawLevel();
      if (sequenceCount < 150) {
        ctx.font = "50px Imagine";
        ctx.fillStyle = "white";
        ctx.fillText("Level 1", 215, 316);
      }
      sequenceCount -= 1;
      if (sequenceCount === 50) {
        noteMaker(11);
      }
    }
  }
  // after title sequence is over play game
  if (sequenceCount <= 50) {
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
  //  moves paddle left and right
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 14;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 14;
  }
  // ball hits sides of screen
  if (x + ballDirectionX > ((canvas.width - ballSize) - 40) ||
      x + ballDirectionX < (ballSize + 29)) {
    noteMaker(11);
    ballDirectionX = -ballDirectionX;
  }
  // if ball hits top of screen
  if (y + ballDirectionY < ballSize + 71 &&
      y + ballDirectionY > ballSize + 65) {
    noteMaker(11);
    ballDirectionY = -ballDirectionY;
  }
  //  if ball hits right side of paddle
  if ((y + ballDirectionY > canvas.height - 20) &&
      (y + ballDirectionY < canvas.height - (ballDirectionY * 4)) &&
      (x + ballDirectionX < (paddleX + paddleWidth + 4)) &&
      (x + ballDirectionX > (paddleX + paddleWidth))) {
          noteMaker(12);
          if (rightPressed) {
            ballDirectionX = 5;
          } else {
            ballDirectionX = 4;
          }
          ballDirectionY = -3;
  // if ball hits left side of paddle
  } else if ((y + ballDirectionY > canvas.height - 20) &&
             (y + ballDirectionY < canvas.height - (ballDirectionY * 4)) &&
             (x + ballDirectionX < (paddleX)) &&
             (x + ballDirectionX > (paddleX - 12))) {
                 noteMaker(12);
                 if (leftPressed) {
                   ballDirectionX = -5;
                 } else {
                   ballDirectionX = -4;
                 }
                 ballDirectionY = -3;
  }
  // if ball hits top of paddle
  if (y + ballDirectionY > canvas.height - 20 &&
      y + ballDirectionY < canvas.height - 10) {
      if (x > (paddleX - 8) && x < (paddleX + paddleWidth)) {
        if (rightPressed && ballDirectionX === -2) {
            ballDirectionX += 1;
        } else if (rightPressed && ballDirectionX === -1) {
            ballDirectionX = -1;
        } else if (rightPressed && ballDirectionX < 4) {
            ballDirectionX += 2;
        } else if (leftPressed && ballDirectionX === 2) {
            ballDirectionX -= 1;
        } else if (leftPressed && ballDirectionX === 1) {
            ballDirectionX = 1;
        } else if (leftPressed && ballDirectionX > -4) {
            ballDirectionX -= 2;
        } else {
          if (Math.abs(ballDirectionY) < 5) {
            ballDirectionY += 1;
          }
        }
        noteMaker(12);
        ballDirectionY = -ballDirectionY;
      }
  }
  // if ball is lost at bottom of screen
  if ((y + ballDirectionY) > (canvas.height )) {
    noteMaker(10);
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
      // chooses direction for new serve
      if (newValue % 2 === 0) {
        var newDirectionX = 3;
      } else {
            newDirectionX = -3;
      }
      // serves a new ball after a lost ball
      ballDirectionY = 0;
      ballDirectionX = 0;
      setTimeout(function () {
        x = newValue;
        y = canvas.height - 20;
        noteMaker(11);
        ballDirectionX = newDirectionX;
        ballDirectionY = -3;
      }, 2500);
    }
  }
  // if player beats level 1
  if (score === 336 && levelTimer < 100) {
    levelTimer += 1;
    level = 2;
    blockRowCount = 7;
    beatLevel();
  }
  // starts level 2
  if (levelTimer === 100) {
    levelTimer = 101;
    startNewLevel();
  }
  // if player beats level 2
  if (score === 686 && levelTimer < 200) {
    levelTimer += 1;
    level = 3;
    blockRowCount = 8;
    beatLevel();
  }
  // starts level 3
  if (levelTimer === 200) {
    levelTimer = 201;
    startNewLevel();
  }
  // if player beats level 3
  if (score === 1036 && levelTimer < 300) {
    levelTimer += 1;
    level = 4;
    blockRowCount = 9;
    beatLevel();
  }
  // starts level 4
  if (levelTimer === 400) {
    levelTimer = 401;
    startNewLevel();
  }
  // if player beats level 4
  if (score === 1386 && levelTimer < 500) {
    levelTimer += 1;
    level = 5;
    blockRowCount = 10;
    beatLevel();
  }
  // starts level 5
  if (levelTimer === 500) {
    levelTimer = 501;
    startNewLevel();
  }
  // If the game is won
  if (score === 1736) {
    x = 300;
    y = -10;
    ballDirectionX = 0;
    ballDirectionY = 0;
    ctx.fillText("Congratulations!", 49, 250);
    ctx.fillText("You've Won!", 150, 316);
    if (sequenceCount === -250) {
      reset();
    }
    sequenceCount -= 1;
  }
  // if game over
  if (lives === 0 && scoreEntered === false) {
    gameOver = true;
    ballDirectionY = 0;
    ballDirectionX = 0;
    x = 300;
    y = -15;
    ctx.font = "50px Imagine";
    ctx.fillStyle = "white";
    ctx.fillText("GAME OVER", 165, 195);

    if (score > (scores[scores.length - 1]).score) {
      ctx.font = "30px Imagine";
      ctx.fillStyle = "white";
      ctx.fillText('Enter initials for high score', 55, 340);

      ctx.beginPath();
      ctx.rect(250, 225, 145, 60);
      ctx.fillStyle = "#484947";
      ctx.fill();
      ctx.closePath();

      ctx.font = "50px Imagine";
      ctx.fillStyle = "white";
      ctx.fillText(name, 269, 271);
    } else {
      setTimeout(function () {
        scoreEntered = true;
      }, 3000);
    }
  }

  if (scoreEntered) {
    drawScores();
    sequenceCount -= 1;
    if (sequenceCount === -600) {
      reset();
    }
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

getScores();
setBlocks();
draw();
