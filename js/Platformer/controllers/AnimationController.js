export class AnimationController {
    constructor(player) {
        this.player = player;
        this.state = this.getCurrentState();
        this.jumpFrames = [2, 3, 4]; // Frames para saltar
        this.runFrames = [2, 3, 4, 5, 6, 7, 8]; // Frames para correr
        this.jumpFrameIndex = 0; // Índice actual para animación de salto
        this.jumpAnimationTimer = 0; // Temporizador para controlar la animación de salto
        this.jumpFrameInterval = 200;
        this.fallingTimer = 0;
        this.fallingThreshold = 0.2;
    }
    getCurrentState(deltaTime) {
        if (this.player.velocityY < 0) {
            this.fallingTimer = 0; // Reiniciar cuando comienza a saltar
            return 'jumping';
        } else if (this.player.isGrounded) {
            this.fallingTimer = 0; // Reiniciar cuando toca el suelo
            if (!this.player.isMoving) {
                return 'idle';
            } else {
                return 'moving';
            }
        } else if (this.player.velocityY > 0) {
            this.fallingTimer += deltaTime;
            if (this.fallingTimer > this.fallingThreshold) {
                return 'falling';
            }
        }
        // Mantener el estado actual si no se cumplen las condiciones anteriores
        return this.state;
    }
    update(deltaTime) {
        this.state = this.getCurrentState(deltaTime);
        this.jumpAnimationTimer += deltaTime * 1000;

        switch (this.state) {
            case 'moving':
                this.player.setAnimating(true);
                this.player.updateAnimationFrame(deltaTime);
                break;
            case 'jumping':
                this.player.setAnimating(false);
                this.player.currentFrame = 3; // Frame fijo para caer
                break;
            case 'falling':
                this.player.setAnimating(false);
                this.player.currentFrame = 4; // Frame fijo para caer
                break;
            case 'idle':
                this.player.setAnimating(false);
                this.player.currentFrame = 0; // Frame fijo para idle
                break;
            default:
                this.player.setAnimating(false);
        }
    }
    resetJumpAnimation() {
        this.jumpFrameIndex = 0;
        this.jumpAnimationTimer = 0;
        this.player.currentFrame = this.jumpFrames[0];
    }
}