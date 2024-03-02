function testGraph() {
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;

    // Create the SVG container.
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    const projection = d3.geoMercator()
        .scale(70)
        .center([-100, 20])
        .translate([width / 2, height / 2]);

    d3.json("world.json", function(data) {
        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
                .attr("fill", "gray")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .on("mouseover", highlightRegion)
                .on("mouseout", unhighlightRegion);
    });

    function highlightRegion() {
        d3.select(this)
            .style("fill", "black")
    }

    function unhighlightRegion() {
        d3.select(this)
            .style("fill", "gray")
    }
}

testGraph();
