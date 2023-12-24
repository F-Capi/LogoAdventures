const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
console.log("hello fran")
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
    radius: 10,
    speed: 2,
    velocityY: 0,
    gravity: 0.8,
    jumpForce: -8,
    isGrounded: false
};


let originalPlatforms = JSON.parse(JSON.stringify(platforms));
let originalPlayer = JSON.parse(JSON.stringify(player));

function applyGravity() {
    player.velocityY += player.gravity;
    player.y += player.velocityY;
}


const RAYCAST_HORIZONTAL_LENGTH = 2; // Ajusta según tus necesidades


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



function movePlayer(direction) {
    player.x += direction * player.speed;
}


const keysPressed = {};

document.addEventListener('keydown', (e) => {
    keysPressed[e.code] = true;
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
});
const jumpCooldown = 300; // Cooldown en milisegundos, ajusta según sea necesario
let lastJumpTime = 0;

function handlePlayerInput() {
    if (keysPressed['ArrowLeft'] && !raycastVerticalCollision(-1)) {
        movePlayer(-1);
    }
    if (keysPressed['ArrowRight'] && !raycastVerticalCollision(1)) {
        movePlayer(1);
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
        player.isTouchingCeiling = false;
        return false;
    }

    const rayStartY = player.y - player.radius;
    const rayEndY = rayStartY - 10; // Ajusta según la mecánica de tu juego

    for (const platform of platforms) {
        let startX = Math.min(platform.x1, platform.x2);
        let endX = Math.max(platform.x1, platform.x2);
        let startY = (startX === platform.x1) ? platform.y1 : platform.y2;
        let endY = (endX === platform.x2) ? platform.y2 : platform.y1;

        // Ahora calcula la pendiente y la intersección y
        const dx = endX - startX;
        const dy = endY - startY;
        const m = dy / dx;
        const b = startY - m * startX;
        const yOnPlatform = m * player.x + b;

        // Ajusta la condición para detectar colisiones solo cuando el jugador está realmente cerca del techo
        if (player.x + player.radius > platform.x1 && player.x - player.radius < platform.x2 && rayEndY <= yOnPlatform && player.y - player.radius > yOnPlatform - 20) {
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
        // Normaliza los puntos de la plataforma
        let [leftX, leftY, rightX, rightY] = platform.x1 < platform.x2 ?
            [platform.x1, platform.y1, platform.x2, platform.y2] :
            [platform.x2, platform.y2, platform.x1, platform.y1];

        const dx = rightX - leftX;
        const dy = rightY - leftY;
        const slope = dy / dx;
        const yIntercept = leftY - slope * leftX;

        // Calcula la y esperada en la plataforma para la x actual del jugador
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




function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    handlePlayerInput();
    applyGravity();

    detectSlopeCollision();

    if (player.velocityY < 0) {
        detectCeilingCollision();
    }
    // Dibujar plataformas
    ctx.strokeStyle = 'black';
    for (const platform of platforms) {

        ctx.beginPath();
        ctx.lineWidth = 5;
        ctx.moveTo(platform.x1, platform.y1);
        ctx.lineTo(platform.x2, platform.y2);
        ctx.stroke();
    }

    // Dibujar jugador
    ctx.fillStyle = 'blue';
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fill();

    // Mostrar el valor de isGrounded
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`isGrounded: ${player.isGrounded}`, 10, 30);

    requestAnimationFrame(draw);
}

draw();

// Definir proporciones o dimensiones base
const baseWidth = 800; // Ancho base del canvas
const baseHeight = 800; // Alto base del canvas

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

    resetToOriginalSizes();
    // Escalar plataformas
    platforms.forEach(platform => {
        platform.x1 *= scaleFactor;
        platform.y1 *= scaleFactor;
        platform.x2 *= scaleFactor;
        platform.y2 *= scaleFactor;
    });

    // Escalar propiedades del jugador
    player.x *= scaleFactor;
    player.y *= scaleFactor;
    player.radius *= scaleFactor;
    player.speed *= scaleFactor;
    player.gravity = originalPlayer.gravity * scaleFactor;
    player.jumpForce = originalPlayer.jumpForce * scaleFactor;

    // Asegúrate de que otros elementos del juego también se escalen adecuadamente
}



function resizeCanvas() {
    let newWidth = Math.max(window.innerWidth, 420);
    newWidth = Math.min(newWidth, 800);

    const aspectRatio = baseHeight / baseWidth;
    let newHeight = newWidth * aspectRatio;

    canvas.width = newWidth;
    canvas.height = newHeight;

    scaleGameElements(); // Escalar elementos del juego
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas(); // Inicializar el tamaño al cargar
