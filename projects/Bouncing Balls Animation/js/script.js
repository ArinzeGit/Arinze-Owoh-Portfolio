window.onload = function init() {
  console.log("page loaded and DOM is ready");
  
  var canvas, ctx, w, h; 

  var ball1={
  x:400,
  y:400,
  radius:20,
  SpeedX:11,
  SpeedY:9,
  color:"green"
  },
  ball2={
  x:400,
  y:400,
  radius:40,
  SpeedX:8,
  SpeedY:1,
  color:"yellow"
  },
  ball3={
  x:400,
  y:400,
  radius:60,
  SpeedX:7,
  SpeedY:3,
  color:"blue"
  },
  ball4={
  x:400,
  y:400,
  radius:80,
  SpeedX:1,
  SpeedY:5,
  color:"purple"
  };

  ballLoop();

  function ballLoop(){
    canvas = document.querySelector("#ballCanvas");
    w = canvas.width; 
    h = canvas.height;
    ctx = canvas.getContext('2d');
    
    // clear the canvas i.e remove previous balls
    ctx.clearRect(0, 0, w, h);
    
    //draw current balls
    drawBall(ball4);drawBall(ball3);drawBall(ball2);drawBall(ball1);
    
    //determine next position of balls
    determineNextPosition(ball1);determineNextPosition(ball2);determineNextPosition(ball3);determineNextPosition(ball4);
    
    //test collisions with vertical and horizontal boundaries
    testCollision(ball1);testCollision(ball2);testCollision(ball3);testCollision(ball4);

    //request a new frame of animation in 1/60s
    requestAnimationFrame(ballLoop);
  }


  function drawBall(b){
    ctx.save();
    ctx.translate(b.x,b.y);
    ctx.fillStyle=b.color;
    ctx.beginPath();
    ctx.arc(0, 0,b.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
  }


  function determineNextPosition(b){
    b.x +=b.SpeedX;
    b.y += b.SpeedY;
  }
    

  function testCollision(b){
    //for horizontal boundaries:
    if((b.x + b.radius)> w){
      //return ball to collision point
      b.x =w-b.radius;
      // change the direction of movement on X plane
      b.SpeedX = -b.SpeedX;
    } else if((b.x-b.radius)<0){
      //return ball to collision point
      b.x =b.radius;
      // change the direction of movement on X plane
      b.SpeedX = -b.SpeedX;
    }

    //for vertical boundaries:
    if((b.y + b.radius)> h){
      //return ball to collision point
      b.y =h-b.radius;
      // change the direction of movement on Y plane
      b.SpeedY = -b.SpeedY;
    } else if((b.y-b.radius)<0){
      //return ball to collision point
      b.y =b.radius;
      // change the direction of movement on Y plane
      b.SpeedY = -b.SpeedY;
    }
  }


};