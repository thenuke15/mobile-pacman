/**
 * HYBRID PAC-MAN ENGINE (PC & MOBILE) - FIXED VERSION
 */

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const livesEl = document.getElementById('lives');
const startScreen = document.getElementById('start-screen');

// --- CONSTANTS ---
const TILE_SIZE = 16;
const ROWS = 31;
const COLS = 28;
const PACMAN_SPEED = 2; 
const GHOST_SPEED = 2; 

const DIRECTIONS = {
    UP:    { x: 0, y: -1 },
    DOWN:  { x: 0, y: 1 },
    LEFT:  { x: -1, y: 0 },
    RIGHT: { x: 1, y: 0 },
    STOP:  { x: 0, y: 0 }
};

// Map Encoding: 0=Empty, 1=Wall, 2=Dot, 3=Power Pellet, 4=Ghost House Gate
const mapLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,0,1,1,1,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,4,4,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [0,0,0,0,0,0,2,0,0,0,1,0,0,0,0,0,0,1,0,0,0,2,0,0,0,0,0,0], // Tunnel
    [1,1,1,1,1,1,2,1,1,0,1,0,0,0,0,0,0,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,0,0,0,0,0,0,0,0,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,1,1,1,1,1,2,1,1,0,1,1,1,1,1,1,1,1,0,1,1,2,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
    [1,3,2,2,1,1,2,2,2,2,2,2,2,0,0,2,2,2,2,2,2,2,1,1,2,2,3,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,1,1,2,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1],
    [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// --- GAME STATE ---
let grid = [];
let score = 0;
let lives = 3;
let powerMode = false;
let powerModeTimer = null;
let gameRunning = false;

// --- CLASSES ---

class Entity {
    constructor(x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.dir = DIRECTIONS.STOP;
        this.nextDir = DIRECTIONS.STOP;
        this.radius = TILE_SIZE / 2 - 2;
    }

    getGridPos() {
        return {
            col: Math.floor((this.x + TILE_SIZE / 2) / TILE_SIZE),
            row: Math.floor((this.y + TILE_SIZE / 2) / TILE_SIZE)
        };
    }

    isCentered() {
        return Math.abs(this.x % TILE_SIZE) < 0.1 && Math.abs(this.y % TILE_SIZE) < 0.1;
    }

    canMove(direction) {
        const pos = this.getGridPos();
        const nextCol = pos.col + direction.x;
        const nextRow = pos.row + direction.y;

        // 1. Tunnel Handling
        if (nextCol < 0 || nextCol >= COLS) return true;

        // 2. Boundary Check (FIX FOR CRASH)
        if (nextRow < 0 || nextRow >= ROWS) return false;

        // 3. Wall/Gate Check
        const tile = grid[nextRow][nextCol];
        return tile !== 1 && tile !== 4; 
    }
    
    move() {
        if (this.isCentered()) {
            this.x = Math.round(this.x / TILE_SIZE) * TILE_SIZE;
            this.y = Math.round(this.y / TILE_SIZE) * TILE_SIZE;

            if (this.nextDir !== DIRECTIONS.STOP && this.canMove(this.nextDir)) {
                this.dir = this.nextDir;
                this.nextDir = DIRECTIONS.STOP; 
            } else if (!this.canMove(this.dir)) {
                this.dir = DIRECTIONS.STOP;
            }
        }

        this.x += this.dir.x * this.speed;
        this.y += this.dir.y * this.speed;

        // Wrap Around (Tunnel)
        if (this.x > canvas.width) this.x = -TILE_SIZE;
        if (this.x < -TILE_SIZE) this.x = canvas.width;
    }
}

class Pacman extends Entity {
    constructor(startX, startY) {
        super(startX * TILE_SIZE, startY * TILE_SIZE, PACMAN_SPEED);
        this.mouthOpen = 0;
        this.mouthSpeed = 0.2;
    }

    update() {
        this.move();
        
        // Animation
        this.mouthOpen += this.mouthSpeed;
        if (this.mouthOpen > 0.2 * Math.PI || this.mouthOpen < 0) {
            this.mouthSpeed = -this.mouthSpeed;
        }

        // Eating
        if (this.isCentered()) {
            const pos = this.getGridPos();
            if (pos.col >= 0 && pos.col < COLS) {
                const tile = grid[pos.row][pos.col];
                
                if (tile === 2) { // Dot
                    grid[pos.row][pos.col] = 0;
                    score += 10;
                } else if (tile === 3) { // Power Pellet
                    grid[pos.row][pos.col] = 0;
                    score += 50;
                    activatePowerMode();
                }
            }
        }
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        
        const offset = TILE_SIZE / 2;
        let rotation = 0;
        if (this.dir === DIRECTIONS.LEFT) rotation = Math.PI;
        if (this.dir === DIRECTIONS.UP) rotation = -Math.PI / 2;
        if (this.dir === DIRECTIONS.DOWN) rotation = Math.PI / 2;

        ctx.translate(this.x + offset, this.y + offset);
        ctx.rotate(rotation);
        
        ctx.arc(0, 0, this.radius, 0.2 * Math.PI - this.mouthOpen, 1.8 * Math.PI + this.mouthOpen);
        ctx.lineTo(0, 0);
        
        ctx.fill();
        ctx.rotate(-rotation);
        ctx.translate(-(this.x + offset), -(this.y + offset));
    }
}

class Ghost extends Entity {
    constructor(x, y, color) {
        super(x * TILE_SIZE, y * TILE_SIZE, GHOST_SPEED);
        this.color = color;
        this.scared = false;
        this.dir = DIRECTIONS.LEFT; 
    }

    update() {
        if (this.isCentered()) {
            const possibleMoves = [];
            const dirs = [DIRECTIONS.UP, DIRECTIONS.DOWN, DIRECTIONS.LEFT, DIRECTIONS.RIGHT];
            
            for (let d of dirs) {
                // Don't reverse direction unless necessary
                if (d.x === -this.dir.x && d.y === -this.dir.y) continue;
                
                if (this.canMove(d)) {
                    possibleMoves.push(d);
                }
            }

            if (possibleMoves.length > 0) {
                let chosenDir = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                
                // Bias towards Pacman
                if (!this.scared && Math.random() < 0.6) {
                    let bestDir = chosenDir;
                    let minDist = 999999;
                    
                    for(let d of possibleMoves) {
                        const nextX = this.x + d.x * TILE_SIZE;
                        const nextY = this.y + d.y * TILE_SIZE;
                        const dist = Math.hypot(nextX - pacman.x, nextY - pacman.y);
                        if(dist < minDist) {
                            minDist = dist;
                            bestDir = d;
                        }
                    }
                    chosenDir = bestDir;
                }

                this.dir = chosenDir;
            } else {
                // Dead end, reverse
                this.dir = { x: -this.dir.x, y: -this.dir.y };
            }
        }
        
        let speed = this.scared ? this.speed * 0.5 : this.speed;
        this.x += this.dir.x * speed;
        this.y += this.dir.y * speed;
        
        // Wrap
        if (this.x > canvas.width) this.x = -TILE_SIZE;
        if (this.x < -TILE_SIZE) this.x = canvas.width;
    }

    draw() {
        const offset = TILE_SIZE / 2;
        const x = this.x + offset;
        const y = this.y + offset;
        
        ctx.fillStyle = this.scared ? '#0000FF' : this.color;
        ctx.beginPath();
        // Dome
        ctx.arc(x, y - 2, this.radius, Math.PI, 0); 
        // Feet
        ctx.lineTo(x + this.radius, y + this.radius);
        ctx.lineTo(x - this.radius, y + this.radius);
        ctx.fill();

        // Eyes
        if (!this.scared) {
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(x - 4, y - 4, 3, 0, Math.PI * 2);
            ctx.arc(x + 4, y - 4, 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(x - 4 + this.dir.x * 2, y - 4 + this.dir.y * 2, 1.5, 0, Math.PI * 2);
            ctx.arc(x + 4 + this.dir.x * 2, y - 4 + this.dir.y * 2, 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

// --- INITIALIZATION ---

let pacman;
let ghosts = [];

function initGame() {
    grid = mapLayout.map(row => [...row]);
    
    // FIX 2: START AT 14 (Whole number)
    pacman = new Pacman(14, 23); 
    
    ghosts = [
        new Ghost(13.5, 11, 'red'),    // Blinky
        new Ghost(13.5, 14, 'pink'),   // Pinky
        new Ghost(12, 14, 'cyan'),     // Inky
        new Ghost(15, 14, 'orange')    // Clyde
    ];
}

function resetPositions() {
    // FIX 2: RESET TO 14
    pacman.x = 14 * TILE_SIZE;
    pacman.y = 23 * TILE_SIZE;
    pacman.dir = DIRECTIONS.STOP;
    pacman.nextDir = DIRECTIONS.STOP;
    
    ghosts[0].x = 13.5 * TILE_SIZE; ghosts[0].y = 11 * TILE_SIZE;
    ghosts[1].x = 13.5 * TILE_SIZE; ghosts[1].y = 14 * TILE_SIZE;
    ghosts[2].x = 12 * TILE_SIZE;   ghosts[2].y = 14 * TILE_SIZE;
    ghosts[3].x = 15 * TILE_SIZE;   ghosts[3].y = 14 * TILE_SIZE;
    
    ghosts.forEach(g => {
        g.dir = (Math.random() > 0.5) ? DIRECTIONS.LEFT : DIRECTIONS.RIGHT;
    });
}

function activatePowerMode() {
    powerMode = true;
    ghosts.forEach(g => g.scared = true);
    
    if (powerModeTimer) clearTimeout(powerModeTimer);
    powerModeTimer = setTimeout(() => {
        powerMode = false;
        ghosts.forEach(g => g.scared = false);
    }, 8000); // 8 seconds
}

// --- INPUT HANDLING (HYBRID) ---

// 1. Keyboard
document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    
    // Prevent default scrolling for arrow keys
    if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
    
    switch(e.key) {
        case 'ArrowUp': pacman.nextDir = DIRECTIONS.UP; break;
        case 'ArrowDown': pacman.nextDir = DIRECTIONS.DOWN; break;
        case 'ArrowLeft': pacman.nextDir = DIRECTIONS.LEFT; break;
        case 'ArrowRight': pacman.nextDir = DIRECTIONS.RIGHT; break;
    }
});

// 2. Touch (Swipe)
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
}, {passive: false});

document.addEventListener('touchmove', (e) => {
    if (gameRunning) {
        e.preventDefault(); // Stop scroll only if game is running
    }
}, {passive: false});

document.addEventListener('touchend', (e) => {
    if (!gameRunning) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchEndX - touchStartX;
    const dy = touchEndY - touchStartY;
    
    if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal
        if (Math.abs(dx) > 20) { 
            pacman.nextDir = dx > 0 ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
        }
    } else {
        // Vertical
        if (Math.abs(dy) > 20) {
            pacman.nextDir = dy > 0 ? DIRECTIONS.DOWN : DIRECTIONS.UP;
        }
    }
}, {passive: false});

// 3. Start Game Handler
function handleStart() {
    startScreen.style.display = 'none';
    if (!gameRunning) {
        initGame();
        gameRunning = true;
        loop();
    }
}
startScreen.addEventListener('click', handleStart);
startScreen.addEventListener('touchstart', handleStart);

// --- MAIN LOOP ---

function update() {
    if (!gameRunning) return;

    pacman.update();
    
    // Check Win
    let dotsLeft = false;
    for(let r=0; r<ROWS; r++){
        for(let c=0; c<COLS; c++){
            if (grid[r][c] === 2) dotsLeft = true;
        }
    }
    if (!dotsLeft) {
        alert("YOU WIN!");
        location.reload();
        return;
    }

    // Ghost Updates & Collision
    ghosts.forEach(ghost => {
        ghost.update();
        
        const dist = Math.hypot(ghost.x - pacman.x, ghost.y - pacman.y);
        if (dist < TILE_SIZE) {
            if (ghost.scared) {
                // Eat Ghost
                ghost.x = 13.5 * TILE_SIZE; 
                ghost.y = 14 * TILE_SIZE;
                ghost.scared = false;
                score += 200;
            } else {
                // Die
                lives--;
                if (lives <= 0) {
                    gameRunning = false;
                    alert("GAME OVER - Score: " + score);
                    location.reload();
                } else {
                    resetPositions();
                }
            }
        }
    });
    
    scoreEl.innerText = score;
    livesEl.innerText = lives;
}

function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const tile = grid[row][col];
            const x = col * TILE_SIZE;
            const y = row * TILE_SIZE;

            if (tile === 1) { // Wall
                ctx.fillStyle = '#1919A6'; 
                ctx.fillRect(x + 1, y + 1, TILE_SIZE - 2, TILE_SIZE - 2);
            } else if (tile === 2) { // Dot
                ctx.fillStyle = '#ffb8ae';
                ctx.fillRect(x + TILE_SIZE/2 - 2, y + TILE_SIZE/2 - 2, 4, 4);
            } else if (tile === 3) { // Power Pellet
                ctx.fillStyle = '#ffb8ae';
                ctx.beginPath();
                ctx.arc(x + TILE_SIZE/2, y + TILE_SIZE/2, 6, 0, Math.PI*2);
                ctx.fill();
            } else if (tile === 4) { // Gate
                ctx.fillStyle = 'pink';
                ctx.fillRect(x, y + TILE_SIZE/2 - 2, TILE_SIZE, 4);
            }
        }
    }

    pacman.draw();
    ghosts.forEach(g => g.draw());
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Initialize but don't start until click/tap
initGame();
draw();
