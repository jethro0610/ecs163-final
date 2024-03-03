function testGraph() {
    console.log("g")
    // Declare the chart dimensions and margins.
    const width = 640;
    const height = 400;

    // Create the SVG container.
    const svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

    
    const zoom = d3.zoom()
        .scaleExtent([1, 10]) // Zoom levels
        .on("zoom", zoomed);

    svg.call(zoom); // Calling the zoom function

    const projection = d3.geoMercator()
        .scale(70)
        .center([0, 20])
        .translate([width / 2, height / 2]);

    const g = svg.append("g");

    d3.json("world.json", function(data) {
        g.selectAll("path")
            .data(data.features)
            .enter().append("path")
                .attr("fill", "gray")
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                .on("mouseover", highlightCountry)
                .on("mouseout", handleMouseOut);
    });

    // Function to handle zooming
    function zoomed() {
        g.attr("transform", d3.event.transform);
    }

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
