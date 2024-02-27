function testGraph() {
    console.log("g")
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;

    // Create the SVG container.
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    const path = d3.geoPath();
    const projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([width / 2, height / 2]);

    const data = d3.map();
    const colorScale = d3.scaleThreshold()
        .domain([
            100000, 
            1000000, 
            10000000, 
            30000000, 
            100000000, 
            500000000
        ])
        .range(d3.schemeBlues[7]);

    d3.queue()
        .defer(
            d3.json, 
            "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
        )
        .defer(
            d3.csv, 
            "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world_population.csv",
            function(d) {
                data.set(d.code, +d.pop);
            }
        )
        .await(ready);

    function ready(error, topo) {
        svg.append("g")
            .selectAll("path")
            .data(topo.features)
            .enter()
            .append("path")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .attr("fill", "blue")
    }
}

testGraph();
