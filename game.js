// REGION - HTML5 CANVAS BOILERPLATE - START
var RES_X = 600;
var RES_Y = 500;
var fps = 60;
var nextFrameTime = 0;
var frameTime = 1000/fps;

// Initialisation
var mainCanvas = document.getElementById('mainCanvas');
var canvasRect = mainCanvas.getBoundingClientRect();
var ctx = mainCanvas.getContext('2d');

var win = document.getElementById('window');
window.addEventListener("keydown", keyboardPress, false);
window.addEventListener("keyup", keyboardRelease, false);
window.addEventListener("click", mouseClick, false);

mainCanvas.width = RES_X;
mainCanvas.height = RES_Y;

keyPressed = {
    38: false, // up
    40: false, // down
    37: false, // left
    39: false, // right
    90: false, // z
};
keyClicked = {
    32: false, // space
}

var lastDownTarget = mainCanvas;
document.addEventListener('mousedown', function(event) {
    lastDownTarget = event.target;
}, false);

// REGION - HTML5 CANVAS BOILERPLATE - END

// REGION - GAME LOGIC - START

var game = new function() {
    this.stage = null;
    this.player = null;
    this.stageCleared = false;
}



// REGION - GAME LOGIC - END
function initGameFromTextArea() {
    initGame(document.getElementById("stageTextArea").value);
}


function initGame(stageString) {
    game.stage = generateStage(stageString);
    game.player = new Player(game.stage);
    game.camera = new Camera(game.stage);
}

function stageClear() {
    game.stageCleared = true;
}

function withinScreen(relX, relY) {
    return relX >= 0 && relY >= 0 && relX <= RES_X && relY <= RES_Y;
}

function mouseClick(e) {
    var mouseX = e.clientX - canvasRect.left;
    var mouseY = e.clientY - canvasRect.top;
    if (!withinScreen(mouseX, mouseY)) return;
}

function keyboardPress(e) {
    if(lastDownTarget != mainCanvas) return;
    //console.log(e.keyCode);
    if (e.keyCode in keyPressed) {
        keyPressed[e.keyCode] = true;
        e.preventDefault();
    }
    if (e.keyCode in keyClicked) {
        keyClicked[e.keyCode] = true;
        e.preventDefault();
    }
}

function keyboardRelease(e) {
    if (e.keyCode in keyPressed) keyPressed[e.keyCode] = false;
}

function keyboardReset() {
    for (var key in keyClicked) {
        keyClicked[key] = false;
    }
}

function afterMove() {
    if (isType(tiles[playerY][playerX], item_goal)) {
        winGame();
    }
}

function updateFrame(){
    if (!game.stageCleared) {
        if (game.player != null) {
            game.player.update(game.stage);
        }
        if (game.camera != null) {
            game.camera.update(game.stage, game.player);
        }
        if (game.stage != null) {
            game.stage.portalEdges.forEach(update(game.stage));
        }
    }
    keyboardReset();
}

function drawFrame(){
    var cam = game.camera;
    if (game.stage != null) {
        game.stage.portalEdges.forEach(draw(cam));
        game.stage.islands.forEach(draw(cam));
    }
    if (game.player != null) {
        game.player.draw(cam);
    }
    if (game.stage != null) {
        game.stage.drawUI(game.stage, game.player);
        if (game.stageCleared) game.stage.drawStageClear();
    }
}

function clearScreen(){
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.rect(0, 0, RES_X, RES_Y);
    ctx.closePath();
    ctx.fill();
};

function gameLoop(time){
    while (time > nextFrameTime) {
        while (time - nextFrameTime > frameTime*5) nextFrameTime += frameTime*5;
        // Update Frame
        updateFrame();
        nextFrameTime += frameTime;
    }

    clearScreen();
    drawFrame();
    window.requestAnimationFrame(gameLoop);
}

gameLoop();