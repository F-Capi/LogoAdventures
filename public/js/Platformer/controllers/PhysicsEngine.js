// PhysicsEngine.js
export class PhysicsEngine {
    constructor(platforms) {
        this.platforms = platforms;
        this.RAYCAST_HORIZONTAL_LENGTH = 5;
        this.MAX_SLOPE_THRESHOLD = 2;
    }

    applyGravity(player, deltaTime) {
        if (!player.isGrounded) {
            player.velocityY += player.gravity * deltaTime;
            player.y += player.velocityY * deltaTime;
        }
    }
    update(player, deltaTime) {
        this.applyGravity(player, deltaTime);
        this.detectCollisions(player, deltaTime);
    }
    detectCollisions(player, deltaTime) {

        const wallcollided = this.detectWallCollision(player);
        const slopecollided = this.detectSlopeCollision(player, deltaTime);
        const ceilingcollided = false;
        if (player.velocityY < 0) {
            this.detectCeilingCollision(player);
        }

        return wallcollided || slopecollided || ceilingcollided;

    }


    detectWallCollision(player) {
        let rectLeft = player.x - player.radius;
        let rectRight = player.x + player.radius;
        let rectTop = player.y - player.radius;
        let rectBottom = player.y;
        let correctionFactor = 0.1; // Este factor determina qué tan grande es el ajuste por frame

        for (const platform of this.platforms) {
            if (platform.x1 === platform.x2) {
                if (platform.x1 >= rectLeft && platform.x1 <= rectRight &&
                    Math.max(platform.y1, platform.y2) >= rectTop &&
                    Math.min(platform.y1, platform.y2) <= rectBottom) {

                    let overlap;
                    if (player.x > platform.x1) {
                        overlap = (platform.x1 + player.radius + player.radius / 5) - player.x;
                    } else {
                        overlap = (platform.x1 - (player.radius + player.radius / 5)) - player.x;
                    }

                    // Ajustar la posición x del jugador de forma suave
                    player.x += overlap * correctionFactor;
                    return true; // No es necesario comprobar más plataformas
                }
            }
        }
        return false;
    }

    detectCeilingCollision(player) {


        const rayStartY = player.y - player.radius;
        const rayEndY = rayStartY - player.radius / 3; // Ajusta según sea necesario

        for (const platform of this.platforms) {
            let startX = Math.min(platform.x1, platform.x2);
            let endX = Math.max(platform.x1, platform.x2);
            let startY = (startX === platform.x1) ? platform.y1 : platform.y2;
            let endY = (endX === platform.x2) ? platform.y2 : platform.y1;

            const dx = endX - startX;
            const dy = endY - startY;
            const m = dy / dx;
            const b = startY - m * startX;
            const yOnPlatform = m * player.x + b;

            if (player.x + player.radius > startX && player.x - player.radius < endX && rayEndY <= yOnPlatform && player.y - player.radius > yOnPlatform && player.canJump) {
                player.velocityY = 0; // Detiene el movimiento vertical
                return true;
            }
        }
        return false;
    }


    lerp(start, end, alpha) {
        return start + (end - start) * alpha;
    }
    detectSlopeCollision(player, deltaTime) {
        if (player.velocityY < 0) {
            return false; // Si el jugador está subiendo, ignora la colisión hacia abajo.
        }

        player.isGrounded = false;
        let slopeCollisionDetected = false;

        for (const platform of this.platforms) {
            let [leftX, leftY, rightX, rightY] = platform.x1 < platform.x2 ?
                [platform.x1, platform.y1, platform.x2, platform.y2] :
                [platform.x2, platform.y2, platform.x1, platform.y1];

            const dx = rightX - leftX;
            const dy = rightY - leftY;
            if (dx === 0) continue; // Ignora plataformas verticales
            const slope = dy / dx;
            const yIntercept = leftY - slope * leftX;
            const yOnPlatform = slope * player.x + yIntercept;

            if (Math.abs(slope) > this.MAX_SLOPE_THRESHOLD) {
                if (player.x >= leftX && player.x <= rightX) {
                    const slideDirection = slope > 0 ? 1 : -1;
                    if (player.y + player.radius >= yOnPlatform && player.y - player.radius / 3 <= yOnPlatform) {
                        player.isGrounded = true;
                        slopeCollisionDetected = true;
                        player.canJump = false;
                        player.x += slideDirection * 100 * deltaTime; // Mantiene la lógica de deslizamiento
                        //player.speed *= 0.9 * deltaTime;
                        // Aplica suavizado al ajuste de la posición y
                        player.y = this.lerp(player.y, yOnPlatform - player.radius, deltaTime * 5); // Ajusta este valor según sea necesario
                        break;
                    }
                }
            } else if (player.x >= leftX && player.x <= rightX && player.y + player.radius >= yOnPlatform && player.y - player.radius / 3 <= yOnPlatform) {
                player.velocityY = 0;
                player.isGrounded = true;
                slopeCollisionDetected = true;
                player.canJump = true;
                // Aplica suavizado al ajuste de la posición y para pendientes no empinadas
                player.y = this.lerp(player.y, yOnPlatform - player.radius, deltaTime * 10); // Ajusta este valor según sea necesario
                break;
            }
        }

        if (!slopeCollisionDetected && player.isGrounded) {
            player.isGrounded = false;
            player.canJump = true;
        }
        return slopeCollisionDetected;
    }

}