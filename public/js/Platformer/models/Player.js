export class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = 100;
        this.velocityY = 0;
        this.gravity = 1000;
        this.jumpForce = -400;
        this.canJump = false;
        this.isGrounded = false;
        this.isMoving = false;
        this.color = color;
        this.velocityX = 0;
        this.direction = 1;
        // propiedades movidas a AnimationController
        this.currentFrame = 0; // Índice del frame actual
        this.animating = false; // Si está en proceso de animación
        this.frameInterval = 200; // Intervalo de tiempo para cambiar frames (ms)
        this.animationTimer = 0; // Temporizador para controlar cambios de frame 
        this.totalFrames = 9;
    }
    setDirection(arg) {
        this.direction = arg;
    }
    movePlayer(direction, deltaTime) {
        this.x += direction * this.speed * deltaTime;
    }
    jump(animationController) {
        if (this.isGrounded && this.canJump) {
            this.velocityY = this.jumpForce;
            this.isGrounded = false;
            animationController.resetJumpAnimation();
        }
    }
    setMoving(arg) {
        this.isMoving = arg;
    }
    //codigo movido a AnimationController
    setAnimating(value) {
        this.animating = value;
    }

    updateAnimationFrame(deltaTime) {
        // Convertir deltaTime a milisegundos
        this.animationTimer += deltaTime * 1000;

        if (this.animationTimer >= this.frameInterval) {
            this.animationTimer = 0;

            if (this.animating) {
                // Incrementar el índice de frame si se está animando
                this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
            }
        }
    }
}

