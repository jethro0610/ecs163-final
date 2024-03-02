const us_state_regions = new Map([
    ["WA", "US West"],
    ["OR", "US West"],
    ["CA", "US West"],
    ["MT", "US West"],
    ["ID", "US West"],
    ["WY", "US West"],
    ["UT", "US West"],
    ["CO", "US West"],
    ["NV", "US West"],

    ["NM", "US Southwest"],
    ["TX", "US Southwest"],
    ["OK", "US Southwest"],
    ["AZ", "US Southwest"],

    ["ND", "US Midwest"],
    ["SD", "US Midwest"],
    ["NE", "US Midwest"],
    ["KS", "US Midwest"],
    ["MN", "US Midwest"],
    ["IA", "US Midwest"],
    ["MO", "US Midwest"],
    ["WI", "US Midwest"],
    ["IL", "US Midwest"],
    ["MI", "US Midwest"],
    ["IN", "US Midwest"],
    ["OH", "US Midwest"],

    ["AR", "US Southeast"],
    ["LA", "US Southeast"],
    ["KY", "US Southeast"],
    ["TN", "US Southeast"],
    ["MS", "US Southeast"],
    ["WV", "US Southeast"],
    ["MD", "US Southeast"],
    ["VA", "US Southeast"],
    ["NC", "US Southeast"],
    ["SC", "US Southeast"],
    ["GA", "US Southeast"],
    ["AL", "US Southeast"],
    ["FL", "US Southeast"],

    ["ME", "US Northeast"],
    ["VT", "US Northeast"],
    ["NH", "US Northeast"],
    ["MA", "US Northeast"],
    ["CT", "US Northeast"],
    ["RI", "US Northeast"],
    ["NY", "US Northeast"],
    ["PA", "US Northeast"],
    ["NJ", "US Northeast"],
    ["DE", "US Northeast"],

    ["AK", "US Island"],
    ["HI", "US Island"]
]);


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
        const colorScale = d3.scaleLinear()
            .domain([0, data.highestScores[3]])
            .range(["gray", "red"]);

        svg.append("g")
            .selectAll("path")
            .data(data.features)
            .enter().append("path")
                .attr("fill", function(d) {
                    return colorScale(d.properties.scores[3]);
                })
                .attr("d", d3.geoPath()
                    .projection(projection)
                )
                // .on("mouseover", highlightRegion)
                // .on("mouseout", unhighlightRegion);
    });

    function highlightRegion() {
        d3.select(this)
            .style("fill", "black")

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

    function unhighlightRegion() {
        d3.select(this)
            .style("fill", "gray")

        svg.select("image").remove();
    }
}

testGraph();
