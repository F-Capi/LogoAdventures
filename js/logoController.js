let logoCanvas = document.getElementById("LogoCanvas");
let ctx = logoCanvas.getContext('2d');

let turtle = {
    posX: Math.round(logoCanvas.clientWidth / 2),
    posY: Math.round(logoCanvas.clientHeight / 2),
    radius: 15,
    direction: 90,
    pen: true,
    color: "black",
    pensize: 3
}

const colors = [
    "white",    // White
    "yellow",   // Yellow
    "pink",     // Pink
    "red",      // Red
    "gray",     // Gray
    "blue",     // Blue
    "green",    // Green
    "purple",   // Purple
    "orange",   // Orange
    "brown",    // Brown
    "ivory",    // Ivory
    "darkblue", // Dark Blue
    "darkcyan", // Dark Cyan
    "darkgoldenrod", // Dark Golden Rod
    "darkgreen", // Dark Green
    "black"   // Dark Red
];


function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
}

function radiansToDegrees(angle) {
    return angle * (180 / Math.PI);
}
function draw() {
    drawBackground();
}
function drawBackground() {

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);
}

function resetTurtle() {
    turtle.posX = Math.round(logoCanvas.clientWidth / 2);
    turtle.posY = Math.round(logoCanvas.clientHeight / 2);
    turtle.direction = 90;
    turtle.color = "black";
    turtle.pen = true;
    turtle.pensize = 3;

    ctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);

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
    //drawTurtle();
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
}


function turnRight(angle) {
    turtle.direction -= angle;
    turtle.direction = (turtle.direction + 360) % 360;
}

function turnLeft(angle) {
    turtle.direction += angle;
    turtle.direction = turtle.direction % 360;
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

draw();



document.getElementById('startButton').addEventListener('click', function () {
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    try {
        resetTurtle();
        eval(code);
        console.log(code);
    } catch (e) {
        alert('Error en el código generado: ' + e);
    }
});
