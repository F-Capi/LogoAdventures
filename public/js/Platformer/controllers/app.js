const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let platforms = [
    // Sección 1: Inicio con Plataformas Inclinadas
    { x1: 0, y1: 600, x2: 30, y2: 570 }, { x1: 30, y1: 570, x2: 60, y2: 600 }, { x1: 60, y1: 600, x2: 90, y2: 570 }, { x1: 90, y1: 570, x2: 120, y2: 600 }, { x1: 120, y1: 600, x2: 150, y2: 570 }, { x1: 150, y1: 570, x2: 180, y2: 600 },
    { x1: 50, y1: 400, x2: 150, y2: 380 },
    { x1: 150, y1: 380, x2: 250, y2: 360 },

    // Sección 2: Serie de Plataformas Horizontales a Diferentes Alturas
    { x1: 250, y1: 360, x2: 300, y2: 360 },
    { x1: 320, y1: 340, x2: 370, y2: 340 },
    { x1: 390, y1: 320, x2: 440, y2: 320 },

    // Sección 3: Ascenso por Plataformas Verticales e Inclinadas
    { x1: 440, y1: 320, x2: 440, y2: 270 },
    { x1: 400, y1: 280, x2: 400, y2: 250 },

    { x1: 400, y1: 250, x2: 440, y2: 200 },

    { x1: 300, y1: 200, x2: 440, y2: 200 },
    { x1: 250, y1: 176, x2: 300, y2: 200 },
    { x1: 250, y1: 176, x2: 100, y2: 100 },
    //{ x1: 100, y1: 100, x2: 250, y2: 176 },
    { x1: 440, y1: 270, x2: 490, y2: 250 },
    { x1: 490, y1: 250, x2: 490, y2: 200 },

    // Sección 4: Pasaje con Techo Inclinado
    { x1: 490, y1: 200, x2: 540, y2: 180 },
    { x1: 540, y1: 180, x2: 590, y2: 160 }, // 'ceiling' indica un techo

    // Sección 5: Descenso y Salto entre Plataformas Inclinadas
    { x1: 590, y1: 160, x2: 640, y2: 180 },
    { x1: 660, y1: 200, x2: 710, y2: 220 },
    { x1: 730, y1: 240, x2: 780, y2: 260 },

    // Sección 6: Final con una Mezcla de Plataformas
    { x1: 780, y1: 260, x2: 830, y2: 260 },
    { x1: 850, y1: 240, x2: 900, y2: 220 },
    { x1: 920, y1: 200, x2: 970, y2: 180 },

];


let player = {
    x: 300,
    y: 0,
    radius: 12,
    speed: 100,
    velocityY: 0,
    gravity: 900,
    jumpForce: -300,
    isGrounded: false,

};


function applyGravity(deltaTime) {
    if (!player.isGrounded) {

        player.velocityY += player.gravity * deltaTime;
        player.y += player.velocityY * deltaTime;
    }
}


const RAYCAST_HORIZONTAL_LENGTH = 5;


const MAX_SLOPE_THRESHOLD = 2;


function raycastVerticalCollision(direction) {
    const rayLength = RAYCAST_HORIZONTAL_LENGTH;
    let rayStartX = direction === 1 ? player.x + player.radius : player.x - player.radius;
    let rayEndX = rayStartX + direction * rayLength;

    for (const platform of platforms) {
        // Calcula la pendiente de la plataforma
        const slope = (platform.y2 - platform.y1) / (platform.x2 - platform.x1);

        // Verifica si la plataforma es vertical o tiene una pendiente pronunciada
        if (platform.x1 === platform.x2 || Math.abs(slope) > MAX_SLOPE_THRESHOLD) {
            if ((direction === 1 && rayEndX >= platform.x1 && player.x < platform.x1) ||
                (direction === -1 && rayEndX <= platform.x1 && player.x > platform.x1)) {
                if (player.y + player.radius > Math.min(platform.y1, platform.y2) &&
                    player.y - player.radius < Math.max(platform.y1, platform.y2)) {
                    return true; // Hay colisión
                }
            }
        }
    }
    return false; // No hay colisión
}



function movePlayer(direction, deltaTime) {
    player.x += direction * player.speed * deltaTime;
}


const keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
});
const jumpCooldown = 100; // Cooldown en milisegundos, ajusta según sea necesario
let lastJumpTime = 0;



function handlePlayerInput(deltaTime) {
    if (keysPressed['ArrowLeft'] && !raycastVerticalCollision(-1)) {
        movePlayer(-1, deltaTime);
    }
    if (keysPressed['ArrowRight'] && !raycastVerticalCollision(1)) {
        movePlayer(1, deltaTime);
    }
    const currentTime = Date.now();
    if (keysPressed['Space'] && player.isGrounded && currentTime - lastJumpTime > jumpCooldown) {
        player.velocityY = player.jumpForce;
        player.isGrounded = false;
        lastJumpTime = currentTime;
    }
}
function detectCeilingCollision() {
    if (player.velocityY >= 0) {
        return false; // No verificar colisiones si el jugador se mueve hacia abajo
    }

    const rayStartY = player.y - player.radius;
    const rayEndY = rayStartY - 10; // Ajusta según sea necesario

    for (const platform of platforms) {
        let startX = Math.min(platform.x1, platform.x2);
        let endX = Math.max(platform.x1, platform.x2);
        let startY = (startX === platform.x1) ? platform.y1 : platform.y2;
        let endY = (endX === platform.x2) ? platform.y2 : platform.y1;

        const dx = endX - startX;
        const dy = endY - startY;
        const m = dy / dx;
        const b = startY - m * startX;
        const yOnPlatform = m * player.x + b;

        if (player.x + player.radius > startX && player.x - player.radius < endX && rayEndY <= yOnPlatform && player.y - player.radius > yOnPlatform - 10) { // Ajusta este valor
            player.velocityY = 0; // Detiene el movimiento vertical
            return true;
        }
    }
    return false;
}

function detectSlopeCollision() {
    if (player.velocityY < 0) {
        return false; // Si el jugador está subiendo, ignora la colisión hacia abajo.
    }

    player.isGrounded = false;

    for (const platform of platforms) {
        let [leftX, leftY, rightX, rightY] = platform.x1 < platform.x2 ?
            [platform.x1, platform.y1, platform.x2, platform.y2] :
            [platform.x2, platform.y2, platform.x1, platform.y1];

        const dx = rightX - leftX;
        const dy = rightY - leftY;
        const slope = dy / dx;
        const yIntercept = leftY - slope * leftX;
        const yOnPlatform = slope * player.x + yIntercept;

        if (player.x >= leftX && player.x <= rightX) {
            if (player.y + player.radius >= yOnPlatform && player.y - player.radius <= yOnPlatform) {
                // Colisión detectada, ajusta posición y estado del jugador
                player.y = yOnPlatform - player.radius;
                player.velocityY = 0;
                player.isGrounded = true;
                return;
            }
        }
    }
}

let lastFrameTime = Date.now();

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000;

    update(deltaTime);
    draw();
    lastFrameTime = currentTime;

    requestAnimationFrame(gameLoop);
}

gameLoop();

function update(deltaTime) {
    handlePlayerInput(deltaTime);
    applyGravity(deltaTime);

    detectSlopeCollision();
    if (player.velocityY < 0) {
        detectCeilingCollision();
    }
}
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#303030';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Dibujar plataformas
    ctx.strokeStyle = '#ff6700';
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    for (const platform of platforms) {

        ctx.beginPath();
        ctx.moveTo(platform.x1, platform.y1);
        ctx.lineTo(platform.x2, platform.y2);
        ctx.stroke();
    }

    // Dibujar jugador
    ctx.fillStyle = '#39ff14';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Mostrar el valor de isGrounded
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`isGrounded: ${player.isGrounded}`, 10, 30);



}




let originalPlatforms = JSON.parse(JSON.stringify(platforms));
let originalPlayer = JSON.parse(JSON.stringify(player));

const baseWidth = 1024;
const baseHeight = 576; // Alto base del canvas

let scaleRatio = 1;

function calculateScaleFactor() {
    const scaleRatioWidth = canvas.width / baseWidth;
    const scaleRatioHeight = canvas.height / baseHeight;
    return Math.min(scaleRatioWidth, scaleRatioHeight);
}


function resetToOriginalSizes() {
    platforms = JSON.parse(JSON.stringify(originalPlatforms));
    player = JSON.parse(JSON.stringify(originalPlayer));
}

function scaleGameElements() {
    const scaleFactor = calculateScaleFactor();

    // Guarda la posición actual del jugador antes de restablecer
    let currentPlayerX = player.x / scaleRatio; // Asegúrate de desescalar la posición actual antes de volver a escalar
    let currentPlayerY = player.y / scaleRatio; // Asegúrate de desescalar la posición actual antes de volver a escalar

    resetToOriginalSizes();

    // Escalar plataformas
    platforms.forEach(platform => {
        platform.x1 *= scaleFactor;
        platform.y1 *= scaleFactor;
        platform.x2 *= scaleFactor;
        platform.y2 *= scaleFactor;
    });


    // Escalar propiedades del jugador
    player.x = currentPlayerX * scaleFactor; // Reescala la posición guardada
    player.y = currentPlayerY * scaleFactor; // Reescala la posición guardada
    player.radius = player.radius * scaleFactor; // Escalar para propósitos visuales

    player.speed = player.speed * scaleFactor;
    player.gravity = player.gravity * scaleFactor;
    player.jumpForce = player.jumpForce * scaleFactor;
    ctx.lineWidth = ctx.lineWidth * scaleFactor;
    scaleRatio = scaleFactor; // Actualiza el factor de escala global
}



function resizeCanvas() {
    let newWidth = Math.max(window.innerWidth, 350);
    newWidth = Math.min(newWidth, 1024);

    const aspectRatio = baseHeight / baseWidth;
    let newHeight = newWidth * aspectRatio;

    canvas.width = newWidth;
    canvas.height = newHeight;

    scaleGameElements();
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Inicializar el tamaño al cargar
