// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const scoreDisplay = document.getElementById('score');
const gameOverText = document.getElementById('gameOverText');

let gameRunning = false;
let score = 0;

// Bird object
const bird = {
    x: 50,
    y: canvas.height / 2,
    width: 30,
    height: 30,
    gravity: 0.25,
    velocity: 0,
    jump: -5
};

// Pipes array
const pipes = [];
const pipeGap = 200;
const pipeWidth = 50;
const pipeDistance = 150;

// Game constants
let frameCount = 0;

// Draw bird
function drawBird() {
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw eye
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(bird.x + bird.width / 2 + 5, bird.y + bird.height / 2 - 5, 4, 0, Math.PI * 2);
    ctx.fill();
}

// Draw pipes
function drawPipes() {
    ctx.fillStyle = '#00AA00';
    pipes.forEach(pipe => {
        // Top pipe
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.topHeight);
        // Bottom pipe
        ctx.fillRect(pipe.x, pipe.topHeight + pipeGap, pipeWidth, canvas.height - (pipe.topHeight + pipeGap));
    });
}

// Update bird position
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    
    // Check ground collision
    if (bird.y + bird.height >= canvas.height) {
        endGame();
    }
    
    // Check ceiling collision
    if (bird.y <= 0) {
        endGame();
    }
}

// Update pipes
function updatePipes() {
    // Add new pipes
    if (frameCount % pipeDistance === 0) {
        const minHeight = 50;
        const maxHeight = canvas.height - pipeGap - 50;
        const topHeight = Math.random() * (maxHeight - minHeight) + minHeight;
        pipes.push({
            x: canvas.width,
            topHeight: topHeight
        });
    }
    
    // Move pipes
    for (let i = pipes.length - 1; i >= 0; i--) {
        pipes[i].x -= 2.5;
        
        // Check collision
        if (checkCollision(pipes[i])) {
            endGame();
        }
        
        // Check if pipe passed bird (score)
        if (pipes[i].x + pipeWidth < bird.x && !pipes[i].scored) {
            pipes[i].scored = true;
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
        }
        
        // Remove pipes that are off screen
        if (pipes[i].x + pipeWidth < 0) {
            pipes.splice(i, 1);
        }
    }
}

// Check collision with pipes
function checkCollision(pipe) {
    const birdLeft = bird.x;
    const birdRight = bird.x + bird.width;
    const birdTop = bird.y;
    const birdBottom = bird.y + bird.height;
    
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + pipeWidth;
    const pipeTopBottom = pipe.topHeight;
    const pipeBottomTop = pipe.topHeight + pipeGap;
    
    // Check if bird is in horizontal range of pipe
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
        // Check if bird hits top pipe or bottom pipe
        if (birdTop < pipeTopBottom || birdBottom > pipeBottomTop) {
            return true;
        }
    }
    
    return false;
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(0, canvas.height - 10, canvas.width, 10);
    
    drawPipes();
    drawBird();
}

// Game loop
function gameLoop() {
    if (gameRunning) {
        updateBird();
        updatePipes();
        draw();
        frameCount++;
    }
    requestAnimationFrame(gameLoop);
}

// End game
function endGame() {
    gameRunning = false;
    gameOverText.style.display = 'block';
    startBtn.style.display = 'none';
    restartBtn.style.display = 'block';
    overlay.classList.remove('hidden');
}

// Start game
function startGame() {
    gameRunning = true;
    score = 0;
    frameCount = 0;
    bird.y = canvas.height / 2;
    bird.velocity = 0;
    pipes.length = 0;
    
    scoreDisplay.textContent = `Score: ${score}`;
    gameOverText.style.display = 'none';
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    overlay.classList.add('hidden');
}

// Event listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Bird jump on spacebar
document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && gameRunning) {
        bird.velocity = bird.jump;
    }
});

// Bird jump on click
canvas.addEventListener('click', () => {
    if (gameRunning) {
        bird.velocity = bird.jump;
    }
});

// Start game loop
gameLoop();
