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
    height: 15,
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
    width: 707,
    height: 12,
    color: "white",
  }

  let boxArea2 = {
    x: canvas.height/2 + 520,
    y: 0,
    width: 12,
    height: 350,
    color: "white",
  }

  let boxArea3 = {
    x: canvas.height - 450,
    y: 0,
    width: 12,
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
    y: 12,
    radius: 30,
    velX: 1,
    velY: 0,
    color: "RED",
    height: 100,
    width: 100,
    
  }

  function goalieBounds() {
    if (goalie.x + goalie.velX > (goalBox.width + 170) || goalie.x + goalie.velX < goalBox.width - 170) {
      goalie.velX = -goalie.velX;
    }
  }

  function goalieMove() {
    goalie.x += goalie.velX;
  }

  function drawGoalie() {
    let img = document.getElementById("goalie")
    ctx.beginPath();
    ctx.drawImage(img, goalie.x, goalie.y, goalie.width, goalie.height)
    // ctx.arc(goalie.x, goalie.y, goalie.radius, 0, Math.PI * 2);
    // ctx.fillStyle = goalie.color;
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
      radius: 15,
      angle: 90,
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

    let img2 = document.getElementById("soccer-ball")
    // ctx.beginPath();
    
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2 - player.ball.radius, canvas.height - 80)
    ctx.drawImage(img2, player.ball.x - player.ball.radius, player.ball.y - player.ball.radius, 30, 30)
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.strokeStyle = "black";
69
  }
  
  function renderPlayer() {
    let centerX = player.x;
    let centerY = player.y;

    // Draw player background circle
    ctx.fillStyle = "White";
    ctx.beginPath();
    ctx.arc(centerX, centerY, player.ball.radius, 0, 2 * Math.PI, false);
    ctx.fill();


    // Draw the angle
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + 0.2 * canvas.width * Math.cos(degToRad(player.angle)), centerY - 0.2 * canvas.height * Math.sin(degToRad(player.angle)));
    // ctx.lineTo(centerX + 0.3 * canvas.width * Math.cos(degToRad(player.angle)), centerY - 0.3 * canvas.height * Math.sin(degToRad(player.angle)));

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
  let gamestates = { init: 0, ready: 1, kickBall: 2, block: 3, diff: 4, out: 5, gameover: 6};
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
    // }else if (gamestate === gamestates.out) {
    //     outside();
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
      player.score += 1;
      nextBall();
      difficulty();
      setGameState(gamestates.ready);
    }else if (blocked()){
      nextBall();
      // setGameState(gamestates.gameover)
      newGame();
  } else if (player.ball.y <= 0 && (player.ball.x <= 0 || player.ball.x >= canvas.width) || (player.ball.x < -20 && player.ball.y > 0) || (player.ball.x > canvas.width + 20) ){
      nextBall();
      // setGameState(gamestates.gameover);
      newGame();
    }
  }

  function nextBall() {
    player.ball.x = player.x;
    player.ball.y = player.y;
    player.ball.visible = true;
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
    player.ball.speed = 300,
    newGame();

  }

}

// function outside(){

//   if (player.ball.y <= goalBox.y && player.ball.x < goalBox.x && player.ball.x > goalBox.x + goalBox.width) {
//     setGameState(gamestates.out)
//     player.ball.speed = 300,
//     newGame();
//   }
// }

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
    let mouseangle = radToDeg(Math.atan2((canvas.width) - (pos.y + 360), (pos.x + 100) - (canvas.height)));
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
      x: Math.round((e.clientX) - rect.left),
      y: Math.round((e.clientY) - rect.top)
      
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
    ctx.font = '40px "Press Start 2P"';
    var scorex = canvas.width / 2 + 160;
    var scorey = canvas.height / 2 + 160;
    drawCenterText("Score:", scorex, scorey, 150);
    drawCenterText(player.score, scorex, scorey + 50, 150);

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
  