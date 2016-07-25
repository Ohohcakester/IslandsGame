
var Stage = function() {
    this.islands = [];
    this.portalEdges = [];
}


var portal_radius = 7;
var pickup_radius = 5;
var draw = function(v){v.draw()};

var Player = function(x, y, v) {
    this.x = x;
    this.y = y;
    this.v = v;
    this.energy = 0;
    this.coins = 0;
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