let curYear = 2001;
const width = 640;
const height = 400;
let highestScores;

function changeTime(delta) {
    const mapSvg = d3.select("#map")
        .attr("width", width)
        .attr("height", height);

    curYear += delta;
    curYear = Math.min(Math.max(curYear, 2001), 2023);

    const colorScale = d3.scaleLinear()
        .domain([0, highestScores[curYear - 2001]])
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
        .attr("width", width)
        .attr("height", height);

    d3.json("world_melee_data.json", function(data) {
        // This is hacky and I hate it, but whatever lol
        highestScores = data.highestScores;

        const projection = d3.geoMercator()
            .scale(70)
            .center([60, 20])
            .translate([width / 2, height / 2]);

        const zoom = d3.zoom()
            .scaleExtent([1, 10]) // Zoom levels
            .on("zoom", zoomed);

        svg.call(zoom); // Calling the zoom function

        // Function to handle zooming
        function zoomed() {
            const {x, y, k} = d3.event.transform;
            const newX = Math.min(0, Math.max(width - width * k, x));
            const newY = Math.min(0, Math.max(height - height * k, y));


            g.attr("transform", `translate(${newX}, ${newY}) scale(${k})`);
        }

        const colorScale = d3.scaleLinear()
            .domain([0, highestScores[curYear - 2001]])
            .range(["#ededed", "red"]);

        const g = svg.append("g");
        g.selectAll("path")
            .data(data.features)
            .enter().append("path")
                .attr("fill", function(d) {
                    return colorScale(d.properties.scores[curYear - 2001]);
                })
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
    });

    return svg;
}

generateMap();
