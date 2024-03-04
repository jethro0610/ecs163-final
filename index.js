function testGraph() {
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;

    // Create the SVG container.
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    d3.json("world_melee_data.json", function(data) {
        const projection = d3.geoMercator()
            .scale(70)
            .center([0, 20])
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
            .domain([0, data.highestScores[18]])
            .range(["white", "red"]);

        const g = svg.append("g");
        g.selectAll("path")
            .data(data.features)
            .enter().append("path")
                .attr("fill", function(d) {
                    console.log(d.properties.scores[18]);
                    return colorScale(d.properties.scores[18]);
                })
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
    });

    // Function to highlight country when mouse is hovering over it
    function highlightCountry(d, i) {
        d3.select(this)
            .style("stroke", "black") // Outline country
            .style("stroke-width", 1); // Adjust border width
        
        // Show miniature graph next to the country
        const image = svg.append("image")
            .attr("width", 50)
            .attr("height", 50)
            .attr("xlink:href", "beatDAGAME.png"); // TODO: Replace image with line graph of players
    
        // Mousemove event listener to update image position
        svg.on("mousemove", function() {
            const [x, y] = d3.mouse(this);
            image.attr("x", x + 10)
                .attr("y", y - 10);
        });
    }

    // Function to unhighlight country
    function handleMouseOut(d, i) {
        d3.select(this)
            .style("stroke", "none"); // Remove border
        // Remove miniature graph
        svg.select("image").remove();
    }
}

testGraph();
