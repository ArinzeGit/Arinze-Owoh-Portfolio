window.onload = function init() {
  console.log("page loaded and DOM is ready");
  plot();
    monsterLoop();
    ballLoop();

};







var parameters = {
  target: '#myFunction',
  data: [{
    fn: 'sin(x)', 
    color:'green',
   range:[0,2*Math.PI],
    closed:true
 }],
  grid: true,
  yAxis: {domain: [-1, 1]},
  xAxis: {domain: [0, 2*Math.PI]},
  tip: {
      xLine: true,
      yLine: true
  },

};

function plot() {
  var f = document.querySelector("#function").value;
  var xMin = document.querySelector("#xMin").value;
  var xMax = document.querySelector("#xMax").value;
  var yMin = document.querySelector("#yMin").value;
  var yMax = document.querySelector("#yMax").value;
  var color = document.querySelector("#color").value;
  
  parameters.data[0].fn = f;
  parameters.xAxis.domain = [xMin, xMax];
  parameters.yAxis.domain = [yMin, yMax];
  parameters.data[0].color = color;
  parameters.data[0].range =[xMin, xMax];

  
  functionPlot(parameters);
}










var field, theDiv;

function showWhatWeTyped() {
 field = document.querySelector("#inputField");
  theDiv = document.querySelector("#theDiv");
 // fill the div with the content of the input field
  theDiv.innerHTML = field.value;
  theDiv.style.backgroundColor = 'grey';
}







// useful to have them as global variables
var canvas, ctx, w, h; 
var xMonster = 10;
var yMonster = 10;
var monsterSpeed = 1;




function monsterLoop() {
  canvas = document.querySelector("#monsterCanvas");
    w = canvas.width; 
    h = canvas.height;
    ctx = canvas.getContext('2d');
  // 1 - clear the canvas. We told you that w, and h will be useful!
  ctx.clearRect(0, 0, w, h);
  
  // 2 - draw the monster
  drawMyMonster(xMonster, yMonster);
  
  // 3 - move the monster
  xMonster += monsterSpeed;
  
  // 4 - test collisions with vertical boundaries
   if (((xMonster + 100)> w) || (xMonster < 0))  {
     // collision with left or right wall
    // change the direction of movement
    monsterSpeed = -monsterSpeed;
  }
  
  // 5 - request a new frame of animation in 1/60s
  requestAnimationFrame(monsterLoop);
}





function drawMyMonster(x, y) {
    // draw a big monster !
    // head
  
    // GOOD practice: save the context, use 2D trasnformations
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(x, y);
  
    // (0, 0) is the top left corner of the monster.
    ctx.strokeRect(0, 0, 100,100);
  
    // eyes, x=20, y=20 is relative to the top left corner
    // of the previous rectangle
    ctx.fillRect(20, 20, 10, 10);
    ctx.fillRect(65, 20, 10, 10);
  
    // nose
    ctx.strokeRect(45, 40, 10, 40);
  
    // mouth
    ctx.strokeRect(35, 84, 30, 10);
  
    // teeth
    ctx.fillRect(38, 84, 10, 10);
    ctx.fillRect(52, 84, 10, 10);
  
   // GOOD practice: restore the context
   ctx.restore();
}





var canvas2, ctx2, w2, h2; 
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


function ballLoop(){
 canvas2 = document.querySelector("#ballCanvas");
    w2 = canvas2.width; 
    h2 = canvas2.height;
    ctx2 = canvas2.getContext('2d');
  
  // 1 - clear the canvas i.e remove previous ball
  ctx2.clearRect(0, 0, w2, h2);
  
  // 2 - draw current ball
  drawBall(ball4);drawBall(ball3);drawBall(ball2);drawBall(ball1);
  
  // 3 - determine next position of ball
  determineNextPosition(ball1);determineNextPosition(ball2);determineNextPosition(ball3);determineNextPosition(ball4);
  
  // 4 - test collisions with vertical and horizontal boundaries
  testCollision(ball1);testCollision(ball2);testCollision(ball3);testCollision(ball4);

 
  
  // 5 - request a new frame of animation in 1/60s
  requestAnimationFrame(ballLoop);
}





function drawBall(b){
  ctx2.save();
  ctx2.translate(b.x,b.y);
  ctx2.fillStyle=b.color;
  ctx2.beginPath();
    ctx2.arc(0, 0,b.radius, 0, 2*Math.PI);
    ctx2.fill();
    ctx2.restore();
}



function determineNextPosition(b){
  b.x +=b.SpeedX;
  b.y += b.SpeedY;
}
  




  function testCollision(b){
     //for horizontal boundaries:
   if((b.x + b.radius)> w2){
    //return ball to collision point
    b.x =w2-b.radius;
    // change the direction of movement on X plane
    b.SpeedX = -b.SpeedX;
    } else if((b.x-b.radius)<0){
//return ball to collision point
    b.x =b.radius;
    // change the direction of movement on X plane
    b.SpeedX = -b.SpeedX;
    }

 //for vertical boundaries:
   if((b.y + b.radius)> h2){
    //return ball to collision point
    b.y =h2-b.radius;
    // change the direction of movement on Y plane
    b.SpeedY = -b.SpeedY;
    } else if((b.y-b.radius)<0){
//return ball to collision point
    b.y =b.radius;
    // change the direction of movement on Y plane
    b.SpeedY = -b.SpeedY;
    }
  }