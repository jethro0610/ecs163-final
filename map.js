let curYear = 2001;
const mapWidth = 1000;
const mapHeight = 800;

function changeMapTime(delta) {
    const mapSvg = d3.select("#map")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

    curYear += delta;
    curYear = Math.min(Math.max(curYear, 2001), 2023);

    const colorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#ededed", "red"]);

    const minScore = regionData.highestScores[curYear - 2001] / 10.0;

    mapSvg.selectAll("path")
        .transition()
        .attr("fill", function(d) {
            if (d.properties.scores[curYear - 2001] > 0.0)
                return colorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
            else
                return colorScale(0);
        })

    document.getElementById("year").innerHTML = curYear;
}

function generateMap() {
    // Create the SVG container.
    const svg = d3.select("#map")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

    const projection = d3.geoMercator()
        .scale(120)
        .translate([mapWidth / 2, mapHeight / 2]);

    const zoom = d3.zoom()
        .scaleExtent([1, 5]) // Zoom levels
        .translateExtent([
            [0, 0],
            [mapWidth, mapHeight]
        ])
        .on("zoom", zoomed);

    svg.call(zoom); // Calling the zoom function

    // Function to handle zooming
    function zoomed() {
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
