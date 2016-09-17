
var Stage = function() {
    this.islands = [];
    this.portalEdges = [];
    this.startIsland = -1;
    this.focusedPortal = -1;
    this.numCoins = 0;
    this.messageExpireTime = null;
}

Stage.prototype = {
    drawUI: function(stage, player) {
        drawText(player.coins + ' / ' + stage.numCoins, 20, 20, 30, '#ffffff');

        var baseX = 120;
        var baseY = 25;
        var radius = 9;
        var spacing = 25;
        var nCols = Math.ceil((RES_X-2*baseX) / spacing);
        for (var i=0;i<player.energy;++i) {
            var x = i%nCols;
            var y = Math.floor(i/nCols);
            drawCircle(baseX + x*spacing, baseY + y*spacing, radius, '#00ffff');
        }

        if (this.messageExpireTime != null) {
            if (Date.now() <= this.messageExpireTime) {
                this.drawErrorMessage();
            } else {
                this.messageExpireTime = null;
            }
        }
    },

    drawStageClear: function() {
        drawTextCentered('STAGE CLEAR', 60, RES_X/2, RES_Y/2, '#fff040');
    },

    triggerErrorMessage: function(message, secondaryMessage, colour, duration) {
        this.messageExpireTime = Date.now() + duration;
        this.errorMessage = message;
        this.secondaryMessage = secondaryMessage;
        this.messageColour = colour;
    },

    drawErrorMessage: function() {
        drawTextCentered(this.errorMessage, 30, RES_X/2, RES_Y/2, this.messageColour);
        drawTextCentered(this.secondaryMessage, 26, RES_X/2, RES_Y/2+40, this.messageColour);
    },
}


var portal_radius = 12;
var pickup_radius = 12;
var draw = function(camera) {
    return function(v){v.draw(camera)};
}
var update = function(stage) {
    return function(v){v.update(stage)};
}

var Camera = function(stage) {
    this.x = 0;
    this.y = 0;

    this.isZoomingOut = false;
    this.defaultZoomedOut = false;

    // 0 = zoomed in, 1 = zoomed out.
    this.zoom = 0;
    this.computeBounds(stage);
}

Camera.prototype = {
    computeBounds: function(stage) {
        var pad = 50;
        var minX = stage.islands[0].x1;
        var maxX = stage.islands[0].x2;
        var minY = stage.islands[0].y1;
        var maxY = stage.islands[0].y2;

        stage.islands.forEach(function(isl) {
            if (isl.x1 < minX) minX = isl.x1;
            if (isl.x2 > maxX) maxX = isl.x2;
            if (isl.y1 < minY) minY = isl.y1;
            if (isl.y2 > maxY) maxY = isl.y2;
        });

        stage.portalEdges.forEach(function(portalEdge) {
            portalEdge.points.forEach(function(p) {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            })
        });

        minX -= pad;
        maxX += pad;
        minY -= pad;
        maxY += pad;

        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
        this.mapCenterX = (minX+maxX)/2;
        this.mapCenterY = (minY+maxY)/2;

        this.zoomOutRatio = Math.max((maxX-minX)/RES_X, (maxY-minY)/RES_Y);
    },

    moveTowards: function(player) {
        this.x += 0.3 * (player.x - this.x);
        this.y += 0.3 * (player.y - this.y);
    },

    adjustZoom: function() {
        this.isZoomingOut = keyPressed[90] != this.defaultZoomedOut;
        if (keyClicked[16]) this.defaultZoomedOut = !this.defaultZoomedOut;

        if (this.isZoomingOut) {
            this.zoom += 0.05;
            if (this.zoom > 0.98) this.zoom = 0.98;
        }
        else {
            this.zoom -= 0.05;
            if (this.zoom < 0.3) this.zoom = 0.3;
        }

    },

    update: function(stage, player) {
        this.moveTowards(player);
        this.adjustZoom();

        var z = this.zoom;
        this.cx = this.x*(1-z) + this.mapCenterX*z;
        this.cy = this.y*(1-z) + this.mapCenterY*z;
        this.ratio = 1 / ((1-z) + this.zoomOutRatio*z);
    },

    absToRel: function(x, y) {
        return [(x - this.cx)*this.ratio + RES_X/2, (y - this.cy)*this.ratio + RES_Y/2];
    },

    absToRelX: function(x) {
        return (x - this.cx)*this.ratio + RES_X/2;
    },

    absToRelY: function(y) {
        return (y - this.cy)*this.ratio + RES_Y/2;
    },

    absToRelScale: function(s) {
        return s*this.ratio;
    },
}

var Player = function(stage) {
    this.v = stage.startIsland;
    var island = stage.islands[this.v];

    this.x = (island.x1+island.x2)/2;
    this.y = island.y2 - 5;
    this.radius = 20;
    this.pickupRange = 20;
    this.speed = 7;
    this.energy = 0;
    this.coins = 0;
}

Player.prototype = {
    draw: function(camera) {
        var relX = camera.absToRelX(this.x);
        var relY = camera.absToRelY(this.y);

        drawCircle(relX, relY, camera.absToRelScale(this.radius+6), '#808080');
        drawCircle(relX, relY, camera.absToRelScale(this.radius+3), '#ffffff');
        drawCircle(relX, relY, camera.absToRelScale(this.radius), '#ffc0c0');
    },

    updateMovement: function(stage) {
        // Up: 38
        // Down: 40
        // Left: 37
        // Right: 39
        if (keyPressed[38]) this.y -= this.speed;
        if (keyPressed[40]) this.y += this.speed;
        if (keyPressed[37]) this.x -= this.speed;
        if (keyPressed[39]) this.x += this.speed;

        var island = stage.islands[this.v];
        if (this.x < island.x1) this.x = island.x1;
        if (this.x >= island.x2) this.x = island.x2;
        if (this.y < island.y1) this.y = island.y1;
        if (this.y >= island.y2) this.y = island.y2;
    },

    updateCollision: function(stage) {
        var island = stage.islands[this.v];
        var this_x = this.x;
        var this_y = this.y;
        var this_radius = this.radius;

        for (var i=0;i<island.items.length;++i) {
            var item = island.items[i];
            if (!item.isActive) continue;
            var dx = item.x - this.x;
            var dy = item.y - this.y;
            var r = item.radius + this.radius + this.pickupRange;

            if (dx*dx+dy*dy <= r*r) {
                item.isActive = false;
                switch(item.type) {
                case 'energy':
                    this.energy++;
                    break;
                case 'coin':
                    this.coins++;
                    break;
                }
                //console.log('take ' + item.type);
            }
        }

        var closestDistance = this.radius + portal_radius;
        closestDistance = closestDistance*closestDistance;
        var closestPortal = -1;
        for (var i=0;i<island.portals.length;++i) {
            var portal = island.portals[i];

            var dx = portal.x - this_x;
            var dy = portal.y - this_y;
            var dist = dx*dx+dy*dy;
            if (dist < closestDistance) {
                closestDistance = dist;
                closestPortal = portal.edgeIndex;
            }
        }
        stage.focusedPortal = closestPortal;
    },

    updateTeleport: function(stage) {
        if (keyClicked[32] && stage.focusedPortal != -1) {
            if (this.energy > 0) {
                this.energy--;
                var edgeIndex = stage.focusedPortal;
                var edge = stage.portalEdges[edgeIndex];
                var targetV = edge.v1;
                if (edge.v1 == this.v) targetV = edge.v2;

                this.v = targetV;
                var island = stage.islands[targetV];
                for (var i=0;i<island.portals.length;++i) {
                    var portal = island.portals[i];
                    if (portal.edgeIndex == edgeIndex) {
                        this.x = portal.x;
                        this.y = portal.y;
                    }
                }

            } else {
                console.log("Not enough energy! " + this.energy);
                stage.triggerErrorMessage("Not enough energy!", "Collect energy pellets to use warps", "#c0ffff", 2000);
            }
        }
    },

    updateDoor: function(stage) {
        var door = stage.islands[this.v].door;
        if (door == null) return;
        if (this.x >= door.x1 && this.x <= door.x2 && this.y >= door.y1 && this.y <= door.y2) {
            if (this.coins < stage.numCoins) {
                if (keyClicked[32]) {
                    stage.triggerErrorMessage("Not enough coins.", "You must collect all coins before exiting.", "#ffff40", 2000);
                }
            } else {
                stageClear();
            }
        }
    },

    update: function(stage) {
        this.updateMovement(stage);
        this.updateCollision(stage);
        this.updateTeleport(stage);
        this.updateDoor(stage);
    },

}

var GoalDoor = function(x, y, v) {
    var width = 60;
    var height = 60;
    this.x1 = x - width/2;
    this.y1 = y - height/2;
    this.x2 = x + width/2;
    this.y2 = y + height/2;

    this.v = v;
}

GoalDoor.prototype = {
    draw: function(camera) {
        var relX1 = camera.absToRelX(this.x1);
        var relX2 = camera.absToRelX(this.x2);
        var relY1 = camera.absToRelY(this.y1);
        var relY2 = camera.absToRelY(this.y2);

        drawRect(relX1-5, relY1-5, relX2-relX1+10, relY2-relY1+10, '#40a0df');
        drawRect(relX1, relY1, relX2-relX1, relY2-relY1, '#4060ef');
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
    this.door = null;
}

Island.prototype = {
    draw: function(camera) {
        var relX1 = camera.absToRelX(this.x1);
        var relX2 = camera.absToRelX(this.x2);
        var relY1 = camera.absToRelY(this.y1);
        var relY2 = camera.absToRelY(this.y2);

        drawRect(relX1, relY1, relX2-relX1, relY2-relY1, '#0a1a80');
        if (this.door != null) this.door.draw(camera);
        this.portals.forEach(draw(camera));
        this.items.forEach(draw(camera));
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
    draw: function(camera) {
        var relX = camera.absToRelX(this.x);
        var relY = camera.absToRelY(this.y);
        var relRad = camera.absToRelScale(this.radius);

        drawCircle(relX, relY, relRad, '#ff4000');
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
    draw: function(camera) {
        if (!this.isActive) return;
        var relX = camera.absToRelX(this.x);
        var relY = camera.absToRelY(this.y);
        var relRad = camera.absToRelScale(this.radius);

        drawCircle(relX, relY, relRad, '#20f0ff');
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
    draw: function(camera) {
        if (!this.isActive) return;
        var relX = camera.absToRelX(this.x);
        var relY = camera.absToRelY(this.y);
        var relRad = camera.absToRelScale(this.radius);

        drawCircle(relX, relY, relRad, '#fff000');
    },
}


var PortalEdge = function(v1, v2, edgeIndex, points) {
    this.v1 = v1;
    this.v2 = v2;
    this.edgeIndex = edgeIndex;
    this.points = points;
    this.focused = false;
}

var convertPoint = function(camera) {
    return function(point) {
        return {
            x: camera.absToRelX(point.x),
            y: camera.absToRelY(point.y),
        };
    };
};

PortalEdge.prototype = {
    draw: function(camera) {
        var points = this.points.map(convertPoint(camera));
        var thickness = camera.absToRelScale(10);

        if (this.focused) {
            drawCurve(points, thickness, '#d0d000');
        } else {
            drawCurve(points, thickness, '#a00000');
        }
    },

    update: function(stage) {
        this.focused = (stage.focusedPortal == this.edgeIndex);
    },
}