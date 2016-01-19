function explode () {
  this.brickSmash = new Audio('brick_smash.mp3');
  this.brickSmash.type = "audio/mp3"; 
  this.brickSmash.volume = 0.2;
  this.brickSmash.play();
  setTimeout(function () {
    this.brickSmash.stop();
  }, 1500);
}
