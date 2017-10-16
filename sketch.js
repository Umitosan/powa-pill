// Order of loading
// In global mode (non-instance mode), the order of page loading is as follows:
//
// window onload event fires.
// preload() is called (if included in the sketch), p5 waits for all loading functions within it to complete.
// setup() is called (if included in the sketch). Note that p5 will not wait to go onto draw if there are loading methods in setup().
// draw() is called (if included in the sketch). It continues to be called based on variables set by noLoop()/loop() and frameRate().

// window.innerWidth,
// window.innerHeight

const MWIDTH = 800;
const MHEIGHT = 400;
var mySpinner = new spinner(10,MHEIGHT / 2,3,30);
var userDirection = 'right';
var lastKey = 'none';  // last pressed key
var spinDirection = 'c';

function setup() {
  createCanvas(MWIDTH, MHEIGHT);
  frameRate(60);
  background(0);
  textSize(20);
}
//
// /////////
// // MAIN LOOP
// //////////
function draw() {
  // draw frame in upper left corner
  background('rgb(200,200,200)');
  stroke('black');
  fill('black');
  textAlign(LEFT)
  text(frameCount, 4, 24);
  textAlign(RIGHT)
  text("keycode: " + lastKey,MWIDTH-4,24)
  mySpinner.render();
  mySpinner.slide(userDirection);
}

function keyPressed() {
  lastKey = keyCode;
  if (keyCode === LEFT_ARROW) {
    userDirection = 'left';
    spinDirection = 'cc';
  } else if (keyCode === RIGHT_ARROW) {
    userDirection = 'right';
    spinDirection = 'c';
  } else if (keyCode === UP_ARROW) {
    userDirection = 'up';
  } else if (keyCode === DOWN_ARROW) {
    userDirection = 'down';
  } else {
    // do nothing
  }
}

function spinner(someX,someY,someSpeed,someWidth) {
  this.x1 = someX;
  this.y1 = someY;
  this.speed1 = someSpeed;
  this.diameter = someWidth;

  this.slide = function(direction) {
    if (direction === 'left') {
      this.x1 -= this.speed1;
    } else if (direction === 'right') {
      this.x1 += this.speed1;
    } else if (direction === 'up') {
      this.y1 -= this.speed1;
    } else if (direction === 'down') {
      this.y1 += this.speed1;
    } else {
      console.log(' slide problems ');
    }
    this.checkBounds();
  }

  this.checkBounds = function() {
    if (this.x1 + this.diameter > MWIDTH+10) {
      userDirection = 'left';
      spinDirection = 'cc';
    } else if (this.x1 - this.diameter < -10) {
      userDirection = 'right';
      spinDirection = 'c';
    } else if (this.y1 + this.diameter > MHEIGHT+10) {
      userDirection = 'up';
    } else if (this.y1 - this.diameter < -10) {
      userDirection = 'down';
    } else {
      // in bounds
    }
  }

  this.render = function() {
    var r = this.diameter / 4 + 3;
    // if (frameCount % 5 == 0) {
      stroke('blue');
      // circle
      fill('lightgreen');
      ellipse(this.x1, this.y1, this.diameter, this.diameter);
      // cross inside circle
      push();
      translate(mySpinner.x1, mySpinner.y1);
      // spin direction, this is calculated from objects speed and framecount
      if (spinDirection == 'c') { rotate(frameCount / ( this.speed1 * 5) ); } ;
      if (spinDirection == 'cc') { rotate(frameCount / (-this.speed1 * 5)); } ;
      line(-r,-r,r,r);
      line(-r,r,r,-r);
      pop();
    // }
  }
}

// // keyCode special keys
// // check http://keycode.info/ for all other keys
// // BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW
// // spacebar = 32
