var stage = {};
var certificate = [];
var certifiedText = null;

function checkStage() {
    // Expected certificate is an array of edges, representing the path followed
    // from start to end

    stage = JSON.parse(document.getElementById("stageTextArea").value);
    certificate = JSON.parse(document.getElementById("certificateTextArea").value);

    var check = verifyCertificate();

    if (check) {
      document.getElementById("certifiedTextPara").innerHTML = 'Yes!';
    } else {
      document.getElementById("certifiedTextPara").innerHTML = 'No :(';
    };
}

function verifyCertificate() {
    // Add a source island to the stage to make algorithm simpler
    // Source inserted to end of islands since -1 goes to last index
    var newIsland = {
        "c": 0, "e": 1
    };
    stage["islands"].push(newIsland);

    var newEdge = [
      0, stage["start"]
    ];
    stage["portals"].push(newEdge);
    certificate.splice(0, 0, newEdge);

    var current = 0;
    var currEnergy = 1;
    var numWithCoins = stage["islands"].filter(function(x) {return x["c"] > 0}).length;
    var edge = null;

    for (var i = 0; i < certificate.length; i++) {
        edge = certificate[i];

        // Check that the step is valid
        if (current != edge[0] || currEnergy == 0 || !(has(stage["portals"], edge) || has(stage["portals"], edge.reverse()))) {
            return false;
        }

        // execute step
        current = edge[1];
        currEnergy = currEnergy - 1 + stage["islands"][current - 1]["e"];
        stage["islands"][current - 1]["e"] = 0;

        if (stage["islands"][current - 1]["c"] > 0) {
            numWithCoins = numWithCoins - 1;
            stage["islands"][current - 1]["c"] = 0;
        }
    };

    if (numWithCoins > 0 || current != stage["goal"]) {
      return false;
    }

    return true;
}

function has(portals, edge) {
    for (var i = 0; i < portals.length; i++) {
        if ((portals[i][0] == edge[0] && portals[i][1] == edge[1]) ||
            (portals[i][0] == edge[1] && portals[i][1] == edge[0])) {
            return true;
        }
    }
    return false;
}
