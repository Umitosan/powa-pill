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
var myPac = new pac(50,MHEIGHT / 2,5,30);  // pac(someX,someY,someSpeed,someWidth)
var pacDirection = 'right';
var lastKey = 'none';  // last pressed key

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
  myPac.render();
  myPac.slide(pacDirection);
}

function keyPressed() {
  lastKey = keyCode;
  if (keyCode === LEFT_ARROW) {
    pacDirection = 'left';
  } else if (keyCode === RIGHT_ARROW) {
    pacDirection = 'right';
  } else if (keyCode === UP_ARROW) {
    pacDirection = 'up';
  } else if (keyCode === DOWN_ARROW) {
    pacDirection = 'down';
  } else {
    // do nothing
  }
}

function pac(someX,someY,someSpeed,someWidth) {
  this.x1 = someX;
  this.y1 = someY;
  this.speed1 = someSpeed;
  this.diameter = someWidth;
  this.radius = someWidth / 2;
  this.mouthFactor = 1;

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

  // collision detection
  this.checkBounds = function() {
    if (this.x1 - this.radius < 10) {  // check left
      pacDirection = 'right';
    } else if (this.x1 + this.radius > MWIDTH-10) { // check right
      pacDirection = 'left';
    } else if (this.y1 + this.radius > MHEIGHT-10) {  // check down
      pacDirection = 'up';
    } else if (this.y1 - this.radius < 10) { // check up
      pacDirection = 'down';
    } else {
      // in bounds
    }
  }

  // determine amount of mouth to close base on frame timing
  this.nextMouth = function() {
    if (frameCount % 10 == 0) {
      if ( this.mouthFactor > 1.4) {
        this.mouthFactor = 1;
      } else {
        this.mouthFactor += 0.1;
      }
    }
  }

  this.render = function() {
    var r = this.diameter / 4 + 3;
    var mouthFact = this.mouthFactor;
    // arc(x,y,width,height,start,stop,[mode])
    // ellipse(x,y,height,width)
    fill('yellow');
    switch ( pacDirection )  {
      case 'left':
        arc(this.x1, this.y1, this.diameter, this.diameter, (-(2*PI)/3)*mouthFact, ((2*PI)/3)*mouthFact, PIE);  break;
      case 'right':
        push();
        translate(this.x1, this.y1);  // new center of drawing map is center of pacman
        rotate( PI );
        arc(0, 0, this.diameter, this.diameter, (-(2*PI)/3)*mouthFact, ((2*PI)/3)*mouthFact, PIE);  break;
        pop();
      case 'up':
        push();
        translate(this.x1, this.y1);  // new center of drawing map is center of pacman
        rotate( PI/2 );
        arc(0, 0, this.diameter, this.diameter, (-(2*PI)/3)*mouthFact, ((2*PI)/3)*mouthFact, PIE);  break;
        pop();
      case 'down':
        push();
        translate(this.x1, this.y1);  // new center of drawing map is center of pacman
        rotate( 3*PI/2 );
        arc(0, 0, this.diameter, this.diameter, (-(2*PI)/3)*mouthFact, ((2*PI)/3)*mouthFact, PIE);  break;
        pop();
      default: console.log("switch broke"); break;
    } // end switch
    // open mouth more
    this.nextMouth();
  } // end render function
}



// keyCode special keys
// check http://keycode.info/ for all other keys
// BACKSPACE, DELETE, ENTER, RETURN, TAB, ESCAPE, SHIFT, CONTROL, OPTION, ALT, UP_ARROW, DOWN_ARROW, LEFT_ARROW, RIGHT_ARROW
// spacebar = 32

// ARC
// arc(a,b,c,d,start,stop,[mode])
// Parameters
// a	Number: x-coordinate of the arc's ellipse
// b	Number: y-coordinate of the arc's ellipse
// c	Number: width of the arc's ellipse by default
// d	Number: height of the arc's ellipse by default
// start	Number: angle to start the arc, specified in radians
// stop	Number: angle to stop the arc, specified in radians
// mode	Constant: optional parameter to determine the way of drawing the arc. either CHORD or PIE


// Constants
// HALF_PI
// PI
// QUARTER_PI
// TAU
// TWO_PI
