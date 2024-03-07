const testEvent = {
    region: "Sweden",
    text: "Armada competes in the US for the first time at Genesis. He places 2nd and makes Sweden a legitimate threat in Melee" 
}

const testEvent2 = {
    region: "US West",
    text: "Mango is da goat" 
}

const testEvent3 = {
    region: "Japan",
    text: "Captain Jack travels from Japan to compete in the US for the first time. This marks the first time a non-American travels to compete. Captain Jack put on a stellar performance and was ranked 2nd overall"
}

function generateEvent(event) {
    const panel = document.getElementById("right-panel");
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = event.text;
    panel.appendChild(div);

    div.onmouseover = function() {
        highlightRegion(event.region);
    }

    div.onmouseout = function() {
        unhighlightRegion(event.region);
    }
}

generateEvent(testEvent);
generateEvent(testEvent2);
generateEvent(testEvent3);
