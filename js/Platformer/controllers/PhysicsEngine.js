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
        this.detectWallCollision(player);
        this.detectSlopeCollision(player, deltaTime);
        if (player.velocityY < 0) {
            this.detectCeilingCollision(player);
        }
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
                    return; // No es necesario comprobar más plataformas
                }
            }
        }
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

    /*
    
        detectSlopeCollision(player, deltaTime) {
            if (player.velocityY < 0) {
                // Si el jugador está subiendo, ignora la colisión hacia abajo.
                return false;
            }
    
            player.isGrounded = false;
            player.canJump = false;
            let slopeCollisionDetected = false;
    
            for (const platform of this.platforms) {
                let [leftX, leftY, rightX, rightY] = platform.x1 < platform.x2 ?
                    [platform.x1, platform.y1, platform.x2, platform.y2] :
                    [platform.x2, platform.y2, platform.x1, platform.y1];
    
                const dx = rightX - leftX;
                const dy = rightY - leftY;
                // Evita división por cero en caso de plataformas verticales
                if (dx === 0) continue;
                const slope = dy / dx;
                const yIntercept = leftY - slope * leftX;
                const yOnPlatform = slope * player.x + yIntercept;
    
                // Determina si la pendiente es suficientemente empinada como para que el jugador resbale
                if (Math.abs(slope) > this.MAX_SLOPE_THRESHOLD) {
                    if (player.x >= leftX && player.x <= rightX) {
    
                        const slideDirection = slope > 0 ? 1 : -1; // Determina la dirección de deslizamiento basado en la pendiente
                        if (player.y + player.radius >= yOnPlatform && player.y - player.radius / 3 <= yOnPlatform) {
                            player.isGrounded = true; // Marca al jugador como en el suelo
                            slopeCollisionDetected = true;
                            player.canJump = false;
                            // Aplica el efecto de resbalamiento
                            player.x += slideDirection * 100 * deltaTime; // Ajusta este valor para controlar la velocidad de resbalamiento
                            player.y = yOnPlatform - player.radius; // Ajusta la posición y para mantener al jugador sobre la plataforma
                            break; // Sal de la iteración después de detectar la colisión
                        }
                    }
                } else if (player.x >= leftX && player.x <= rightX && player.y + player.radius >= yOnPlatform && player.y - player.radius / 3 <= yOnPlatform) {
                    // Maneja colisiones con pendientes no empinadas
                    player.y = yOnPlatform - player.radius; // Ajusta la posición y para mantener al jugador sobre la plataforma
                    player.velocityY = 0;
                    player.isGrounded = true;
                    slopeCollisionDetected = true;
                    player.canJump = true;
                    break; // Sal de la iteración después de detectar la colisión
                }
            }
    
            if (!slopeCollisionDetected && player.isGrounded) {
                player.isGrounded = false; // Actualiza el estado si el jugador ya no está en una pendiente
                player.canJump = true;
    
            }
        }
    
    */
    /*  detectSlopeCollision(player, deltaTime) {
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
  
                          // Suaviza el ajuste de la posición x para el resbalamiento
                          const targetX = player.x + slideDirection * 100 * deltaTime; // Destino de resbalamiento
                          player.x += (targetX - player.x) * 0.1; // Aplica un factor de suavizado
  
                          // Suaviza el ajuste de la posición y
                          const targetY = yOnPlatform - player.radius; // Destino en la pendiente
                          player.y += (targetY - player.y) * 0.1; // Aplica un factor de suavizado
  
                          player.canJump = false; // Opcional: Impedir saltar mientras resbala
                          break;
                      }
                  }
              } else if (player.x >= leftX && player.x <= rightX && player.y + player.radius >= yOnPlatform && player.y - player.radius / 3 <= yOnPlatform) {
                  // Suaviza el ajuste para pendientes no empinadas
                  const targetY = yOnPlatform - player.radius;
                  player.y += (targetY - player.y) * 0.1; // Aplica un factor de suavizado
  
                  player.velocityY = 0;
                  player.isGrounded = true;
                  slopeCollisionDetected = true;
                  player.canJump = true;
                  break;
              }
          }
  
          if (!slopeCollisionDetected && player.isGrounded) {
              player.isGrounded = false;
              player.canJump = true;
          }
      }
  
      lerp(start, end, t) {
          return start + (end - start) * t;
      }
  
  }
  */

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
    }

}