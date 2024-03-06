// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

function generateLineGraph(country_name) {
    // Create the SVG container.
    var svg = d3.select("#line_graph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    let scores; 
    var years = [2001,2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022,2023];
    d3.json("world_melee_data.json", function(data) {
        for(i in data.features){
            //console.log(data.features[i]);
            if(data.features[i].properties.name == country_name){
                scores = data.features[i].properties.scores;
                break;
            }
        }
        console.log(scores);
        
        console.log(scores);
        console.log(years);
        var x = d3.scaleLinear()
            .domain([2001,2023])
            .range([ 0, width ]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));
    
            // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(scores)])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));
    
        // Add the line
        svg.append("path")
            .datum(years)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function(d,i){return x(years[i])})
                .y(function(d,i){return y(scores[i])}))

    });




    return svg;
}

generateLineGraph("US Northeast");