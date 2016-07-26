
function generateStage(stageString) {

    borderWidth = 60;

    function decideIslandSize(nEnergy, nCoins, nEdges) {
        var nItems = nEnergy + nCoins;
        var sizeX = Math.max(Math.ceil(Math.sqrt(nItems) + (Math.random()*5-2)), 1);
        var sizeY = Math.ceil(nItems / sizeX);

        var width = sizeX * 60 + 2*borderWidth;
        var height = sizeY * 60 + 2*borderWidth;
        return [width, height];
    }

    function randomPointOnIsland(x1, y1, x2, y2) {
        var x = Math.random()*((x2-x1)-2*borderWidth) + x1 + borderWidth;
        var y = Math.random()*((y2-y1)-2*borderWidth) + y1 + borderWidth;
        return [x,y];
    }


    data = JSON.parse(stageString);
    //console.log(data);

    var nIslands = data.islands.length;
    var nPortals = data.portals.length;

    islandDimensionss = [];
    edgeLists = [];
    edgeLists.length = nIslands;
    islandDimensionss.length = nIslands;
    for (var i=0;i<nIslands;++i) {
        edgeLists[i] = [];
    }

    data.portals.forEach(function(portal) {
        portal[0]--;
        portal[1]--;

        edgeLists[portal[0]].push(portal[1]);
        edgeLists[portal[1]].push(portal[0]);
    });
    
    var i = 0;
    data.islands.forEach(function(island) {
        islandDimensionss[i] = decideIslandSize(island.e, island.c, edgeLists[i].length);
        ++i;
    });


    // Setup Graph Layout
    var g = new dagre.graphlib.Graph();
    // Set an object for the graph label
    g.setGraph({});
    g.graph().ranksep = 15;
    g.graph().nodesep = 25;
    g.graph().marginx = 50;
    g.graph().marginy = 50;
    
    // Default to assigning a new object as a label for each new edge.
    g.setDefaultEdgeLabel(function() { return {}; });

    // Add nodes to the graph.
    for (var i=0; i<nIslands; ++i) {
        var dim = islandDimensionss[i];
        g.setNode(i, {label:i, width:dim[0], height:dim[1]});
    }

    // Add edges to the graph.
    for (var i=0;i<nIslands;++i) {
        edgeLists[i].forEach(function(j) {
            if (i >= j) return;
            g.setEdge(i, j);
        });
    }

    dagre.layout(g);


    // Setup Stage
    var stage = new Stage();
    stage.islands.length = nIslands;
    stage.portalEdges.length = nPortals;

    g.nodes().forEach(function(v) {
        var node = g.node(v);
        var index = node.label;

        var island = new Island(node.x - node.width/2, node.y - node.height/2,
                                node.x + node.width/2, node.y + node.height/2,
                                index);

        for (var i=0;i<data.islands[index].e;++i) {
            var position = randomPointOnIsland(island.x1, island.y1, island.x2, island.y2);
            island.items.push(new PickupEnergy(position[0], position[1], index));
        }

        for (var i=0;i<data.islands[index].c;++i) {
            var position = randomPointOnIsland(island.x1, island.y1, island.x2, island.y2);
            island.items.push(new PickupCoin(position[0], position[1], index));
        }

        stage.islands[index] = island;
        //console.log("Node " + v + ": " + JSON.stringify(g.node(v)));
    });

    var edgeIndex = 0;
    g.edges().forEach(function(e) {
        var edge = g.edge(e);
        pointV = edge.points[0];
        pointW = edge.points[edge.points.length-1];

        stage.portalEdges[edgeIndex] = new PortalEdge(e.v, e.w, edgeIndex, edge.points);
        stage.islands[e.v].portals.push(new Portal(pointV.x, pointV.y, e.v, e.w, edgeIndex));
        stage.islands[e.w].portals.push(new Portal(pointW.x, pointW.y, e.w, e.v, edgeIndex));
        edgeIndex++;

        //console.log("Edge " + e.v + " -> " + e.w + ": " + JSON.stringify(g.edge(e)));
    });

    stage.startIsland = data.start - 1;

    var goalIsland = stage.islands[data.goal - 1];
    stage.goalDoor = new GoalDoor((goalIsland.x1+goalIsland.x2)/2, goalIsland.y1+5, goalIsland.v);

    return stage;
}