let logoCanvas = document.getElementById("LogoCanvas");
let ctx = logoCanvas.getContext('2d');

let turtleCanvas = document.getElementById("turtleCanvas");
let ctxTurtle = turtleCanvas.getContext('2d'); // Co

let turtle = {
    posX: Math.round(logoCanvas.clientWidth / 2),
    posY: Math.round(logoCanvas.clientHeight / 2),
    radius: 15,
    direction: 90,
    pen: true,
    color: "black",
    pensize: 3,
    grid: null,
    speed: null
}


const colors = [
    "white",
    "yellow",
    "pink",
    "red",
    "gray",
    "blue",
    "green",
    "purple",
    "orange",
    "brown",
    "ivory",
    "darkblue",
    "darkcyan",
    "darkgoldenrod",
    "darkgreen",
    "black"
];

let turtleImage = new Image();
turtleImage.src = 'turtle2.png'; let currentExecutionToken;

function generateExecutionToken() {
    return Symbol("executionToken");
}

function delay() {
    const executionToken = currentExecutionToken;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (executionToken !== currentExecutionToken) {
                reject('Execution cancelled');
            } else {
                resolve();
            }
        }, turtle.speed);
    });
}
function drawGrid() {
    // Guarda el estado actual del canvas
    ctxTurtle.save();


    // Dibuja la cuadrícula
    ctxTurtle.beginPath();
    for (var x = 0; x <= turtleCanvas.width; x += 50) {
        ctxTurtle.moveTo(x, 0);
        ctxTurtle.lineTo(x, turtleCanvas.height);
    }
    for (var y = 0; y <= turtleCanvas.height; y += 50) {
        ctxTurtle.moveTo(0, y);
        ctxTurtle.lineTo(turtleCanvas.width, y);
    }
    ctxTurtle.strokeStyle = "black";
    ctxTurtle.lineWidth = 0.5;
    ctxTurtle.stroke();
    ctxTurtle.closePath();

    // Restaura el estado del canvas
    ctxTurtle.restore();
}

function dibujarImagen() {
    const scaleFactor = 0.7;

    ctxTurtle.clearRect(0, 0, turtleCanvas.width, turtleCanvas.height);
    if (turtle.grid) {
        drawGrid();
    }
    var x = turtle.posX;
    var y = turtle.posY;
    ctxTurtle.save();
    ctxTurtle.translate(x, y);
    ctxTurtle.rotate((90 - turtle.direction) * Math.PI / 180);

    const scaledWidth = turtleImage.width * scaleFactor;
    const scaledHeight = turtleImage.height * scaleFactor;

    ctxTurtle.drawImage(turtleImage, -scaledWidth / 2, -scaledHeight / 2, scaledWidth, scaledHeight);

    ctxTurtle.restore();
}

function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
}

function radiansToDegrees(angle) {
    return angle * (180 / Math.PI);
}



function drawBackground() {

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);
}

function resetTurtle() {
    turtle.posX = Math.round(logoCanvas.clientWidth / 2);
    turtle.posY = Math.round(logoCanvas.clientHeight / 2);
    turtle.color = "black";
    turtle.pen = true;
    turtle.pensize = 3;
    turtle.direction = 90;

    ctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);


    dibujarImagen();
}

function moveForward(steps) {

    let deltaX = steps * Math.cos(degreesToRadians(turtle.direction));
    let deltaY = -steps * Math.sin(degreesToRadians(turtle.direction));


    ctx.beginPath();
    ctx.moveTo(turtle.posX, turtle.posY);

    turtle.posX += deltaX;
    turtle.posY += deltaY;

    if (turtle.pen) {

        ctx.lineWidth = turtle.pensize;
        ctx.strokeStyle = turtle.color;
        ctx.lineTo(turtle.posX, turtle.posY);
        ctx.stroke();
    }

    ctx.closePath();
    dibujarImagen();
}
function moveBackwards(steps) {
    let deltaX = -steps * Math.cos(degreesToRadians(turtle.direction));
    let deltaY = steps * Math.sin(degreesToRadians(turtle.direction));

    ctx.beginPath();
    ctx.moveTo(turtle.posX, turtle.posY);

    turtle.posX += deltaX;
    turtle.posY += deltaY;

    if (turtle.pen) {

        ctx.lineWidth = turtle.pensize;
        ctx.strokeStyle = turtle.color;
        ctx.lineTo(turtle.posX, turtle.posY);
        ctx.stroke();
    }

    ctx.closePath();
    dibujarImagen();
}


function turnRight(angle) {
    turtle.direction -= angle;
    turtle.direction = (turtle.direction + 360) % 360;
    dibujarImagen();
}

function turnLeft(angle) {
    turtle.direction += angle;
    turtle.direction = turtle.direction % 360;
    dibujarImagen();
}
function tooglePen(value) {
    turtle.pen = value;
}

function changeColor(value) {
    turtle.color = colors[value - 1];
}

function changePenSize(value) {
    turtle.pensize = value;
}

turtleImage.onload = function () {
    drawBackground();
    dibujarImagen();
};
document.getElementById('startButton').addEventListener('click', async function () {
    currentExecutionToken = generateExecutionToken(); // Genera un nuevo token
    var startBlock = workspace.getAllBlocks().find(block => block.type === 'start');
    if (!startBlock) {
        resetTurtle();
        console.error("No se encontró el bloque 'start'.");
        return;
    }

    var code = Blockly.JavaScript.blockToCode(startBlock);
    console.log(code);
    try {
        resetTurtle();
        await eval('(async () => {' + code + '})()');
    } catch (e) {
        if (e !== 'Execution cancelled') {
            alert('Error en el código generado: ' + e);
        }
    }
});
turtleImage.onload = function () {
    drawBackground();
    turtle.grid = document.getElementById('gridCheckbox').checked;
    turtle.speed = document.getElementById('retroSlider').value;
    dibujarImagen();
};

document.getElementById('gridCheckbox').addEventListener('change', function () {
    turtle.grid = this.checked;
    dibujarImagen();
});

document.getElementById('retroSlider').addEventListener('input', function () {
    turtle.speed = this.value;
});