export class GameObject {
    constructor(x, y, sprite, sizeX, sizeY, visible = true) {
        this.x = x;
        this.y = y;
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.radius = sizeY / 2;
        this.originalX = x;
        this.originalY = y;
        this.originalRadius = this.radius;
        this.collided = false;
        this.sprite = sprite;
        this.visible = visible;
    }



}