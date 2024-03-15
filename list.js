let ranks;
let rankDivs = [];

d3.json("./data/ranks.json", function(data) {
    ranks = data;
    generateRankListForYear(2001, selectedRegion);
});

function generateListEntry(player) {
    const panel = document.getElementById("rank-list");
    const rankCard = document.createElement("div");
    rankCard.className = "rank-card";
    panel.appendChild(rankCard);

    const rankName = document.createElement("div");
    rankName.innerHTML = 
        (player.hm ? "HM" : player.rank.toString()) + 
        ". " + 
        player.name;
    rankCard.appendChild(rankName);

    const rankRegion = document.createElement("div");
    rankRegion.innerHTML = player.region;
    rankCard.appendChild(rankRegion);

    rankCard.onmouseover = function() {
        highlightRegion(player.region);
    }

    rankCard.onmouseout = function() {
        unhighlightRegion(player.region);
    }

    rankDivs.push(rankCard);
}

function generateRankListForYear(year, region) {
    rankDivs.forEach((div) => {
        div.remove();
    })
    rankDivs = [];

    const rankYear = ranks[year - 2001]
    rankYear.players.forEach(player => {
        if (player.region == region || region == "All")
            generateListEntry(player);
    });
}
