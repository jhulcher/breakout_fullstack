function keyDownHandler (e) {
  // left and right keys for paddle movement
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
  // letter input and delete key only for high score
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
  // enter key for begin game and enter high score
  if (e.keyCode === 13 && sequenceCount === canvas.height + 35) {
    begin = true;
    sequenceCount = 200;
  } else if (e.keyCode === 13 && gameOver === true &&
             scoreEntered === false && name.length === 3) {
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
