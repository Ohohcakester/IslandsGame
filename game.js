// REGION - HTML5 CANVAS BOILERPLATE - START
var width = 600;
var height = 500;
var gLoop;

// Initialisation
var mainCanvas = document.getElementById('mainCanvas');
var canvasRect = mainCanvas.getBoundingClientRect();
var ctx = mainCanvas.getContext('2d');

var win = document.getElementById('window');
window.addEventListener("keydown", keyboardPress, false);
window.addEventListener("keyup", keyboardRelease, false);
window.addEventListener("click", mouseClick, false);

mainCanvas.width = width;
mainCanvas.height = height;

mainCanvas.onmousedown = function(){
  return false;
};

// REGION - HTML5 CANVAS BOILERPLATE - END

// REGION - GAME LOGIC - START

var game = new function() {
    this.stage = null;
    this.player = null;
}



// REGION - GAME LOGIC - END
function initGameFromTextArea() {
    initGame(document.getElementById("stageTextArea").value);
}


function initGame(stageString) {
    game.stage = generateStage(stageString);
    redraw();
}

function withinScreen(relX, relY) {
    return relX >= 0 && relY >= 0 && relX <= width && relY <= height;
}

function mouseClick(e) {
    var mouseX = e.clientX - canvasRect.left;
    var mouseY = e.clientY - canvasRect.top;
    if (!withinScreen(mouseX, mouseY)) return;
}

function keyboardRelease(e) {
    return;
    keyPressed[getKeyIndex(e)] = false;
}

function afterMove() {
    if (isType(tiles[playerY][playerX], item_goal)) {
        winGame();
    }
}

function keyboardPress(e) {
    //console.log(e.keyCode);
    switch(e.keyCode) {
        case 38: // Up
            e.preventDefault();
            break;
    }
    redraw();
}

function updateFrame(){
}

function drawFrame(){
    if (game.stage != null) {
        game.stage.portalEdges.forEach(draw);
        game.stage.islands.forEach(draw);
    }
}

function clearScreen(){
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
};

function redraw() {
    clearScreen();
    drawFrame();
}

function gameLoop(time){
    updateFrame();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();