var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var particles = [];

function Particle () {
  this.scale = 1.0;
  this.x = 0;
  this.y = 0;
  this.radius = 15;
  this.color = "#000";
  this.velocityX = 0;
  this.velocityY = 0;
  this.scaleSpeed = 0.5;

 this.update = function(ms) {
    this.scale -= (this.scaleSpeed * ms / 1000.0);

    if (this.scale <= 0) {
      this.scale = 0;
    }
    this.x += this.velocityX * ms/1000.0;
    this.y += 60 * ms/1000.0;
  };

  this.draw = function() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.scale, this.scale);

    ctx.beginPath();
    ctx.rect(0, 0, this.radius, 15);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  };
}

function createBasicExplosion(i, o, partColor) {
  for (var angle = 0; angle < 360; angle += 45) {
    var particle = new Particle();
    particle.x = i + 20;
    particle.y = o + 7;
    particle.color = partColor;
    var speed = 50.0;
    particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
    particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);
    particles.push(particle);
  }
}
