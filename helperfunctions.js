
function drawLine(x1, y1, x2, y2, thickness, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineWidth = thickness;
    ctx.stroke();
}

function drawCurve(points, thickness, colour) {
    ctx.strokeStyle = colour;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i=2;i<points.length;i+=2) {
        var x1 = points[i-2].x;
        var y1 = points[i-2].y;
        var x2 = points[i-1].x;
        var y2 = points[i-1].y;
        var x3 = points[i].x;
        var y3 = points[i].y;
        ctx.bezierCurveTo(x1, y1, x2, y2, x3, y3);
    }
    ctx.lineWidth = thickness;
    ctx.stroke();
}

function drawRect(x, y, width, height, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.rect(x,y,width,height);
    ctx.closePath();
    ctx.fill();
}

function drawCircle(cx, cy, radius, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.arc(cx,cy, radius, 0, 2*Math.PI, true);
    ctx.closePath();
    ctx.fill();
}

function drawPolygon(cx, cy, points, colour) {
    ctx.fillStyle = colour;
    ctx.beginPath();
    ctx.moveTo(points[0]+cx, points[1]+cy);
    for(var i=2; i<points.length; i+=2){
        ctx.lineTo(points[i]+cx, points[i+1]+cy)
    }
    ctx.closePath();
    ctx.fill();
}

function drawText(text, size, x, y, colour) {
    ctx.fillStyle = colour;
    ctx.textAlign = 'left'
    ctx.font = size+'px Georgia';
    ctx.fillText(text, x, y);
}

function drawTextCentered(text, size, x, y, colour) {
    ctx.fillStyle = colour;
    ctx.textAlign = 'center'
    ctx.font = size+'px Georgia';
    ctx.fillText(text, x, y);
}

function clearScreen() {
    ctx.fillStyle = "#000000"
    ctx.clearRect(0,0,mainCanvas.width,mainCanvas.height);
    ctx.fillRect(0,0,mainCanvas.width,mainCanvas.height);
}
