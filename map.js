let curYear = 2001;
const mapWidth = 900;
const mapHeight = 900;

function changeMapTime(delta) {
    const mapSvg = d3.select("#map")

    curYear += delta;
    curYear = Math.min(Math.max(curYear, 2001), 2023);

    const colorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "steelblue"]);

    const minScore = regionData.highestScores[curYear - 2001] / 8.0;

    mapSvg.selectAll("path")
        .transition()
        .attr("fill", function(d) {
            if (d.properties.scores[curYear - 2001] > 0.0)
                return colorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
            else
                return colorScale(0);
        })

    document.getElementById("year").innerHTML = curYear;
    generateEventsForYear(curYear);
}

function highlightRegion(region) {
    const mapSvg = d3.select("#map")

    mapSvg.selectAll("path")
        .filter(function(d) { return region == "All" || d.properties.name == region })
        .transition()
        .attr("fill", "red");
}

function unhighlightRegion(region) {
    const mapSvg = d3.select("#map")

    const colorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "steelblue"]);

    const minScore = regionData.highestScores[curYear - 2001] / 8.0;

    mapSvg.selectAll("path")
        .filter(function(d) { return region == "All" || d.properties.name == region })
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
        .scale(150)
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
        g
        .selectAll("path")
        .attr("transform", d3.event.transform);

        g
        .selectAll("g")
        .attr("transform", d3.event.transform);
    }

    const colorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "steelblue"]);

    const minScore = regionData.highestScores[curYear - 2001] / 6.0;

    const g = svg.append("g");
    g.selectAll("path")
        .data(regionData.features)
        .enter().append("path")
            .attr("fill", function(d) {
                if (d.properties.scores[curYear - 2001] > 0.0)
                    return colorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
                else
                    return colorScale(0);
            })
            .attr("d", d3.geoPath()
                .projection(projection)
            )

    function generatePortrait(imageX, imageY, regionX, regionY) {
        const imageRadius = 100;
        const portrait = g.append("g");
        portrait.append("line")
            .attr("x1", imageX)
            .attr("y1", imageY)
            .attr("x2", regionX)
            .attr("y2", regionY)
            .style("stroke", "gray")
            .style("stroke-width", 1);

        portrait.append("svg:image")
            .attr("x", imageX - imageRadius / 2)
            .attr("y", imageY - imageRadius / 2)
            .attr("width", imageRadius)
            .attr("height", imageRadius)
            .attr("xlink:href", "mango.png");

        portrait.append("text")
            .text("Mango")
            .style("text-anchor", "middle")
            .attr("x", imageX)
            .attr("y", imageY - imageRadius / 2 - 5);
    }

    generatePortrait(80, 380, 150, 320); // US West
    generatePortrait(360, 295, 250, 330); // US Northeast
    generatePortrait(350, 400, 230, 350); // US Southeast
    generatePortrait(850, 400, 810, 350); // Japan
    generatePortrait(450, 170, 500, 220); // Sweden
    generatePortrait(75, 120, 175, 275); // Canada 
    generatePortrait(420, 250, 465, 288); // Netherlands
    generatePortrait(750, 620, 800, 520); // Australia

    return svg;
}
