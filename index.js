let regionData;
let portraitLocations;
let portraitYears;
let selectedRegion = "All";

// Load the region data and store it as a global variable
d3.json("./data/world_melee_data.json", function(data) {
    regionData = data;
    d3.json("./data/portraits.json", function(portraitData) {
        portraitLocations = portraitData.locations;
        portraitYears = portraitData.years;

        generateMap();
        generatePortraits();
        updatePortraitFromYear(2001);
    });
});
