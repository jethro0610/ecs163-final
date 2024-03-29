let curYear = 2001;
const mapWidth = 900;
const mapHeight = 900;

function changeMapTime(delta) {
    const mapSvg = d3.select("#map")

    const prevYear = curYear;
    curYear += delta;
    curYear = Math.min(Math.max(curYear, 2001), 2023);

    const deselectColorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "steelblue"]);

    const selectColorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "#B57847"]);

    const minScore = regionData.highestScores[curYear - 2001] / 8.0;

    mapSvg.selectAll("path")
        .transition()
        .attr("fill", function(d) {
            if (selectedRegion == d.properties.name)
                return selectColorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
            else if (d.properties.scores[curYear - 2001] > 0.0)
                return deselectColorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
            else
                return deselectColorScale(0);
        })

    document.getElementById("year").innerHTML = curYear;

    if (curYear == 2020 || curYear == 2021)
        document.getElementById("rank-list-title").innerHTML = "COVID";
    else if (curYear < 2013)
        document.getElementById("rank-list-title").innerHTML = "RetroSSBMRank " + curYear;
    else
        document.getElementById("rank-list-title").innerHTML = "SSBMRank " + curYear;

    generateEventsForYear(curYear);
    generateRankListForYear(curYear, selectedRegion);
    updatePortraitFromYear(curYear, prevYear);
    if (selectedRegion != "All")
        generateLineGraph(selectedRegion);
}

function highlightRegion(region) {
    const mapSvg = d3.select("#map")
    mapSvg.selectAll("path")
        .filter(function(d) { return region == "All" || d.properties.name == region })
        .transition()
        .attr("fill", "#555555");
}

function unhighlightRegion(region) {
    const mapSvg = d3.select("#map")

    const deselectColorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "steelblue"]);

    const selectColorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "#B57847"]);

    const minScore = regionData.highestScores[curYear - 2001] / 8.0;

    mapSvg.selectAll("path")
        .filter(function(d) { return region == "All" || d.properties.name == region })
        .transition()
        .attr("fill", function(d) {
            if (selectedRegion == d.properties.name)
                return selectColorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
            else if (d.properties.scores[curYear - 2001] > 0.0)
                return deselectColorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
            else
                return deselectColorScale(0);
        })
}

function selectRegion(region)
{
    const mapSvg = d3.select("#map")

    const selectColorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "#B57847"]);

    const minScore = regionData.highestScores[curYear - 2001] / 8.0;

    mapSvg.selectAll("path")
        .filter(function(d) { return d.properties.name == region })
        .transition()
        .attr("fill", function(d) {
            return selectColorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
        })
}

function deselectRegion(region)
{
    const mapSvg = d3.select("#map")
    mapSvg.selectAll("path")
        .filter(function(d) { return d.properties.name == region })

    const colorScale = d3.scaleLinear()
        .domain([0, regionData.highestScores[curYear - 2001]])
        .range(["#efefef", "steelblue"]);

    const minScore = regionData.highestScores[curYear - 2001] / 8.0;

    mapSvg.selectAll("path")
        .filter(function(d) { return d.properties.name == region })
        .transition()
        .attr("fill", function(d) {
            if (d.properties.scores[curYear - 2001] > 0.0)
                return colorScale(Math.max(d.properties.scores[curYear - 2001], minScore));
            else
                return colorScale(0);
        })
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
        .scaleExtent([1, 10]) // Zoom levels
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
        .selectAll("text")
        .attr("transform", d3.event.transform);

        g
        .selectAll("image")
        .attr("transform", d3.event.transform);

        g
        .selectAll("line")
        .attr("transform", d3.event.transform);

        g
        .selectAll("circle")
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
            .attr("stroke", "none")
            .on('click', function(d) { 
                if (d.properties.scores[curYear - 2001] <= 0.0 && d.properties.name != selectedRegion)
                    return;

                deselectRegion(selectedRegion);
                if (selectedRegion != d.properties.name) {
                    selectedRegion = d.properties.name;
                    selectRegion(selectedRegion);
                    generateLineGraph(selectedRegion);
                }
                else {
                    selectedRegion = "All";
                    deleteLineGraph();
                }

                generateRankListForYear(curYear, selectedRegion);
            })

    return svg;
}
