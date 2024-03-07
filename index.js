let curYear = 2001;
let highestScores;
let regionData;

function changeTime(delta) {
    const width = 800;
    const height = 600;

    const mapSvg = d3.select("#map")
        .attr("width", width)
        .attr("height", height);

    curYear += delta;
    curYear = Math.min(Math.max(curYear, 2001), 2023);

    const colorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#ededed", "red"]);

    mapSvg.selectAll("path")
        .transition()
        .attr("fill", function(d) {
            return colorScale(d.properties.scores[curYear - 2001]);
        })

    document.getElementById("year").innerHTML = curYear;
}

function generateLineGraph(region) {
    const margin = {top: 30, right: 30, bottom: 30, left: 30}
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Create the SVG container.
    var svg = d3.select("#left-panel").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    let scores; 
    regionData.features.forEach(feature => {
        if(feature.properties.name == region)
            scores = feature.properties.scores;
    });

    const lineData = [];
    for (let i = 0; i < scores.length; i++) {
        const year = i + 2001;
        if (year == 2021 || year == 2020)
            continue;

        const score = scores[i] / regionData.highestScores[i];
        lineData.push({
            score: score,
            year: year
        });
    }

    const x = d3.scaleLinear()
        .domain([2001,2023])
        .range([0, width]);
    svg.append("g")
        .call(
            d3.axisBottom(x)
            .tickFormat(d3.format("d"))
            .tickValues([2001, 2006, 2012, 2018, 2023])
        )
        .attr("transform", "translate(0," + height + ")")

    const y = d3.scaleLinear()
        .domain([0, 1])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
        .datum(lineData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function(d) { return x(d.year); })
            .y(function(d) { return y(d.score); })
        )

    svg.append("g")
        .selectAll("dot")
        .data(lineData)
        .enter()
        .append("circle")
            .attr("cx", function(d) { return x(d.year); })
            .attr("cy", function(d) { return y(d.score); })
            .attr("r", 4.0)
            .style("fill", "steelblue")

    return svg;
}

function generateMap() {
    const width = 800;
    const height = 600;

    // Create the SVG container.
    const svg = d3.select("#map")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoMercator()
        .scale(150)
        .center([-50, 20])
        .translate([width / 2, height / 2]);

    const zoom = d3.zoom()
        .scaleExtent([1, 10]) // Zoom levels
        .on("zoom", zoomed);

    svg.call(zoom); // Calling the zoom function

    // Function to handle zooming
    function zoomed() {
        // We need to figure out how to have the map repeat itself
        // I read online that you can have two projection next to
        // each other. Maye that works?
        g.attr("transform", d3.event.transform);
    }

    const colorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#ededed", "red"]);

    const g = svg.append("g");
    g.selectAll("path")
        .data(regionData.features)
        .enter().append("path")
            .attr("fill", function(d) {
                return colorScale(d.properties.scores[curYear - 2001]);
            })
            .attr("d", d3.geoPath()
                .projection(projection)
            )

    return svg;
}

d3.json("world_melee_data.json", function(data) {
    regionData = data;
    generateMap();
    generateLineGraph("Sweden");
});
