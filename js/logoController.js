let logoCanvas = document.getElementById("LogoCanvas");
let ctx = logoCanvas.getContext('2d');

let turtle = {
    posX: Math.round(logoCanvas.clientWidth / 2),
    posY: Math.round(logoCanvas.clientHeight / 2),
    radius: 15,
    direction: 90,
}

function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
}

function radiansToDegrees(angle) {
    return angle * (180 / Math.PI);
}
function draw() {
    drawBackground();
    //drawTurtle();
}
function drawBackground() {

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);
}

function drawTurtle() {
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(turtle.posX, turtle.posY, turtle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function resetTurtle() {
    turtle.posX = Math.round(logoCanvas.clientWidth / 2);
    turtle.posY = Math.round(logoCanvas.clientHeight / 2);
    turtle.direction = 90;

    ctx.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, logoCanvas.width, logoCanvas.height);

}

function moveForward(steps) {
    let deltaX = steps * Math.cos(degreesToRadians(turtle.direction));
    let deltaY = -steps * Math.sin(degreesToRadians(turtle.direction));

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(turtle.posX, turtle.posY);

    turtle.posX += deltaX;
    turtle.posY += deltaY;

    ctx.lineTo(turtle.posX, turtle.posY);
    ctx.stroke();
    ctx.closePath();

    //drawTurtle();
}
function moveBackwards(steps) {
    let deltaX = -steps * Math.cos(degreesToRadians(turtle.direction));
    let deltaY = steps * Math.sin(degreesToRadians(turtle.direction));

    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(turtle.posX, turtle.posY);

    turtle.posX += deltaX;
    turtle.posY += deltaY;

    ctx.lineTo(turtle.posX, turtle.posY);
    ctx.stroke();
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
