let documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
let documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
let startTime: number;
let enemies: Enemy[] = [];

const canvas = <HTMLCanvasElement>document.querySelector("#game-area");
updateGameArea();
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("click", startGame);

const scoreElement = document.querySelector("#score");
window.addEventListener("resize", updateScreen)
const context = canvas.getContext("2d");

let player = {
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  radius: 10,
  color: "red",
};

class Enemy{
  posX:number;
  posY:number;
  speedX: number;
  speedY: number;
  radius: number;
  color: string;

  constructor(position: {x:number, y:number}, speed:{x:number, y:number}){
    this.posX = position.x;
    this.posY = position.y;
    this.speedX = speed.x;
    this.speedY = speed.y;
    this.radius = 30;
    this.color = "blue";
  }
}

let enemy = {
  posX: 0,
  posY: 0,
  radius: 30,
  color: "blue",
  speedX: 10,
  speedY: 10,
};

function updateScreen(){
  updateResolution();
  updateGameArea();
  endGame();
}

function updateResolution(){
  documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
  documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
}

function updateGameArea(){
  const scoreArea = document.querySelector("#score-area");
  const scoreRect = scoreArea.getBoundingClientRect();
  canvas.width = documentWidth;
  canvas.height = documentHeight - scoreRect.height;
}

function onMouseMove(event: MouseEvent) {
  player.x = event.clientX;
  player.y = event.clientY;
}

function drawCircle(x: number, y: number, radius: number, color: string) {
  context.beginPath();
  context.fillStyle = color;
  context.arc(x, y, radius, 0, 2 * Math.PI);
  context.fill();
  console.log(radius);
}

function clearScreen() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
  drawCircle(player.x, player.y, player.radius, player.color);
}

function drawEnemy(enemy: Enemy) {
  console.log(enemy);
  drawCircle(enemy.posX, enemy.posY, enemy.radius, enemy.color);
}

function moveEnemy(enemy: Enemy) {
  enemy.posX += enemy.speedX;
  enemy.posY += enemy.speedY;
}

function checkEnemyCollision(enemies: Enemy[]) {
  for(enemy of enemies){
    const distance = Math.sqrt(
      (player.x - enemy.posX) ** 2 + (player.y - enemy.posY) ** 2
    );
    if (distance < player.radius + enemy.radius){
      return true;
    }
  }
  return false;
}

function bounceEnemyOnEdge(enemy:Enemy) {
  if (enemy.posX < 0 || enemy.posX > documentWidth) {
    enemy.speedX *= -1;
  }

  if (enemy.posY < 0 || enemy.posY > documentHeight) {
    enemy.speedY *= -1;
  }
}

function increaseEnemySpeed(enemy:Enemy) {
  enemy.speedX *= 1.001;
  enemy.speedY *= 1.001;
}

function generateEnemyParams(){
  const random = Math.random();
  const params = (()=>{
    let posX;
    let posY;
    let speedX;
    let speedY;
    if (random <= 0.25){
      //left side
      posX = 1;
      posY = Math.floor((canvas.height-1)*Math.random()) || 1;
      speedX = 10
      speedY = Math.random() <= 0.5 ? 10 : -10;
    } else if (random <= 0.5){
      //right side
      posX = canvas.width - 1;
      posY = Math.floor((canvas.height-1)*Math.random()) || 1;
      speedX = -10
      speedY = Math.random() <= 0.5 ? 10 : -10;
    } else if (random <=0.75){
      //top side
      posX = Math.floor((canvas.width-1)*Math.random()) || 1;
      posY = 1;
      speedX = Math.random() <= 0.5 ? 10 : -10;
      speedY = -10;
    } else {
      //bottom side
      posX = Math.floor((canvas.width-1)*Math.random()) || 1;
      posY = canvas.height - 1 ;
      speedX = Math.random() <= 0.5 ? 10 : -10;
      speedY = 10;
    }
    const position = {x:posX, y:posY};
    const speed = {x:speedX, y:speedY};
    return {position, speed}
  })();
  return params;
}

function endGame() {
  document.body.style.cursor = "auto";
  clearScreen();
  drawPlayer();
  enemies.forEach(enemy=>drawEnemy(enemy));

  window.setTimeout(()=>{
    alert("Fim do jogo!");
    cancelAllAnimationFrames();
    canvas.addEventListener("click", startGame);
  },50);
}

function startGame(event: MouseEvent) {
  cancelAllAnimationFrames();
  enemies = [];
  startTime = Date.now();
  canvas.removeEventListener("click", startGame);

  document.body.style.cursor = "none";

  player.x = event.clientX;
  player.y = event.clientY;

  const {position, speed} = generateEnemyParams();
  const enemy = new Enemy(position, speed)

  enemies.push(enemy);
  window.requestAnimationFrame(gameLoop);
}

function cancelAllAnimationFrames(){
  let id = window.requestAnimationFrame(()=>{});
  while(id--){
    window.cancelAnimationFrame(id);
  }
}

function gameLoop() {
  const timeElapsed = Date.now() - startTime; 
  if (timeElapsed % 2000 && timeElapsed > enemies.length * 2000){
    const {position, speed} = generateEnemyParams();
    const enemy = new Enemy(position, speed)
    enemies.push(enemy);
  }
  scoreElement.innerHTML = `${Math.floor(timeElapsed/100)}`;
  if (checkEnemyCollision(enemies)) {
    endGame();
  } else {
    clearScreen();
    drawPlayer();
    enemies.forEach(enemy=>{
      drawEnemy(enemy)
      moveEnemy(enemy);
      bounceEnemyOnEdge(enemy);
      increaseEnemySpeed(enemy);
    });
  
    window.requestAnimationFrame(gameLoop);
  }
}
