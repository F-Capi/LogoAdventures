export class Renderer {
    constructor(canvas, spriteSheetSrc) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.spriteSheet = spriteSheetSrc;
        this.spriteWidth = 149; // Ancho de cada sprite en el spritesheet
        this.spriteHeight = 180; // Altura de cada sprite
    }
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = 'gray';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawPlayer(player) {
        let frameX = this.spriteWidth * player.currentFrame;
        let frameY = 0;

        // Calcular la escala y la posición ajustada basada en el radio del jugador
        let spriteScale = player.radius * 2 / this.spriteHeight; // Asumiendo que el radio corresponde a la altura del sprite
        let scaledSpriteWidth = this.spriteWidth * spriteScale;
        let scaledSpriteHeight = this.spriteHeight * spriteScale;

        // Calcular la posición ajustada para alinear el centro del sprite con el centro del collider del jugador
        let adjustedX = player.x - scaledSpriteWidth / 2;
        let adjustedY = player.y - scaledSpriteHeight / 2;





        if (player.direction === 1) {
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(
                this.spriteSheet,
                frameX, frameY,
                this.spriteWidth, this.spriteHeight,
                -adjustedX - scaledSpriteWidth, adjustedY, // Ajuste para el flip horizontal
                scaledSpriteWidth, scaledSpriteHeight
            );
            this.ctx.restore();
        } else {
            this.ctx.drawImage(
                this.spriteSheet,
                frameX, frameY,
                this.spriteWidth, this.spriteHeight,
                adjustedX, adjustedY,
                scaledSpriteWidth, scaledSpriteHeight
            );
        }
        /*this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
        this.ctx.stroke();*/
    }


    drawPlatforms(platformManager) {

        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = platformManager.lineWidth;
        this.ctx.lineCap = "round";
        for (const platform of platformManager.platforms) {

            this.ctx.beginPath();
            this.ctx.moveTo(platform.x1, platform.y1);
            this.ctx.lineTo(platform.x2, platform.y2);
            this.ctx.stroke();
        }

    }
    drawInfo(text, prop) {
        this.ctx.fillStyle = 'black';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`${text}: ${prop}`, 10, 30);

    }

    drawGameObjects(objs) {

        objs.forEach(obj => {
            if (obj.visible) {
                let spriteScale = obj.radius * 2 / obj.sprite.height;
                let scaledSpriteWidth = obj.sprite.width * spriteScale;
                let scaledSpriteHeight = obj.sprite.height * spriteScale;

                let adjustedX = obj.x - scaledSpriteWidth / 2;
                let adjustedY = obj.y - scaledSpriteHeight / 2;

                this.ctx.drawImage(obj.sprite, adjustedX, adjustedY, scaledSpriteWidth, scaledSpriteHeight);
            }
        });


        //this.ctx.beginPath();
        //this.ctx.arc(obj.x, obj.y, obj.radius, 0, Math.PI * 2);
        //this.ctx.stroke();
    }
}