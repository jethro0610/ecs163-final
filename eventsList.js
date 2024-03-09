let events;
let eventDivs = [];

// Load the region data and store it as a global variable
d3.json("events.json", function(data) {
    events = data;
    generateEventsForYear(2001);
});

function generateEventsForYear(year) {
    eventDivs.forEach((div) => {
        div.remove();
    })
    eventDivs = [];

    const yearEvents = events[year - 2001]; 
    yearEvents.events.forEach((event) => {
        generateEvent(event);
    })
}

function generateEvent(event) {
    const panel = document.getElementById("right-panel");
    const div = document.createElement("div");
    div.className = "event-card";
    div.innerHTML = event.text;
    panel.appendChild(div);

    div.onmouseover = function() {
        event.regions.forEach((region) => {
            highlightRegion(region);
        })
    }

    div.onmouseout = function() {
        event.regions.forEach((region) => {
            unhighlightRegion(region);
        })
    }

    eventDivs.push(div);
}
