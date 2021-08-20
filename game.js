var documentWidth = document.documentElement.clientWidth || document.body.clientWidth;
var documentHeight = document.documentElement.clientHeight || document.body.clientHeight;
var startTime;
var enemies = [];
var canvas = document.querySelector("#game-area");
updateGameArea();
canvas.addEventListener("mousemove", onMouseMove);
canvas.addEventListener("click", startGame);
var scoreElement = document.querySelector("#score");
window.addEventListener("resize", updateScreen);
var context = canvas.getContext("2d");
var player = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 10,
    color: "red"
};
var Enemy = /** @class */ (function () {
    function Enemy(position, speed) {
        this.posX = position.x;
        this.posY = position.y;
        this.speedX = speed.x;
        this.speedY = speed.y;
        this.radius = 30;
        this.color = "blue";
    }
    return Enemy;
}());
var enemy = {
    posX: 0,
    posY: 0,
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
    console.log(radius);
}
function clearScreen() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}
function drawPlayer() {
    drawCircle(player.x, player.y, player.radius, player.color);
}
function drawEnemy(enemy) {
    console.log(enemy);
    drawCircle(enemy.posX, enemy.posY, enemy.radius, enemy.color);
}
function moveEnemy(enemy) {
    enemy.posX += enemy.speedX;
    enemy.posY += enemy.speedY;
}
function checkEnemyCollision(enemies) {
    for (var _i = 0, enemies_1 = enemies; _i < enemies_1.length; _i++) {
        enemy = enemies_1[_i];
        var distance = Math.sqrt(Math.pow((player.x - enemy.posX), 2) + Math.pow((player.y - enemy.posY), 2));
        if (distance < player.radius + enemy.radius) {
            return true;
        }
    }
    return false;
}
function bounceEnemyOnEdge(enemy) {
    if (enemy.posX < 0 || enemy.posX > documentWidth) {
        enemy.speedX *= -1;
    }
    if (enemy.posY < 0 || enemy.posY > documentHeight) {
        enemy.speedY *= -1;
    }
}
function increaseEnemySpeed(enemy) {
    enemy.speedX *= 1.001;
    enemy.speedY *= 1.001;
}
function generateEnemyParams() {
    var random = Math.random();
    var params = (function () {
        var posX;
        var posY;
        var speedX;
        var speedY;
        if (random <= 0.25) {
            //left side
            posX = 1;
            posY = Math.floor((canvas.height - 1) * Math.random()) || 1;
            speedX = 10;
            speedY = Math.random() <= 0.5 ? 10 : -10;
        }
        else if (random <= 0.5) {
            //right side
            posX = canvas.width - 1;
            posY = Math.floor((canvas.height - 1) * Math.random()) || 1;
            speedX = -10;
            speedY = Math.random() <= 0.5 ? 10 : -10;
        }
        else if (random <= 0.75) {
            //top side
            posX = Math.floor((canvas.width - 1) * Math.random()) || 1;
            posY = 1;
            speedX = Math.random() <= 0.5 ? 10 : -10;
            speedY = -10;
        }
        else {
            //bottom side
            posX = Math.floor((canvas.width - 1) * Math.random()) || 1;
            posY = canvas.height - 1;
            speedX = Math.random() <= 0.5 ? 10 : -10;
            speedY = 10;
        }
        var position = { x: posX, y: posY };
        var speed = { x: speedX, y: speedY };
        return { position: position, speed: speed };
    })();
    return params;
}
function endGame() {
    document.body.style.cursor = "auto";
    clearScreen();
    drawPlayer();
    enemies.forEach(function (enemy) { return drawEnemy(enemy); });
    window.setTimeout(function () {
        alert("Fim do jogo!");
        cancelAllAnimationFrames();
        canvas.addEventListener("click", startGame);
    }, 50);
}
function startGame(event) {
    cancelAllAnimationFrames();
    enemies = [];
    startTime = Date.now();
    canvas.removeEventListener("click", startGame);
    document.body.style.cursor = "none";
    player.x = event.clientX;
    player.y = event.clientY;
    var _a = generateEnemyParams(), position = _a.position, speed = _a.speed;
    var enemy = new Enemy(position, speed);
    enemies.push(enemy);
    window.requestAnimationFrame(gameLoop);
}
function cancelAllAnimationFrames() {
    var id = window.requestAnimationFrame(function () { });
    while (id--) {
        window.cancelAnimationFrame(id);
    }
}
function gameLoop() {
    var timeElapsed = Date.now() - startTime;
    if (timeElapsed % 2000 && timeElapsed > enemies.length * 2000) {
        var _a = generateEnemyParams(), position = _a.position, speed = _a.speed;
        var enemy_1 = new Enemy(position, speed);
        enemies.push(enemy_1);
    }
    scoreElement.innerHTML = "" + Math.floor(timeElapsed / 100);
    if (checkEnemyCollision(enemies)) {
        endGame();
    }
    else {
        clearScreen();
        drawPlayer();
        enemies.forEach(function (enemy) {
            drawEnemy(enemy);
            moveEnemy(enemy);
            bounceEnemyOnEdge(enemy);
            increaseEnemySpeed(enemy);
        });
        window.requestAnimationFrame(gameLoop);
    }
}
