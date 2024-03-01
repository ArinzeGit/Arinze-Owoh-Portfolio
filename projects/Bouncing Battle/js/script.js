window.onload = function init() {
  console.log("page loaded and DOM is ready");
  
  const gameOverSound = document.querySelector('#gameOverSound');
  const obstacleSound = document.querySelector('#obstacleSound');
  const powerUpSound = document.querySelector('#powerUpSound');
  const player1Sound = document.querySelector('#player1Sound');
  const player2Sound = document.querySelector('#player2Sound');
  const missSound = document.querySelector('#missSound');
  const backgroundMusic = document.querySelector('#backgroundMusic');
  let canvas = document.querySelector("#gameCanvas");
  let ctx, animationId;
  let w = canvas.width; 
  let h = canvas.height;
  let distanceX, distanceY;
  let isArrowUpPressed = false;
  let isArrowDownPressed = false;
  let isWPressed = false;
  let isSPressed = false;
  let didPlayer1Hit=true;
  let didPlayer2Hit=true;
  let player1Score=0;
  let player2Score=0;
  let isP1LastHitter=false;
  let isP2LastHitter=false;
  let hitCount=0;
  let paddle1ColorSelector=document.querySelector('#paddle1ColorSelector');
  paddle1ColorSelector.addEventListener('change',function(){
    player1.color=paddle1ColorSelector.value;
    document.querySelectorAll('.p1Color').forEach(element =>{
      element.style.color=paddle1ColorSelector.value;
    });
  });
  let paddle2ColorSelector=document.querySelector('#paddle2ColorSelector');
  paddle2ColorSelector.addEventListener('change',function(){
    player2.color=paddle2ColorSelector.value;
    document.querySelectorAll('.p2Color').forEach(element => {
      element.style.color=paddle2ColorSelector.value;
    });
  });
  let ball={
    x:45,
    y:250,
    speedX:5,
    speedY:0,
    radius:10,
    color:"black"
  };
  let player1={
    x:0,
    y:0,
    speed: 5,
    height:100,
    width: 35,
    color: 'mediumseagreen'
  };
  player1.y=(h-player1.height)/2;
  let player2={ 
    x:0,
    y:0,
    speed: 5,
    height:100,
    width: 35,
    color: 'orange'
  };
  player2.x=w-player2.width;
  player2.y=(h-player2.height)/2;
  let obstacle={
    x:(w-30)/2,
    y:-30,
    speed:5,
    angle:0,
    angularSpeed:0.001*Math.PI,
    size:30,
    color: 'red'
  };
  let powerUp={
    x:w/2,
    y:-940,//carefully chosen spot such that the powerUp will pass twice untouched by the ball of speed (5,0) if obstacles haven't randomised the game yet
    speed:3,
    radius:45,
    color1:"green",
    color2:"pink"
  };


  document.addEventListener('keydown', keydownHandler);


  function keydownHandler(event) {
    if (event.key === 'ArrowUp') {
      event.preventDefault(); //prevent default scrolling
      isArrowUpPressed = true;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); //prevent default scrolling
      isArrowDownPressed = true;
    } else if (event.key === 'w') {
      isWPressed = true;
    } else if (event.key === 's') {
      isSPressed = true;
    }
  }


  document.addEventListener('keyup', keyupHandler);
  

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


  document.querySelector('#playPauseButton').addEventListener('click',startStopBallLoop);


  function startStopBallLoop() {
    if (!animationId) { //if the animation frame is not already running, call ballLoop
      ballLoop();
      playBackgroundMusic();
    } else { //if the animation frame is running, cancel it 
      cancelAnimationFrame(animationId);
      animationId = undefined; // Reset the variable to indicate that the loop is stopped
      backgroundMusic.pause();
    }
  }


  function playBackgroundMusic(){
    if((player1Score!==10)&&(player2Score!==10)){
      backgroundMusic.play();
    }
  }

  function ballLoop(){
    ctx = canvas.getContext('2d');
    
    if((player1Score===10)||(player2Score===10)){//loop gets cancelled when called if someone is on 10
      cancelAnimationFrame(animationId);
      animationId = undefined; // Reset the variable to indicate that the loop is stopped
    }else{
      // clear the canvas i.e remove previous ball and players
      ctx.clearRect(0, 0, w, h);
      
      //draw current ball, players, obstacle
      drawBall(ball); 
      drawPlayer(player1); 
      drawPlayer(player2);
      drawObstacle(obstacle);
      drawPowerUp(powerUp);
      
      //determine next position of ball, players, obstacle
      determineBallNextPosition(ball); 
      determinePlayerNextPosition(player1); 
      determinePlayerNextPosition(player2);
      determineObstacleNextPosition(obstacle);
      determinePowerUpNextPosition(powerUp);
      
      //handlers for canvas boundaries
      handleBallBoundaries(ball); 
      handlePlayerBoundaries(player1); 
      handlePlayerBoundaries(player2);
      handleObstacleBoundaries(obstacle);
      handlePowerUpBoundaries(powerUp);

      //check if a player hit or missed the ball (to update scores and know who claims powerUp)
      hitMissChecker();

      //handle collision between ball and players
      handleBallPlayerCollision(ball,player1);
      handleBallPlayerCollision(ball,player2);

      //handle collision between ball and Obstacle
      handleBallObstacleCollision();

      //handle collision between ball and powerUp
      handleBallPowerUpCollision(ball,powerUp);

      //request a new frame of animation in 1/60s
      animationId=requestAnimationFrame(ballLoop);
    }
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


  function drawObstacle(ob){
    ctx.save();
    ctx.translate(ob.x+ob.size/2,ob.y+ob.size/2);
    ctx.rotate(ob.angle);
    ctx.fillStyle=ob.color;
    ctx.fillRect(-ob.size/2, -ob.size/2, ob.size, ob.size);
    ctx.fillStyle='black';
    ctx.fillRect(-ob.size*7/16, -ob.size*7/16, ob.size*7/8, ob.size*7/8);
    ctx.fillStyle=ob.color;
    ctx.fillRect(-ob.size*5/16, -ob.size*5/16, ob.size*5/8, ob.size*5/8);
    ctx.fillStyle='white';
    ctx.fillRect(-ob.size/4, -ob.size/4, ob.size/2, ob.size/2);
    ctx.restore();
    ctx.save();
    ctx.translate(ob.x+ob.size/2,ob.y+ob.size/2);
    ctx.fillStyle='black';
    ctx.beginPath();
    ctx.arc(0, 0,ob.size/4, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle=ob.color;
    ctx.fillRect(-Math.sqrt(2)*ob.size/16, -Math.sqrt(2)*ob.size/16, Math.sqrt(2)*ob.size/8, Math.sqrt(2)*ob.size/8);
    ctx.restore();
  }


  function drawPowerUp(u){
    ctx.save();
    ctx.translate(u.x,u.y);
    ctx.fillStyle=u.color1;
    ctx.beginPath();
    ctx.arc(0, 0,u.radius, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle=u.color2;
    ctx.beginPath();
    ctx.arc(0, 0,u.radius*2/3, 0, 2*Math.PI);
    ctx.fill();
    ctx.fillStyle=u.color1;
    ctx.beginPath();
    ctx.arc(0, 0,u.radius*1/3, 0, 2*Math.PI);
    ctx.fill();
    ctx.restore();
  }


  function determineBallNextPosition(b){
    b.x +=b.speedX;
    b.y += b.speedY;
  }


  function determinePlayerNextPosition(p){
    if (p===player1){
      if (isWPressed) {
        //console.log('W is pressed');
        p.y -= p.speed;
      }
      if (isSPressed) {
        //console.log('S is pressed');
        p.y += p.speed;
      }
    } else if (p===player2){
      if (isArrowUpPressed) {
        //console.log('Arrow Up is pressed');
        p.y -= p.speed;
      }
      if (isArrowDownPressed) {
        //console.log('Arrow Down is pressed');
        p.y += p.speed;
      }
    }
  }


  function determineObstacleNextPosition(ob){
    ob.y+=ob.speed;
    ob.angle+=ob.angularSpeed;
  }


  function determinePowerUpNextPosition(u){
    u.y +=u.speed;
  }


  function handleBallBoundaries(b){
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


  function handlePlayerBoundaries(p){
    if((p.y + p.height)> h){
      //return player to collision point
      p.y =h-p.height;
    } else if(p.y<0){
      //return player to collision point
      p.y =0;
    }
  }


  function handleObstacleBoundaries(ob){
    if(ob.y>h+1.21*ob.size){ // the obstacle just went out of sight
      ob.size=30+120*Math.random(); //randomize the size from 30 to 150
      ob.speed=1+4*Math.random(); //randomize the speed from 1 to 5
      ob.angularSpeed=Math.PI*(0.001+0.009*Math.random()); //randomize the angular speed from 0.001Pi to 0.01Pi
      ob.x=(w-ob.size)/2; //centralize the obstacle
      ob.y=-ob.size; //send it in from the top
    }
  }


  function handlePowerUpBoundaries(u){
    if(u.y>h+u.radius){ // the powerUp just went out of sight
      u.y=-u.radius; //send it in from the top
    }
  }


  function hitMissChecker(){
    if((ball.x<60)&&(ball.x>45)&&(ball.speedX===-Math.abs(ball.speedX))){//ball close to and heading towards player1
      didPlayer1Hit=false;
    }else if ((ball.x>440)&&(ball.x<455)&&(ball.speedX===Math.abs(ball.speedX))){//ball close to and heading towards player2
      didPlayer2Hit=false;
    }
    if(overlap(ball,player1)){ // a hit!
      didPlayer1Hit=true;
      isP1LastHitter=true;
      isP2LastHitter=false;
      accelerateBall();
      playPlayer1Sound();
    } else if (overlap(ball,player2)){ // a hit!
      didPlayer2Hit=true;
      isP1LastHitter=false;
      isP2LastHitter=true;
      accelerateBall();
      playPlayer2Sound();
    }
    if((ball.x>60)&&(ball.speedX===Math.abs(ball.speedX))&&(didPlayer1Hit===false)){//ball going away from player1 without contact (a miss!)
      player2Score+=1;
      updateScore();
      didPlayer1Hit=true;//reset to avoid detecting the miss continously
      deccelerateBall();
      playMissSound();
    } else if ((ball.x<440)&&(ball.speedX===-Math.abs(ball.speedX))&&(didPlayer2Hit===false)){//ball going away from player2 without contact (a miss!)
      player1Score+=1;
      updateScore();
      didPlayer2Hit=true;//reset to avoid detecting the miss continously
      deccelerateBall();
      playMissSound();
    }
  }


  function overlap(b,p){
    // Find the x and y coordinates of closest point to the circle within the rectangle
    let closestX = Math.max(p.x, Math.min(b.x, p.x + p.width));
    let closestY = Math.max(p.y, Math.min(b.y, p.y + p.height));

    // Calculate the distance between the circle's center and this closest point
    distanceX = b.x - closestX;
    distanceY = b.y - closestY;
    let distanceSquared = distanceX * distanceX + distanceY * distanceY;

    // If the distance is less than the circle's radius, there is a collision(overlap)
    return(distanceSquared < (b.radius * b.radius));
  }


  function accelerateBall(){
    hitCount+=1;
    if((hitCount%10===0)&&(hitCount<=50)){ //at every 10 hits we accelerate, and stop after 5 times of accelerating
      ball.speedX*=1.1;//This line and the next jointly multiply the resultant speed by 1.1
      ball.speedY*=1.1;
    }
  }


  function deccelerateBall(){
    ball.speedX*=5/Math.sqrt(ball.speedX**2+ball.speedY**2);//This line and the next jointly restore the resultant speed to 5
    ball.speedY*=5/Math.sqrt(ball.speedX**2+ball.speedY**2);
    hitCount=0; //resets the acceleration count
  }


  function playPlayer1Sound(){
    player1Sound.currentTime = 0;
    player1Sound.play();
  }


  function playPlayer2Sound(){
    player2Sound.currentTime = 0;
    player2Sound.play();
  }


  function playMissSound(){
    if((player1Score!==10)&&(player2Score!==10)){
      missSound.currentTime = 0;
      missSound.play();
    }
  }


  function updateScore(){
    document.querySelector('#player1Score').innerHTML=player1Score;
    document.querySelector('#player2Score').innerHTML=player2Score;
    if(player1Score===10){
      document.querySelector('#winStatus1').innerHTML='Game Over<br>YOU WIN';
      document.querySelector('#winStatus2').innerHTML='Game Over<br>YOU LOSE';
      backgroundMusic.pause();
      playGameOverSound();
    } else if(player2Score===10){
      document.querySelector('#winStatus1').innerHTML='Game Over<br>YOU LOSE';
      document.querySelector('#winStatus2').innerHTML='Game Over<br>YOU WIN';
      backgroundMusic.pause();
      playGameOverSound();
    }
  }


  function playGameOverSound(){
    gameOverSound.currentTime = 0;
    gameOverSound.play();
  }
 

  function handleBallPlayerCollision(b,p){
    if(overlap(b,p)){

      //we then decide how to deflect/direct the ball depending on which side of the rectangle it hit
      //or which side it hit more on, in case it hit the vertex
      if(Math.abs(distanceX)<Math.abs(distanceY)){
        //it hit the vertex more on a horizontal side of the rectangle(or entirely on a horizontal side if distanceX is zero)
        if(distanceY>0){
          b.y=p.y+p.height+b.radius;
          b.speedY=Math.abs(b.speedY);//it hit bottom side so return ball to surface and direct ball down
        } else { 
          b.y=p.y-b.radius;
          b.speedY=-Math.abs(b.speedY); //it hit top side so return ball to surface and direct ball up
        }
      } else if(Math.abs(distanceX)>Math.abs(distanceY)){
        //it hit the vertex more on a vertical side of the rectangle(or entirely on a vertical side if distanceY is zero)
        if(distanceX>0){
          b.x=p.x+p.width+b.radius; 
          b.speedX=Math.abs(b.speedX); //it hit right side so return ball to surface and direct ball right 
        } else{
          b.x=p.x-b.radius;
          b.speedX=-Math.abs(b.speedX); //it hit left side so return ball to surface and direct ball left
        }
      } else {//i.e Math.abs(distanceX)=Math.abs(distanceY) 
        if(distanceX===0){ //as in |0|=|0| meaning the ball center has been forced by canvas top/bottom boundaries to be inside the player
          if(b.y<0.5*h)b.y=p.y-b.radius;//it happened at a canvas top corner so force the ball to above player and crossing canvas boundary
          else b.y=p.y+p.height+b.radius;//it happened at a canvas bottom corner so force the ball to below player and crossing canvas boundary
        } else{//as in e.g |-3|=|+3| meaning it hit the vertex so evenly that the circle center and the rectangle's vertex form opposite vertices of a square
          if(distanceY>0&&distanceX>0){
            b.speedY=Math.abs(b.speedY); 
            b.speedX=Math.abs(b.speedX); //it hit bottomRight corner so move ball bottomRightWards
          } else if(distanceY>0&&distanceX<0){
            b.speedY=Math.abs(b.speedY); 
            b.speedX=-Math.abs(b.speedX); // ...bottomLeftWards
          } else if(distanceY<0&&distanceX>0){
            b.speedY=-Math.abs(b.speedY); 
            b.speedX=Math.abs(b.speedX); // ...topRightWards
          } else {
            b.speedY=-Math.abs(b.speedY); 
            b.speedX=-Math.abs(b.speedX); // ...topLeftWards
          }
        }
      }
    }
  }

  
  function handleBallObstacleCollision(){
    let rotatedBall={}; //we create this anti-ball to coincide(or not) with obstacle unrotated rectangle
    //because if this anti-rotated ball coincides with obstacle unrotated rectangle, then actual ball coincides with actual (rotated) obstacle 
    rotatedBall.x=rotateAnticlockwiseAroundCenter(ball.x, ball.y,obstacle.x+obstacle.size/2,obstacle.y+obstacle.size/2, obstacle.angle).x;
    rotatedBall.y=rotateAnticlockwiseAroundCenter(ball.x, ball.y,obstacle.x+obstacle.size/2,obstacle.y+obstacle.size/2, obstacle.angle).y;
    rotatedBall.speedX=rotateAnticlockwiseAroundCenter(ball.speedX, ball.speedY,0,0, obstacle.angle).x;//speeds are not points but vectors so rotate about
    rotatedBall.speedY=rotateAnticlockwiseAroundCenter(ball.speedX, ball.speedY,0,0, obstacle.angle).y; //origin to preserve magnitude change direction
    rotatedBall.radius=ball.radius;
    obstacle.height=obstacle.size;// we explicitely give the square obstacle, height and width properties so we can handle collision like it was a player
    obstacle.width=obstacle.size;
    if (overlap(rotatedBall,obstacle)){
      playObstacleSound();
    }
    handleBallPlayerCollision(rotatedBall,obstacle); //after this function has made necessary alterations to anti-ball, we convert to our real ball
    ball.x=rotateClockwiseAroundCenter(rotatedBall.x, rotatedBall.y,obstacle.x+obstacle.size/2,obstacle.y+obstacle.size/2, obstacle.angle).x;
    ball.y=rotateClockwiseAroundCenter(rotatedBall.x, rotatedBall.y,obstacle.x+obstacle.size/2,obstacle.y+obstacle.size/2, obstacle.angle).y;
    ball.speedX=rotateClockwiseAroundCenter(rotatedBall.speedX, rotatedBall.speedY,0,0, obstacle.angle).x;
    ball.speedY=rotateClockwiseAroundCenter(rotatedBall.speedX, rotatedBall.speedY,0,0, obstacle.angle).y;
  }


  function playObstacleSound(){
    obstacleSound.currentTime = 0;
    obstacleSound.play();
  }


  function rotateClockwiseAroundCenter(x, y, cx, cy, angleInRadians){ //This is Anticlockwise for cartesian cuz HTML canvas y-axis is flipped
    // Translate to the origin
    let translatedX = x - cx;
    let translatedY = y - cy;
    // Rotate around the origin
    let rotatedX = translatedX * Math.cos(angleInRadians) - translatedY * Math.sin(angleInRadians);
    let rotatedY = translatedX * Math.sin(angleInRadians) + translatedY * Math.cos(angleInRadians);
    // Translate back to the original position
    let finalX = rotatedX + cx;
    let finalY = rotatedY + cy;
    return { x: finalX, y: finalY };
  }


  function rotateAnticlockwiseAroundCenter(x, y, cx, cy, angleInRadians){ //This is Clockwise for cartesian cuz HTML canvas y-axis is flipped
    // Translate to the origin
    let translatedX = x - cx;
    let translatedY = y - cy;
    // Rotate around the origin
    let rotatedX = translatedX * Math.cos(angleInRadians) + translatedY * Math.sin(angleInRadians);
    let rotatedY = -translatedX * Math.sin(angleInRadians) + translatedY * Math.cos(angleInRadians);
    // Translate back to the original position
    let finalX = rotatedX + cx;
    let finalY = rotatedY + cy;
    return { x: finalX, y: finalY };
  }
  

  function handleBallPowerUpCollision(b,u){
    if((b.x-u.x)**2+(b.y-u.y)**2<(b.radius+u.radius)**2){ //there is ball powerUp collision
      playPowerUpSound();
      u.y=-u.radius; //take powerUp out just above the canvas
      u.speed=0; //and make it stationary
      if(isP1LastHitter){
        player1.height*=2; //double paddle size
        player1.y-=player1.height/4; //centralize paddle
        setTimeout(()=>{ //wait 10 seconds
          player1.height/=2; //restore paddle size
          player1.y+=player1.height/2; //centralize paddle
          u.speed=3; //and let powerUp start falling again
        },10000);
      }else if(isP2LastHitter){
        player2.height*=2; //double paddle size
        player2.y-=player2.height/4; //centralize paddle
        setTimeout(()=>{ //wait 10 seconds
          player2.height/=2; //restore paddle size
          player2.y+=player2.height/2; //centralize paddle
          u.speed=3; //and let powerUp start falling again
        },10000);
      }else{ //neither of the players has hit the ball
        setTimeout(()=>{
          u.speed=3; //let powerUp start falling again after 10 seconds
        },10000);
      }

    }
  }


  function playPowerUpSound(){
    powerUpSound.currentTime = 0;
    powerUpSound.play();
  }

};