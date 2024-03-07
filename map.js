let curYear = 2001;
const mapWidth = 650;
const mapHeight = 650;

function changeMapTime(delta) {
    const mapSvg = d3.select("#map")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

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

function generateMap() {
    // Create the SVG container.
    const svg = d3.select("#map")
        .attr("width", mapWidth)
        .attr("height", mapHeight);

    const projection = d3.geoMercator()
        .scale(100)
        .translate([mapWidth / 2, mapHeight / 2]);

    const zoom = d3.zoom()
        .scaleExtent([1, 10]) // Zoom levels
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
