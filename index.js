let regionData;
let portraitLocations;
let portraitYears;

// Load the region data and store it as a global variable
d3.json("world_melee_data.json", function(data) {
    regionData = data;
    d3.json("portraits.json", function(portraitData) {
        portraitLocations = portraitData.locations;
        portraitYears = portraitData.years;

        generateMap();
        generatePortraits();
        updatePortraitFromYear(2001);
        generateLineGraph("US Northeast");
    });
});
