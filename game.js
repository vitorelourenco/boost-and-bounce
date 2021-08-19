var documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
var documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
var canvas = document.querySelector("#game-area");
updateGameArea();
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("click", startGame);
window.addEventListener("resize", updateScreen);
var context = canvas.getContext("2d");
var player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 100,
    color: "red"
};
var enemy = {
    x: 0,
    y: 0,
    radius: 30,
    color: "blue",
    speedX: 10,
    speedY: 10
};
function updateScreen() {
    updateResolution();
    updateGameArea();
    endGame();
}
function updateResolution() {
    documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
    documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
}
function updateGameArea() {
    var scoreArea = document.querySelector("#score-area");
    var scoreRect = scoreArea.getBoundingClientRect();
    canvas.width = documentWidth;
    canvas.height = documentHeight - scoreRect.height;
}
function onMouseMove(event) {
    player.x = event.clientX;
    player.y = event.clientY;
}
function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.fill();
}
function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function drawPlayer() {
    drawCircle(player.x, player.y, player.radius, player.color);
}
function drawEnemy() {
    drawCircle(enemy.x, enemy.y, enemy.radius, enemy.color);
}
function moveEnemy() {
    enemy.x += enemy.speedX;
    enemy.y += enemy.speedY;
}
function checkEnemyCollision() {
    var distance = Math.sqrt(Math.pow((player.x - enemy.x), 2) + Math.pow((player.y - enemy.y), 2));
    return distance < player.radius + enemy.radius;
}
function bounceEnemyOnEdge() {
    if (enemy.x < 0 || enemy.x > documentWidth) {
        enemy.speedX *= -1;
    }
    if (enemy.y < 0 || enemy.y > documentHeight) {
        enemy.speedY *= -1;
    }
}
function increaseEnemySpeed() {
    enemy.speedX *= 1.001;
    enemy.speedY *= 1.001;
}
function endGame() {
    document.body.style.cursor = "auto";
    clearScreen();
    drawPlayer();
    drawEnemy();
    window.setTimeout(function () {
        alert("Fim do jogo!");
        cancelAllAnimationFrames();
        canvas.addEventListener("click", startGame);
    }, 50);
}
function startGame(event) {
    cancelAllAnimationFrames();
    canvas.removeEventListener("click", startGame);
    document.body.style.cursor = "none";
    player.x = event.clientX;
    player.y = event.clientY;
    enemy.x = 0;
    enemy.y = 0;
    enemy.speedX = 10;
    enemy.speedY = 10;
    window.requestAnimationFrame(gameLoop);
}
function cancelAllAnimationFrames() {
    var id = window.requestAnimationFrame(function () { });
    while (id--) {
        window.cancelAnimationFrame(id);
    }
}
function gameLoop() {
    if (checkEnemyCollision()) {
        endGame();
    }
    else {
        clearScreen();
        moveEnemy();
        bounceEnemyOnEdge();
        increaseEnemySpeed();
        drawPlayer();
        drawEnemy();
        window.requestAnimationFrame(gameLoop);
    }
}
