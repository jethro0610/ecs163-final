function generatePortrait(id, portraitLocation) {
    const g = d3.select("#map").select("g");
    const portrait = g.append("g");
    portrait.attr("id", id);

    portrait.append("line")
        .attr("x1", portraitLocation.x0)
        .attr("y1", portraitLocation.y0)
        .attr("x2", portraitLocation.x0)
        .attr("y2", portraitLocation.y0)
        .style("stroke", "#555555")
        .style("stroke-width", 0);

    portrait.append("circle")
        .attr('cx', portraitLocation.x0)
        .attr('cy', portraitLocation.y0)
        .attr('r', 0)
        .attr('fill', '#dddddd');

    portrait.append("svg:image")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("width", 0)
        .attr("height", 0)
        .attr("xlink:href", "");

    portrait.append("text")
        .text("")
        .attr("opacity", 0)
        .style("font-size", "0px")
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
        .style("font-size", "0px")
        .style("text-anchor", "middle")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0);


    portrait.select("circle")
        .transition()
        .duration(750)
        .attr("r", 0)
}

function enablePortrait(id, player, radius) {
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
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("width", 0)
        .attr("height", 0)
        .transition()
        .duration(750)
        .attr("xlink:href", player.name + ".png")
        .attr("x", portraitLocation.x0 - radius / 2)
        .attr("y", portraitLocation.y0 - radius / 2)
        .attr("width", radius)
        .attr("height", radius);

    portrait.select("text")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("opacity", 0)
        .style("font-size", "0px")
        .transition()
        .duration(750)
        .text(player.name)
        .attr("opacity", 1)
        .style("font-size", "14px")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0 - radius / 2 - 5);

    portrait.select("circle")
        .attr("r", 0)
        .transition()
        .duration(750)
        .attr("r", radius / 2 + 2)
}

function changePortrait(id, player, radius) {
    const portrait = d3.select("#map").select("#" + id);
    const portraitLocation = portraitLocations[id];

    portrait.select("image")
        .transition()
        .duration(750)
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("width", 0)
        .attr("height", 0)
        .transition()
        .duration(750)
        .attr("xlink:href", player.name + ".png")
        .attr("x", portraitLocation.x0 - radius / 2)
        .attr("y", portraitLocation.y0 - radius / 2)
        .attr("width", radius)
        .attr("height", radius);

    portrait.select("text")
        .transition()
        .duration(750)
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0)
        .attr("opacity", 0)
        .style("font-size", "0px")
        .transition()
        .duration(750)
        .text(player.name)
        .attr("opacity", 1)
        .style("font-size", "14px")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0 - radius / 2 - 5);

    portrait.select("circle")
        .transition()
        .duration(750)
        .attr("r", 0)
        .transition()
        .duration(750)
        .attr("r", radius / 2 + 2)
}

function updatePortrait(id, player, radius) {
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
        .attr("x", portraitLocation.x0 - radius / 2)
        .attr("y", portraitLocation.y0 - radius / 2)
        .attr("width", radius)
        .attr("height", radius)
        .attr("xlink:href", player.name + ".png");

    portrait.select("text")
        .text(player.name)
        .transition()
        .duration(750)
        .attr("opacity", 1)
        .style("font-size", "14px")
        .style("text-anchor", "middle")
        .attr("x", portraitLocation.x0)
        .attr("y", portraitLocation.y0 - radius / 2 - 5);

    portrait.select("circle")
        .transition()
        .duration(750)
        .attr("r", radius / 2 + 2)
}

function generatePortraits() {
    for (region in portraitLocations) {
        generatePortrait(region, portraitLocations[region]);
    }
}

function updatePortraitFromYear(curYear, prevYear = -1) {
    const maxRadius = 100;
    const minRank = 8;

    const curPortraitYear = portraitYears[curYear - 2001];
    const prevPortraitYear = prevYear == -1 ? undefined : portraitYears[prevYear - 2001];

    let lowestRank = -Infinity;
    for (region in curPortraitYear) {
        if (region == "year")
            continue;
        

        const rank = curPortraitYear[region].rank;
        if (rank > lowestRank) {
            lowestRank = rank;
        }
    }
    lowestRank = Math.min(lowestRank, minRank);


    for (region in portraitLocations) {
        const curRegionPlayer = curPortraitYear == undefined ? undefined : curPortraitYear[region];
        const prevRegionPlayer = prevPortraitYear == undefined ? undefined : prevPortraitYear[region];
        const curRegionPlayerName = curRegionPlayer == undefined ? undefined : curRegionPlayer.name;
        const prevRegionPlayerName = prevRegionPlayer == undefined ? undefined : prevRegionPlayer.name;

        const clampRank = Math.min(curRegionPlayer == undefined ? 10 : curRegionPlayer.rank, minRank);
        const radius = maxRadius * Math.pow((lowestRank - (clampRank - 1)) / lowestRank, 0.75);

        console.log(radius);

        if (prevRegionPlayerName == undefined && curRegionPlayerName != undefined)
            enablePortrait(region, curRegionPlayer, radius);
        else if (curRegionPlayerName == undefined)
            disablePortrait(region);
        else if (curRegionPlayerName != prevRegionPlayerName)
            changePortrait(region, curRegionPlayer, radius)
        else if (curRegionPlayerName == prevRegionPlayerName)
            updatePortrait(region, curRegionPlayer, radius)
    }
}
