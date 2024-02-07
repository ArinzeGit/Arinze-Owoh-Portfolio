window.onload = function init() {
  console.log("page loaded and DOM is ready");
  
  let ctx, animationId; 
  let canvas = document.querySelector("#gameCanvas");
  let w = canvas.width; 
  let h = canvas.height;

  let ball={
    x:250,
    y:250,
    radius:20,
    speedX:7,
    speedY:3,
    color:"green"
  };

  let player1={
    x:0,
    y:0,
    height:150,
    width: 150,
    speed: 5,
    color: 'blue'
  };

  player1.y=(h-player1.height)/2;

  let player2={ 
    x:0,
    y:0,
    height:40,
    width: 300,
    speed: 5,
    color: 'purple'
  };

  player2.x=w-player2.width;
  player2.y=(h-player2.height)/2;

  function startBallLoop() {
    // Check if the animation loop is not already running
    if (!animationId) {
      ballLoop();
    }
  }

  function stopBallLoop() {
    // Check if the animation loop is running before attempting to stop it
    if (animationId) {
      cancelAnimationFrame(animationId);
      animationId = undefined; // Reset the variable to indicate that the loop is stopped
    }
  }

  function ballLoop(){
    
    ctx = canvas.getContext('2d');
    
    // clear the canvas i.e remove previous ball and players
    ctx.clearRect(0, 0, w, h);
    
    //draw current ball and players
    drawBall(ball); 
    drawPlayer(player1); 
    drawPlayer(player2);
    
    //determine next position of ball and players
    determineBallNextPosition(ball); 
    determinePlayerNextPosition(player1); 
    determinePlayerNextPosition(player2);
    
    //test collisions with canvas boundaries
    testBallBoundaries(ball); 
    testPlayerBoundaries(player1); 
    testPlayerBoundaries(player2);

    //test collision between ball and players
    testBallPlayerCollision(player1);
    testBallPlayerCollision(player2);


    //request a new frame of animation in 1/60s
    animationId=requestAnimationFrame(ballLoop);
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


 function drawPlayer(p){
    ctx.save();
    ctx.translate(p.x,p.y);
    ctx.fillStyle=p.color;
    ctx.fillRect(0, 0, p.width, p.height);
    ctx.restore();
  }


  function determineBallNextPosition(b){
    b.x +=b.speedX;
    b.y += b.speedY;
  }


  function determinePlayerNextPosition(p){
    if (p===player1){
      if (isWPressed) {
        console.log('W is pressed');
        p.y -= p.speed;
      }
      if (isSPressed) {
        console.log('S is pressed');
        p.y += p.speed;
      }
    } else if (p===player2){
      if (isArrowUpPressed) {
        console.log('Arrow Up is pressed');
        p.y -= p.speed;
      }
      if (isArrowDownPressed) {
        console.log('Arrow Down is pressed');
        p.y += p.speed;
      }
    }
  }



  function testBallBoundaries(b){
    //for horizontal boundaries:
    if((b.x + b.radius)> w){
      //return ball to collision point
      b.x =w-b.radius;
      // change the direction of movement on X plane
      b.speedX = -b.speedX;
    } else if((b.x-b.radius)<0){
      //return ball to collision point
      b.x =b.radius;
      // change the direction of movement on X plane
      b.speedX = -b.speedX;
    }

    //for vertical boundaries:
    if((b.y + b.radius)> h){
      //return ball to collision point
      b.y =h-b.radius;
      // change the direction of movement on Y plane
      b.speedY = -b.speedY;
    } else if((b.y-b.radius)<0){
      //return ball to collision point
      b.y =b.radius;
      // change the direction of movement on Y plane
      b.speedY = -b.speedY;
    }
  }


  function testPlayerBoundaries(p){
    if((p.y + p.height)> h){
      //return player to collision point
      p.y =h-p.height;
    } else if(p.y<0){
      //return player to collision point
      p.y =0;
    }
  }

 
  let isArrowUpPressed = false;
  let isArrowDownPressed = false;
  let isWPressed = false;
  let isSPressed = false;

  document.addEventListener('keydown', keydownHandler);
  document.addEventListener('keyup', keyupHandler);


  function keydownHandler(event) {
    if (event.key === 'ArrowUp') {
      isArrowUpPressed = true;
    } else if (event.key === 'ArrowDown') {
      isArrowDownPressed = true;
    } else if (event.key === 'w') {
      isWPressed = true;
    } else if (event.key === 's') {
      isSPressed = true;
    }
  }


  function keyupHandler(event) {
    if (event.key === 'ArrowUp') {
      isArrowUpPressed = false;
    } else if (event.key === 'ArrowDown') {
      isArrowDownPressed = false;
    } else if (event.key === 'w') {
      isWPressed = false;
    } else if (event.key === 's') {
      isSPressed = false;
    }
  }


  function testBallPlayerCollision(p){
    // Find the x and y coordinates of closest point to the circle within the rectangle
    let closestX = Math.max(p.x, Math.min(ball.x, p.x + p.width));
    let closestY = Math.max(p.y, Math.min(ball.y, p.y + p.height));

    // Calculate the distance between the circle's center and this closest point
    let distanceX = ball.x - closestX;
    let distanceY = ball.y - closestY;
    let distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // If the distance is less than the circle's radius, there is a collision(overlap)
    if(distanceSquared < (ball.radius * ball.radius)){

      //we then decide how to deflect/direct the ball depending on which side of the rectangle it hit
      //or which side it hit more on, in case it hit the vertex
      if(Math.abs(distanceX)<Math.abs(distanceY)){
        //it hit the vertex more on a horizontal side of the rectangle(or entirely on a horizontal side if distanceX is zero)
        if(distanceY>0){
          ball.y=p.y+p.height+ball.radius;
          ball.speedY=Math.abs(ball.speedY);//it hit bottom side so return ball to surface and direct ball down
        } else { 
          ball.y=p.y-ball.radius;
          ball.speedY=-Math.abs(ball.speedY); //it hit top side so return ball to surface and direct ball up
        }
      } else if(Math.abs(distanceX)>Math.abs(distanceY)){
        //it hit the vertex more on a vertical side of the rectangle(or entirely on a vertical side if distanceY is zero)
        if(distanceX>0){
          ball.x=p.x+p.width+ball.radius; 
          ball.speedX=Math.abs(ball.speedX); //it hit right side so return ball to surface and direct ball right 
        } else{
          ball.x=p.x-ball.radius;
          ball.speedX=-Math.abs(ball.speedX); //it hit left side so return ball to surface and direct ball left
        }
      } else {//i.e Math.abs(distanceX)=Math.abs(distanceY) 
        if(distanceX===0){ //as in |0|=|0| meaning the ball center has been forced by canvas top/bottom boundaries to be inside the player
          if(ball.y<0.5*h)ball.y=p.y-ball.radius;//it happened at a canvas top corner so force the ball to above player and crossing canvas boundary
          else ball.y=p.y+p.height+ball.radius;//it happened at a canvas bottom corner so force the ball to below player and crossing canvas boundary
        } else{//as in e.g |-3|=|+3| meaning it hit the vertex so evenly that the circle center and the rectangle's vertex form opposite vertices of a square
          if(distanceY>0&&distanceX>0){
            ball.speedY=Math.abs(ball.speedY); 
            ball.speedX=Math.abs(ball.speedX); //it hit bottomRight corner so move ball bottomRightWards
          } else if(distanceY>0&&distanceX<0){
            ball.speedY=Math.abs(ball.speedY); 
            ball.speedX=-Math.abs(ball.speedX); // ...bottomLeftWards
          } else if(distanceY<0&&distanceX>0){
            ball.speedY=-Math.abs(ball.speedY); 
            ball.speedX=Math.abs(ball.speedX); // ...topRightWards
          } else {
            ball.speedY=-Math.abs(ball.speedY); 
            ball.speedX=-Math.abs(ball.speedX); // ...topLeftWards
          }
        }
      }
    }
  }


  document.querySelector('#startButton').addEventListener('click',startBallLoop);
  document.querySelector('#pauseButton').addEventListener('click',stopBallLoop);

};