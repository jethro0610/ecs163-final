let regionData;

// Load the region data and store it as a global variable
d3.json("world_melee_data.json", function(data) {
    regionData = data;
    generateMap();
    generateLineGraph("Sweden");
});
