function generatePortrait(id, portraitLocation) {
    const g = d3.select("#map").select("g");
    const portrait = g.append("g");
    portrait.attr("id", id);
    console.log(g);

    portrait.append("line")
        .attr("x1", portraitLocation.x0)
        .attr("y1", portraitLocation.y0)
        .attr("x2", portraitLocation.x0)
        .attr("y2", portraitLocation.y0)
        .style("stroke", "gray")
        .style("stroke-width", 0);

    portrait.append("svg:image")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("width", 0)
        .attr("height", 0)
        .attr("xlink:href", "");

    portrait.append("text")
        .text("")
        .attr("opacity", 0)
        .style("text-anchor", "middle")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0);
}

function disablePortrait(id) {
    const portrait = d3.select("#map").select("#" + id);
    const portraitLocation = portraitLocations[id];

    portrait.select("line")
        .transition()
        .duration(500)
        .attr("x2", portraitLocation.x0)
        .attr("y2", portraitLocation.y0)
        .style("stroke-width", 0);

    portrait.select("image")
        .transition()
        .duration(750)
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("width", 0)
        .attr("height", 0)

    portrait.select("text")
        .transition()
        .duration(750)
        .attr("opacity", 0)
        .style("text-anchor", "middle")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0);
}

function changePortrait(id, player) {
    player.radius = 100;
    const portrait = d3.select("#map").select("#" + id);
    const portraitLocation = portraitLocations[id];

    portrait.select("line")
        .style("stroke-width", 1)
        .attr("x2", portraitLocation.x0)
        .attr("y2", portraitLocation.y0)
        .transition()
        .duration(500)
        .attr("x2", portraitLocation.x1)
        .attr("y2", portraitLocation.y1);

    portrait.select("image")
        .attr("xlink:href", player.name + ".png")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("width", 0)
        .attr("height", 0)
        .transition()
        .duration(750)
        .attr("x", portraitLocation.x0 - player.radius / 2)
        .attr("y", portraitLocation.y0 - player.radius / 2)
        .attr("width", player.radius)
        .attr("height", player.radius);

    portrait.select("text")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("opacity", 0)
        .text(player.name)
        .transition()
        .duration(750)
        .attr("opacity", 1)
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0 - player.radius / 2 - 5);
}

function updatePortrait(id, player) {
    player.radius = 100;
    const portrait = d3.select("#map").select("#" + id);
    const portraitLocation = portraitLocations[id];

    portrait.select("line")
        .style("stroke-width", 1)
        .transition()
        .duration(500)
        .attr("x2", portraitLocation.x1)
        .attr("y2", portraitLocation.y1);

    portrait.select("image")
        .transition()
        .duration(750)
        .attr("x", portraitLocation.x0 - player.radius / 2)
        .attr("y", portraitLocation.y0 - player.radius / 2)
        .attr("width", player.radius)
        .attr("height", player.radius)
        .attr("xlink:href", player.name + ".png");

    portrait.select("text")
        .text(player.name)
        .transition()
        .duration(750)
        .attr("opacity", 1)
        .style("text-anchor", "middle")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0 - player.radius / 2 - 5);
}

function generatePortraits() {
    for (region in portraitLocations) {
        generatePortrait(region, portraitLocations[region]);
    }
}

function updatePortraitFromYear(curYear, prevYear = -1) {
    const curPortraitYear = portraitYears[curYear - 2001];
    const prevPortraitYear = prevYear == -1 ? undefined : portraitYears[prevYear - 2001];

    for (region in portraitLocations) {
        const curRegionPlayer = curPortraitYear == undefined ? undefined : curPortraitYear[region];
        const prevRegionPlayer = prevPortraitYear == undefined ? undefined : prevPortraitYear[region];
        const curRegionPlayerName = curRegionPlayer == undefined ? undefined : curRegionPlayer.name;
        const prevRegionPlayerName = prevRegionPlayer == undefined ? undefined : prevRegionPlayer.name;

        if (curRegionPlayerName == undefined)
            disablePortrait(region);
        else if (curRegionPlayerName != prevRegionPlayerName)
            changePortrait(region, curRegionPlayer, 100)
        else if (curRegionPlayerName == prevRegionPlayerName)
            updatePortrait(region, curRegionPlayer, 100)
    }
}
