
var Stage = function() {
    this.islands = [];
    this.portalEdges = [];
    this.startIsland = -1;
    this.goalDoor = null;
}


var portal_radius = 7;
var pickup_radius = 5;
var draw = function(v){v.draw()};

var Player = function(stage) {
    this.v = stage.startIsland;
    var island = stage.islands[this.v];

    this.x = (island.x1+island.x2)/2;
    this.y = island.y2 - 5;
    this.radius = 8;
    this.energy = 0;
    this.coins = 0;
}

Player.prototype = {
    draw: function() {
        drawCircle(this.x, this.y, this.radius+4, '#808080');
        drawCircle(this.x, this.y, this.radius+2, '#ffff00');
        drawCircle(this.x, this.y, this.radius, '#80ff00');
    },

    update: function() {
        // Up: 38
        // Down: 40
        // Left: 37
        // Right: 39
        if (keyPressed[38]) this.y -= 4;
        if (keyPressed[40]) this.y += 4;
        if (keyPressed[37]) this.x -= 4;
        if (keyPressed[39]) this.x += 4;
    },

}

var GoalDoor = function(x, y, v) {
    var width = 30;
    var height = 10;
    this.x1 = x - width/2;
    this.y1 = y - height/2;
    this.x2 = x + width/2;
    this.y2 = y + height/2;
    this.width = width;
    this.height = height;

    this.v = v;
}

GoalDoor.prototype = {
    draw: function() {
        drawRect(this.x1, this.y1, this.width, this.height, '#80ff00');
    }
}


var Island = function(x1, y1, x2, y2, v) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.v = v;

    this.items = [];
    this.portals = [];
}

Island.prototype = {
    draw: function() {
        drawRect(this.x1, this.y1, this.x2-this.x1, this.y2-this.y1, '#0000ff');
        this.portals.forEach(draw);
        this.items.forEach(draw);
    },
}

var Portal = function(x, y, v, vNext, edgeIndex) {
    this.type = 'portal';
    this.x = x;
    this.y = y;
    this.radius = portal_radius;
    this.v = v;
    this.vNext = vNext;
    this.edgeIndex = edgeIndex;
}

Portal.prototype = {
    draw: function() {
        drawCircle(this.x, this.y, this.radius, '#ff8000');
    },
}

var PickupEnergy = function(x, y, v) {
    this.type = 'energy';
    this.x = x;
    this.y = y;
    this.radius = pickup_radius;
    this.v = v;
    this.isActive = true;
}

PickupEnergy.prototype = {
    draw: function() {
        drawCircle(this.x, this.y, this.radius, '#00ffff');
    },
}

var PickupCoin = function(x, y, v) {
    this.type = 'coin';
    this.x = x;
    this.y = y;
    this.radius = pickup_radius;
    this.v = v;
    this.isActive = true;
}

PickupCoin.prototype = {
    draw: function() {
        drawCircle(this.x, this.y, this.radius, '#ffff00');
    },
}


var PortalEdge = function(v1, v2, edgeIndex, points) {
    this.v1 = v1;
    this.v2 = 2;
    this.edgeIndex = edgeIndex;
    this.points = points;
}

PortalEdge.prototype = {
    draw: function() {
        drawCurve(this.points, 5, '#ff0000');
    },

}