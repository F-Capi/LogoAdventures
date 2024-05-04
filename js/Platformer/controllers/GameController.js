import { Renderer } from "../views/Renderer.js";
import { Player } from "../models/Player.js";
import { HandleInput } from "./HandleInput.js";
import { PhysicsEngine } from "./PhysicsEngine.js";
import { Resizer } from "../views/Resizer.js";
import { platformsData } from '../data/platforms.js';
import { PlatformManager } from './PlatformManager.js';
import { AnimationController } from "./AnimationController.js";
import { GameObject } from "../models/GameObject.js";
import { InteractionController } from "./InteractionController.js";
import { Interactive } from "../models/Interactive.js";
import { Loader } from "../models/Loader.js";

let renderer, player, platformManager, inputHandler, physicsEngine, resizer, anim, lastFrameTime, terminalObject;

let interactions;
let gameObjects = [];

function gameLoop() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastFrameTime) / 1000;
    inputs(deltaTime);
    physicsEngine.update(player, deltaTime);
    interactions.checkCollisions();
    renderer.clear();
    renderer.drawPlatforms(platformManager);
    renderer.drawGameObjects(gameObjects);
    renderer.drawPlayer(player);
    anim.update(deltaTime);
    player.updateAnimationFrame(deltaTime);
    renderer.drawInfo("can jump", player.canJump);
    lastFrameTime = currentTime;
    requestAnimationFrame(gameLoop);
}

function inputs(deltaTime) {
    if (inputHandler.isKeyPressed('ArrowLeft')) {
        player.movePlayer(-1, deltaTime);
        player.setDirection(-1);
        player.setMoving(true);
    } else if (inputHandler.isKeyPressed('ArrowRight')) {
        player.movePlayer(1, deltaTime);
        player.setDirection(1);
        player.setMoving(true);
    } else {
        player.setMoving(false);
    }
    if (inputHandler.isKeyPressed('Space')) {
        player.jump(anim);
    }
}


let loader = new Loader();
loader.addImage("player", "../artArchive/spritesheet.png");
loader.addImage("computer", "../artArchive/computer.png");
loader.addImage("globo", "../artArchive/globo.png");

window.onload = function () {
    loader.loadAll(() => {
        console.log("Imagen cargada con éxito");
        const canvas = document.getElementById('gameCanvas');
        renderer = new Renderer(canvas, loader.getImage("player"));
        player = new Player(300, 0, 30, '#39ff14');

        terminalObject = new Interactive(355, 175, loader.getImage("computer"), 50, 50);
        let terminalObject2 = new Interactive(800, 180, loader.getImage("computer"), 50, 50);
        let globo = new GameObject(355, 125, loader.getImage("globo"), 50, 50, false);
        gameObjects.push(terminalObject);
        gameObjects.push(terminalObject2);
        gameObjects.push(globo);
        interactions = new InteractionController(canvas, gameObjects, player, globo);
        platformManager = new PlatformManager();
        platformsData.forEach(p => {
            platformManager.addPlatform(p.x1, p.y1, p.x2, p.y2);
        });
        inputHandler = new HandleInput();
        physicsEngine = new PhysicsEngine(platformManager.platforms);
        resizer = new Resizer(canvas, player, platformManager, gameObjects);
        anim = new AnimationController(player);


        lastFrameTime = Date.now();
        gameLoop();
    });
}

