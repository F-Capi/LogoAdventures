export class Renderer {
    constructor(canvas, spriteSheetSrc, initialTarget) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spriteSheet = spriteSheetSrc;
        this.spriteWidth = 149;
        this.spriteHeight = 180;
        this.target = initialTarget; // el jugador o cualquier otro objeto que sea el target inicial


        this.viewportX = this.target.x - this.canvas.width / 2;
        this.viewportY = this.target.y - this.canvas.height / 2;

        this.lerpSpeedX = 0.01; // Velocidad de la interpolación
        this.lerpSpeedY = 0.03; // Velocidad de la interpolación
    }

    setTarget(target) {
        this.target = target;
    }


    updateViewport() {
        if (!this.target) return;

        let targetX = this.target.x - this.canvas.width / 2;
        let targetY = this.target.y - this.canvas.height / 2;

        this.viewportX += (targetX - this.viewportX) * this.lerpSpeedX;
        this.viewportY += (targetY - this.viewportY) * this.lerpSpeedY;

    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayer(player) {
        this.updateViewport(); // Asegúrate de que el viewport esté actualizado antes de dibujar
        let frameX = this.spriteWidth * player.currentFrame;
        let frameY = 0;
        let spriteScale = player.radius * 2 / this.spriteHeight;
        let scaledSpriteWidth = this.spriteWidth * spriteScale;
        let scaledSpriteHeight = this.spriteHeight * spriteScale;
        let adjustedX = player.x - scaledSpriteWidth / 2 - this.viewportX;
        let adjustedY = player.y - scaledSpriteHeight / 2 - this.viewportY;

        this.ctx.save(); // Guardar el estado actual del contexto

        // Aplicar la transformación para voltear el sprite si la dirección es 1 (derecha)
        if (player.direction === 1) {
            this.ctx.translate(2 * (adjustedX + scaledSpriteWidth / 2), 0); // Mover el contexto al punto de reflexión
            this.ctx.scale(-1, 1); // Escalar en -1 en el eje X para voltear
        }

        // Dibujar el sprite del jugador
        this.ctx.drawImage(this.spriteSheet, frameX, frameY,
            this.spriteWidth, this.spriteHeight,
            adjustedX, adjustedY,
            scaledSpriteWidth, scaledSpriteHeight);

        this.ctx.restore(); // Restaurar el estado del contexto para futuros dibujos
    }

    drawPlatforms(platformManager) {
        this.updateViewport();  // Actualizar el viewport antes de dibujar
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = platformManager.lineWidth;
        for (const platform of platformManager.platforms) {
            this.ctx.beginPath();
            this.ctx.moveTo(platform.x1 - this.viewportX, platform.y1 - this.viewportY);
            this.ctx.lineTo(platform.x2 - this.viewportX, platform.y2 - this.viewportY);
            this.ctx.stroke();
        }
    }

    drawGameObjects(objs) {
        this.updateViewport();  // Actualizar el viewport antes de dibujar
        objs.forEach(obj => {
            let spriteScale = obj.radius * 2 / obj.sprite.height;
            let scaledSpriteWidth = obj.sprite.width * spriteScale;
            let scaledSpriteHeight = obj.sprite.height * spriteScale;
            let adjustedX = obj.x - scaledSpriteWidth / 2 - this.viewportX;
            let adjustedY = obj.y - scaledSpriteHeight / 2 - this.viewportY;
            this.ctx.drawImage(obj.sprite, adjustedX, adjustedY, scaledSpriteWidth, scaledSpriteHeight);
        });
    }

    drawInfo(text, prop) {
        // Dibujar texto que no se mueve con la cámara
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`${text}: ${prop}`, 10, 30);  // Este texto no sigue el viewport
    }
}
