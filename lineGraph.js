function generateLineGraph(region) {
    const margin = {top: 30, right: 30, bottom: 30, left: 30}
    const width = 300 - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

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

