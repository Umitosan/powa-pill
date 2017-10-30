// Order of loading
// In global mode (non-instance mode), the order of page loading is as follows:
//
// window onload event fires.
// preload() is called (if included in the sketch), p5 waits for all loading functions within it to complete.
// setup() is called (if included in the sketch). Note that p5 will not wait to go onto draw if there are loading methods in setup().
// draw() is called (if included in the sketch). It continues to be called based on variables set by noLoop()/loop() and frameRate().

// original 1980s dimentions
// 26-28 tiles wide 26 dots fit 28 tiles with edge
// 29-31 tiles tall 29 dots fit 31 tiles with edge

// window.innerWidth,
// window.innerHeight

// COLORS
// pac yellow = #FFFF01

// sample level image
//http://samentries.com/wp-content/uploads/2015/10/PacmanLevel-1.png

  var MWIDTH = 702;
  var MHEIGHT = 777;
  var TILESIZE = 25;
  var myPac = new Pac(50,MHEIGHT / 2,5,42,'right','go');  // pac(someX,someY,someSpeed,someWidth,faceDirection,moveState)
  var myLevel = new Level();
  var lastKey = 'none';  // last pressed key
  var debugOn = false; // this sate will show the tile grid framecount and other debugging info in realtime
  var testImg;

  // Called directly before setup(), the preload() function is used to handle asynchronous loading of external files. If a preload function is defined, setup() will wait until any load calls within have finished. Nothing besides load calls should be inside preload (loadImage, loadJSON, loadFont, loadStrings, etc).
  function preload() {  // preload runs once before setup
    testImg = loadImage(
      "img/bricks.png",
      console.log("imageload success"),
      console.log("imageload failure")
    );
  }

  function setup() {  // setup waits for preload to complete
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
    textSize(10);
    if (debugOn === true) {
      showGrid(TILESIZE);
      myLevel.render();
      textSize(20);
      fill('#FFFF01');
      stroke('black'); // stroke(color,[alpha])
      textAlign(LEFT);
      text('frame: ' + frameCount, 4, 24);   // draw framecount in upper left corner
      textAlign(RIGHT);
      text("keycode: " + lastKey,MWIDTH-4,24);
    }
    if ( (myPac.moveState === 'go') && (myPac.inBounds() === true) ) {
      myPac.slide();
      myPac.nextMouth();
    }
    stroke('#FFFF01');
    fill('#FFFF01');
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
    } else if (keyCode === 32) { // spacebar = 32
      myPac.moveState = 'stop';
    } else if (keyCode === 80) { // P = 80
      // pause
      myLevel.buildLevel();
    } else if (keyCode === 71) { // G = 71
      toggleGrid();
    } else {
      // do nothing
    }
  }

  function showGrid(tileWidth) {
    var ii = 0;
    var jj = 0;
    for (i=0; i<=MWIDTH ; i+=tileWidth) {
      stroke('green');
      line(i, 0, i, MHEIGHT);
      stroke('black');
      // text(ii, i-10, tileWidth*1.6);
      ii += 1;
    }
    for (i=0; i<=MHEIGHT ; i+=tileWidth) {
      stroke('green');
      line(0, i, MWIDTH, i);
      stroke('black');
      // text(jj, tileWidth*1.6, i-10);
      jj += 1;
    }
  }

  function toggleGrid() {
    console.log("toggle grid");
    if (debugOn === true) {
      debugOn = false;
    } else if (debugOn === false) {
      debugOn = true;
    } else {
      // nothing
    }
  }

  function Pac(someX,someY,someSpeed,someWidth,faceDirection,moveState) {
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

  function Tile(someType) {
    this.type = type;
    this.img;

  }

  function Level() {

    var layout = [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'p',0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,'p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,'p',0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,'p',0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ];

    this.tileArr = layout;

    this.buildLevel = function() {
      console.log("building lvl");

    }

    // simply draw the char in array
    // this.render = function() {
    //   for (var i=0; i<this.tileArr.length; i++) {
    //     for (var j=0; j<this.tileArr[i].length; j++) {
    //       arc(10*TILESIZE, 10*TILESIZE, 30, 30, 180, PIE);
    //       text(this.tileArr[i][j], j*TILESIZE+TILESIZE, i*TILESIZE+TILESIZE);
    //     }
    //   }
    // }
    this.render = function() {

    }
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
