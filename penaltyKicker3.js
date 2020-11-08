window.onload = function () {

  const canvas = document.getElementById("penalty-canvas");
  const ctx = canvas.getContext("2d");

  //--------------------------------
  // Timing and frames per second
  let lastframe = 0;
  let fpstime = 0;
  let framecount = 0;

  //--------------------------------
    // Goal Box: 
  let goalBox = {
    x: canvas.width / 2 - 200,
    y: 0,
    width: 400,
    height: 10,
    color: "WHITE",
  }

  function renderGoalBox() {

    ctx.fillStyle = goalBox.color;
    ctx.fillRect(goalBox.x, goalBox.y, goalBox.width, goalBox.height);
    ctx.closePath();
  }

  //--------------------------------
  // Box Area: 
  let boxArea1 = {
    x: canvas.width/2- 350,
    y: 350,
    width: 700,
    height: 5,
    color: "white",
  }

  let boxArea2 = {
    x: canvas.height/2 + 520,
    y: 0,
    width: 5,
    height: 350,
    color: "white",
  }

  let boxArea3 = {
    x: canvas.height - 450,
    y: 0,
    width: 5,
    height: 350,
    color: "white",
  }

  function renderboxArea() {

    ctx.fillStyle = boxArea1.color;
    ctx.fillRect(boxArea1.x, boxArea1.y, boxArea1.width, boxArea1.height);
    ctx.fillRect(boxArea2.x, boxArea2.y, boxArea2.width, boxArea2.height);
    ctx.fillRect(boxArea3.x, boxArea3.y, boxArea3.width, boxArea3.height);
    ctx.closePath();
  }

  //--------------------------------
    // Goalie:
  let goalie = {
    x: canvas.width / 2 - 20,
    y: 40,
    radius: 30,
    velX: 1,
    velY: 0,
    color: "RED",
  }

  function goalieBounds() {
    if (goalie.x + goalie.velX > (goalBox.width + 220) || goalie.x + goalie.velX < goalBox.width - 120) {
      goalie.velX = -goalie.velX;
    }
  }

  function goalieMove() {
    goalie.x += goalie.velX;
  }

  function drawGoalie() {
    ctx.beginPath();
    ctx.arc(goalie.x, goalie.y, goalie.radius, 0, Math.PI * 2);
    ctx.fillStyle = goalie.color;
    ctx.fill();
    ctx.closePath();
  }

  function renderGoalie() {
    drawGoalie();
    goalieBounds();
    goalieMove();
  }

  //--------------------------------
    // Player 
  let player = {
    x: 0,
    y: 0,
    angle: 0,
    score: 0,
    ball: {
      x: 0,
      y: 0,
      radius: 25,
      angle: 0,
      speed: 300,
      visible: false,
      color: "black",
    },
    nextBall:{
      x: 0,
      y: 0,
    },
  }

  
  function drawBall() {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, canvas.height - 80)
    ctx.arc(player.ball.x, player.ball.y, player.ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = "black";

  }
  
  function renderPlayer() {
    let centerX = player.x;
    let centerY = player.y;

    // Draw player background circle
    ctx.fillStyle = "#FFFF00";
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.ball.radius + 10, 0, 2 * Math.PI, false);
    ctx.fill();
    // ctx.strokeStyle = "black";
    // ctx.stroke();

    // Draw the angle
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 0.2 * canvas.width * Math.cos(degToRad(player.angle)), centerY - 0.2 * canvas.height * Math.sin(degToRad(player.angle)));
    ctx.stroke();

    // Draw ball
    drawBall(player.ball.x, player.ball.y);
    drawBall(player.nextBall.x, player.nextBall.y);

  }
//--------------------------------
//Initial action:
  function init() {

    // Add mouse events
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mousedown", onMouseDown);

    // Init the player
    player.x = canvas.width / 2;
    player.y = canvas.height - 80,
    player.angle = 90;

    player.ball.x = player.x - 2 * canvas.width;
    player.ball.y = player.y;

    player.nextBall.x = player.x - 2 * canvas.width;
    player.nextBall.y = player.y;
    // New game
    newGame();
    main(0);
  }

  //--------------------------------
  //Set Games State:
  let gamestates = { init: 0, ready: 1, kickBall: 2, block: 3, diff: 4, gameover: 5};
  let gamestate = gamestates.init;

  function setGameState(newgamestate) {

    gamestate = newgamestate;
  
    animationstate = 0;
    animationtime = 0;
  }

    //--------------------------------
  // Main clear canvas, update and render
  function main(tframe) {
    window.requestAnimationFrame(main);
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // if (!initialized){
    // }else{
      // }
      update(tframe);
      render();
    }

//--------------------------------
  // Update the game state
  function update(tframe) {
    let dt = (tframe - lastframe) / 1000;
    lastframe = tframe;
    updateFramesPS(dt);
    // Update the fps counter
    
    if (gamestate === gamestates.ready) {
    }else if (gamestate === gamestates.kickBall) {
      stateKickBall(dt);
    }else if (gamestate === gamestates.diff) {
      difficulty();
    }else if (gamestate === gamestates.gameover) {
      gameOver();
    }
  }
//--------------------------------
// Update frames:
  function updateFramesPS(dt) {
    if (fpstime > 0.25) {
      fps = Math.round(framecount / fpstime);
      // Reset time and framecount
      fpstime = 0;
      framecount = 0;
    }
    // Increase time and framecount
    fpstime += dt;
    framecount++;
  }

  //--------------------------------
  // Ball movement, update movement
  function stateKickBall(dt) {
  player.ball.x += dt * player.ball.speed * Math.cos(degToRad(player.ball.angle));
  player.ball.y += dt * player.ball.speed * -1 * Math.sin(degToRad(player.ball.angle));

  if (player.ball.y <= goalBox.y && player.ball.x > goalBox.x && player.ball.x < goalBox.x + goalBox.width){
    // if (player.ball.y <= goalBox.y){
      player.score += 1;
      nextBall();
      difficulty();
      setGameState(gamestates.ready);
    }else if (blocked()){
      setGameState(gamestates.gameover)
      return;
    }
  }

  function nextBall() {
    player.ball.x = player.x;
    player.ball.y = player.y;
    player.ball.visible = true;
    // setGameState(gamestates.newtry);
  }

  function kickBall() {
    player.ball.x = player.x;
    player.ball.y = player.y;
    player.ball.angle = player.angle;
    setGameState(gamestates.kickBall);
  }
//--------------------------------
//Check for collision and update state
//
function blocked(){
  let dx = Math.abs(player.ball.x - goalie.x);
  let dy = Math.abs(player.ball.y - goalie.y);
  let closestDistance = (player.ball.radius + goalie.radius);

  if ((dx*dx) + (dy*dy) <= closestDistance*closestDistance){
    setGameState(gamestates.block)
    newGame();

  }

}

function difficulty(){

  goalie.velX = goalie.velX * 1.2;
  player.ball.speed += 20;
  setGameState(gamestates.diff);

  }




//--------------------------------
//After result decides if new attempts or Gameover
function gameOver(){
    setGameState(gamestates.gameover);
}

  //--------------------------------
  // Convert radians to degrees
  function radToDeg(angle) {
    return angle * (180 / Math.PI);
  }
  // Convert degrees to radians
  function degToRad(angle) {
    return angle * (Math.PI / 180);
  }

  //--------------------------------
  // Mouse Control: Movement
  function onMouseMove(e) {
    let pos = getMousePos(canvas, e);
    let mouseangle = radToDeg(Math.atan2((canvas.width) - pos.y, pos.x - (canvas.height)));
    if (mouseangle < 0) {
      mouseangle = 180 + (180 + mouseangle);
    }
    let leftSide = 8;
    let rightSide = 172;
    if (mouseangle > 90 && mouseangle < 270) {
      if (mouseangle > rightSide) {
        mouseangle = rightSide;
      }
    } else {
      if (mouseangle < leftSide || mouseangle >= 270) {
        mouseangle = leftSide;
      }
    }
    player.angle = mouseangle;
  }
 // Mouse Control: Click
  function onMouseDown() {

    if (gamestate === gamestates.ready) {
      kickBall();
  } else if (gamestate == gamestates.gameover) {
    newGame();
  }
  }

  // Mouse control: Position
  function getMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: Math.round((e.clientX) / (rect.right) * canvas.width),
      y: Math.round((e.clientY) / (rect.bottom) * canvas.height)
    };
  }

  //--------------------------
  // Clear the whole canvas
  function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  //------------------------------
  // Render Main Game
  function render() {
    clear();
    renderGoalie();
    renderPlayer();
    renderGoalBox();
    renderboxArea();

    ctx.fillStyle = "#white";
    ctx.font = "50px fantasy";
    var scorex = canvas.width / 2 + 160;
    var scorey = canvas.height / 2 + 160;
    drawCenterText("Score:", scorex, scorey, 150);
    ctx.font = "50px fantasy";
    drawCenterText(player.score, scorex, scorey + 50, 150);

    // if (gamestate == gamestates.gameover) {
    //   ctx.fillStyle = "red";
    //   ctx.fillRect(18.5, 0.5 + canvas.height - 51, player * (canvas.width - 37), 32);

    //   ctx.fillStyle = "white";
    //   ctx.font = "24px Verdana";
    //   drawCenterText("Game Over!", canvas.width / 2, canvas.height / 2);
    //   drawCenterText("Click to start", canvas.width / 2, canvas.height / 2);
    // }

  }

  function drawCenterText(text, x, y, width) {
    var textdim = ctx.measureText(text);
    ctx.fillText(text, x + (width - textdim.width) / 2, y);
  }

  //----------------------------

  // Start a new game
  function newGame() {
    player.score = 0;
    // Set the gamestate to ready
    player.x = canvas.width / 2;
    player.y = canvas.height - 80,
    player.angle = 90;

    goalie.velX = 1;

    setGameState(gamestates.ready);
    // Init the next ball
    nextBall();

  }
  
  init();
  

};
  