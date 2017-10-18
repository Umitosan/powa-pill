// Order of loading
// In global mode (non-instance mode), the order of page loading is as follows:
//
// window onload event fires.
// preload() is called (if included in the sketch), p5 waits for all loading functions within it to complete.
// setup() is called (if included in the sketch). Note that p5 will not wait to go onto draw if there are loading methods in setup().
// draw() is called (if included in the sketch). It continues to be called based on variables set by noLoop()/loop() and frameRate().

// window.innerWidth,
// window.innerHeight

// COLORS
// pac yellow = #FFFF01

const MWIDTH = 800;
const MHEIGHT = 400;
var myPac = new pac(50,MHEIGHT / 2,5,30,'right','go');  // pac(someX,someY,someSpeed,someWidth,faceDirection,moveState)
var lastKey = 'none';  // last pressed key

function setup() {
  // createCanvas(w,h,[renderer])
  // move the canvas to be inside a parent element div
  createCanvas(MWIDTH, MHEIGHT, P2D).parent('sketch-holder-div');
  frameRate(60);
  background(0);
  textSize(20);
}

//   MAIN LOOP
function draw() {
  background('black');
  fill('#FFFF01');
  textAlign(LEFT)
  text('frame: ' + frameCount, 4, 24);   // draw framecount in upper left corner
  textAlign(RIGHT)
  text("keycode: " + lastKey,MWIDTH-4,24)
  if ( (myPac.moveState === 'go') && (myPac.inBounds() === true) ) {
    myPac.slide();
    myPac.nextMouth();
  }
  myPac.render();
} //   END MAIN LOOP


function keyPressed() {
  lastKey = keyCode;
  if (keyCode === LEFT_ARROW) {
    myPac.direction = 'left';
    myPac.moveState = 'go';
  } else if (keyCode === RIGHT_ARROW) {
    myPac.direction = 'right';
    myPac.moveState = 'go';
  } else if (keyCode === UP_ARROW) {
    myPac.direction = 'up';
    myPac.moveState = 'go';
  } else if (keyCode === DOWN_ARROW) {
    myPac.direction = 'down';
    myPac.moveState = 'go';
  } else {
    // do nothing
  }
}

function pac(someX,someY,someSpeed,someWidth,faceDirection,moveState) {
  this.x1 = someX;
  this.y1 = someY;
  this.speed1 = someSpeed;
  this.diameter = someWidth;
  this.radius = someWidth / 2;
  this.mouthSize = 1;
  this.mouthVelocity = 0.02;
  this.direction = faceDirection;
  this.moveState = moveState;

  // move pac in facing direction
  this.slide = function() {
    if (this.direction === 'left') {
      this.x1 -= this.speed1;
    } else if (this.direction === 'right') {
      this.x1 += this.speed1;
    } else if (this.direction === 'up') {
      this.y1 -= this.speed1;
    } else if (this.direction === 'down') {
      this.y1 += this.speed1;
    } else {
      console.log(' slide problems ');
    }
  }

  // is pac in bounds? (true/false)
  this.inBounds = function() {
    var bounds;
    if ( (this.x1 - this.radius < 6) && (this.direction === 'left') ) {  // check left
      bounds = false;
    } else if ( (this.x1 + this.radius > MWIDTH-6) && (this.direction === 'right') ) { // check right
      bounds = false;
    } else if ( (this.y1 + this.radius > MHEIGHT-6) && (this.direction === 'down') ) {  // check down
      bounds = false;
    } else if ( (this.y1 - this.radius < 6) && (this.direction === 'up') ) { // check up
      bounds = false;
    } else {
      bounds = true;
    }
    return bounds;
  }

  // determine amount of mouth to close base on frame timing
  this.nextMouth = function() {
    if ( this.mouthSize > 1.46 ) {
      this.mouthVelocity = -0.04;
    } else if ( this.mouthSize <= 1.00 ) {
      this.mouthVelocity = 0.06;
    } else {
      // do nothing?
    }
    this.mouthSize += this.mouthVelocity;
  }

  this.render = function() {
    var r = this.diameter / 4 + 3;
    // arc(x,y,width,height,start,stop,[mode])
    // ellipse(x,y,height,width)
    fill('#FFFF01');
    switch ( this.direction )  {
      case 'left':
        arc(this.x1, this.y1, this.diameter, this.diameter, (-(2*PI)/3)*this.mouthSize, ((2*PI)/3)*this.mouthSize, PIE);  break;
      case 'right':
        push();
        translate(this.x1, this.y1);  // new center of drawing map is center of pacman
        rotate( PI );
        arc(0, 0, this.diameter, this.diameter, (-(2*PI)/3)*this.mouthSize, ((2*PI)/3)*this.mouthSize, PIE);  break;
        pop();
      case 'up':
        push();
        translate(this.x1, this.y1);  // new center of drawing map is center of pacman
        rotate( PI/2 );
        arc(0, 0, this.diameter, this.diameter, (-(2*PI)/3)*this.mouthSize, ((2*PI)/3)*this.mouthSize, PIE);  break;
        pop();
      case 'down':
        push();
        translate(this.x1, this.y1);  // new center of drawing map is center of pacman
        rotate( 3*PI/2 );
        arc(0, 0, this.diameter, this.diameter, (-(2*PI)/3)*this.mouthSize, ((2*PI)/3)*this.mouthSize, PIE);  break;
        pop();
      case 'stop':
        push();
        translate(this.x1, this.y1);  // new center of drawing map is center of pacman
        rotate( 3*PI/2 );
        arc(0, 0, this.diameter, this.diameter, (-(2*PI)/3)*this.mouthSize, ((2*PI)/3)*this.mouthSize, PIE);  break;
        pop();
      default: console.log("switch broke"); break;
    } // end switch
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
