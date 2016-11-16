import json, sys

"""
    input format:
    {
        "stage": {
            "start": start_island,
            "goal": goal_island,
            "islands":[
                {"c": num_coins, "e": num_energy},
                {"c": num_coins, "e": num_energy},
                ...
            ],
            "portals":[
                [endpt1, endpt2],
                [endpt1, endpt2],
                ...
            ]
        },
        "certificate": [
            [endpt1, endpt2],
            [endpt1, endpt2],
            ...
        ]
    }
"""

inp = json.loads(sys.stdin.read())

stage = inp["stage"]
certificate = inp["certificate"]

def verify_certificate(stage, certificate):
    # Add a source island to the stage to make algorithm simpler
    # Source inserted to end of islands since -1 goes to last index
    stage["islands"].append({
        "c": 0, "e": 1
    })
    stage["portals"].append([
        0, stage["start"]
    ])
    certificate.insert(0, [
        0, stage["start"]
    ])

    current = 0
    curr_en = 1
    num_with_coins = len(filter(lambda x: x["c"] > 0, stage["islands"]))

    for edge in certificate:
        # Check that the step is valid
        if current != edge[0] or curr_en == 0 or not (edge in stage["portals"] or edge[::-1] in stage["portals"]):
            return False

        # execute step
        current = edge[1]
        curr_en = curr_en - 1 + stage["islands"][current - 1]["e"]
        stage["islands"][current - 1]["e"] = 0

        if stage["islands"][current - 1]["c"] > 0:
            num_with_coins = num_with_coins - 1
            stage["islands"][current - 1]["c"] = 0

    if num_with_coins > 0:
        return False

    if current != stage["goal"]:
        return False

    return True

print verify_certificate(stage, certificate)
