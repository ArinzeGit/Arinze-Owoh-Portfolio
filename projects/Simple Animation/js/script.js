window.onload = function init() {
  console.log("page loaded and DOM is ready");
  monsterLoop();

  // good to have them as global variables
  var canvas, ctx, w, h; 
  var xMonster = 10;
  var yMonster = 10;
  var monsterSpeed = 1;


  function monsterLoop() {
    canvas = document.querySelector("#monsterCanvas");
    w = canvas.width; 
    h = canvas.height;
    ctx = canvas.getContext('2d');
    //clear the canvas.
    ctx.clearRect(0, 0, w, h);
    
    //draw the monster
    drawMyMonster(xMonster, yMonster);
    
    //move the monster
    xMonster += monsterSpeed;
    
    //test collisions with vertical boundaries
    if (((xMonster + 100)> w) || (xMonster < 0))  {
      // collision with left or right wall
      // change the direction of movement
      monsterSpeed = -monsterSpeed;
    }
    
    //request a new frame of animation in 1/60s
    requestAnimationFrame(monsterLoop);
  }


  function drawMyMonster(x, y) {
    // GOOD practice: save the context before translating so you can restore later
    ctx.save();
  
    // translate the coordinate system, draw relative to it
    ctx.translate(x, y);
  
    // draw monster head (0, 0) is the top left corner of the monster.
    ctx.strokeRect(0, 0, 100,100);
  
    // eyes, relative to the top left corner of head
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

};