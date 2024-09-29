const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 600;
canvas.height = 600;

// Game variables
let platformWidth = 100;
let platformHeight = 20;
let platformX = (canvas.width - platformWidth) / 2;
let platformSpeed = 7;
let rightPressed = false;
let leftPressed = false;

// let define the balls and its radius and speed
let balls = [];
let ballRadius = 20;
let ballSpeed = 0.1;

// score of the game 
let score = 0;
let gameOver = false;

// Add event listeners for key presses
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } else if (e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

// Ball class
class Ball {
    constructor(x, y, dx, dy, color) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.color = color;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y += this.dy;

        // Check if ball hits the platform
        if (this.y + ballRadius > canvas.height - platformHeight &&
            this.x > platformX && this.x < platformX + platformWidth) {
            score += 10;
            this.y = -ballRadius;
            this.x = Math.random() * canvas.width;
            this.dy = Math.random() * 2 + ballSpeed;
        }

        // Check if the ball falls off the screen
        if (this.y - ballRadius > canvas.height) {
            gameOver = true;
        }

        this.draw();
    }
}

// Create initial balls
for (let i = 0; i < 5; i++) {
    let x = Math.random() * canvas.width;
    let y = Math.random() * canvas.height / 2;
    let dy = Math.random() * 2 + ballSpeed;
    let color = 'hsl(' + Math.random() * 360 + ', 100%, 50%)'; // Disco color effect
    balls.push(new Ball(x, y, 0, dy, color));
}

// Draw the platform
function drawPlatform() {
    ctx.beginPath();
    ctx.rect(platformX, canvas.height - platformHeight, platformWidth, platformHeight);
    ctx.fillStyle = "#e74c3c";
    ctx.fill();
    ctx.closePath();
}

// Update the game
function updateGame() {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "40px Arial";
        ctx.fillStyle = "#e74c3c";
        ctx.fillText("Game Over!", canvas.width / 4, canvas.height / 2);
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move the platform
    if (rightPressed && platformX < canvas.width - platformWidth) {
        platformX += platformSpeed;
    } else if (leftPressed && platformX > 0) {
        platformX -= platformSpeed;
    }

    // Update and draw balls
    balls.forEach(ball => ball.update());

    // Draw the platform
    drawPlatform();

    // Update the score
    document.getElementById('score').innerText = "Score: " + score;

    requestAnimationFrame(updateGame);
}

// Start the game
updateGame();
