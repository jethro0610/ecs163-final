import json
import math

state_acronym_regions = {
    "WA": "US West",
    "OR": "US West",
    "CA": "US West",
    "MT": "US West",
    "ID": "US West",
    "WY": "US West",
    "UT": "US West",
    "CO": "US West",
    "NV": "US West",

    "NM": "US Southwest",
    "TX": "US Southwest",
    "OK": "US Southwest",
    "AZ": "US Southwest",

    "ND": "US Midwest",
    "SD": "US Midwest",
    "NE": "US Midwest",
    "KS": "US Midwest",
    "MN": "US Midwest",
    "IA": "US Midwest",
    "MO": "US Midwest",
    "WI": "US Midwest",
    "IL": "US Midwest",
    "MI": "US Midwest",
    "IN": "US Midwest",
    "OH": "US Midwest",

    "AR": "US Southeast",
    "LA": "US Southeast",
    "KY": "US Southeast",
    "TN": "US Southeast",
    "MS": "US Southeast",
    "WV": "US Southeast",
    "MD": "US Southeast",
    "VA": "US Southeast",
    "NC": "US Southeast",
    "SC": "US Southeast",
    "GA": "US Southeast",
    "AL": "US Southeast",
    "FL": "US Southeast",

    "ME": "US Northeast",
    "VT": "US Northeast",
    "NH": "US Northeast",
    "MA": "US Northeast",
    "CT": "US Northeast",
    "RI": "US Northeast",
    "NY": "US Northeast",
    "PA": "US Northeast",
    "NJ": "US Northeast",
    "DE": "US Northeast",

    "AK": "US Island",
    "HI": "US Island"
}

west = [
    "Washington",
    "Oregon",
    "California",
    "Montana",
    "Idaho",
    "Wyoming",
    "Utah",
    "Colorado",
    "Nevada"
]

southwest = [
    "New Mexico",
    "Texas",
    "Oklahoma",
    "Arizona",
]

midwest = [
    "North Dakota",
    "South Dakota",
    "Nebraska",
    "Kansas",
    "Minnesota",
    "Iowa",
    "Missouri",
    "Wisconsin",
    "Illinois",
    "Michigan",
    "Indiana",
    "Ohio"
]

southeast = [
    "Arkansas",
    "Louisiana",
    "Kentucky",
    "Tennessee",
    "Mississippi",
    "West Virginia",
    "Maryland",
    "Virginia",
    "North Carolina",
    "South Carolina",
    "Georgia",
    "Alabama",
    "Florida"
]

northeast = [
    "Maine",
    "Vermont",
    "New Hampshire",
    "Massachusetts",
    "Connecticut",
    "Rhode Island",
    "New York",
    "Pennsylvania",
    "New Jersey",
    "Delaware"
]

islands = [
    "Alaska",
    "Hawaii"
]

def get_state_region(name):
    if name in west:
        return "US West"
    elif name in southwest:
        return "US Southwest"
    elif name in midwest:
        return "US Midwest"
    elif name in southeast:
        return "US Southeast"
    elif name in northeast:
        return "US Northeast"
    elif name in islands:
        return "US Islands"

ranks_file = open("ranks.json")
ranks = json.load(ranks_file)
players_file = open("players.json")
players = json.load(players_file)

for rank in ranks:
    for player in rank["players"]:
        player_name = player["name"]
        player_country = players[player_name]["country"]
        if player_country == "United States":
            player_state = players[player_name]["state"]
            player["region"] = state_acronym_regions[player_state]
        else:
            player["region"] = player_country

json_out = json.dumps(ranks, indent=4)
with open("ranks.json", "w") as outfile:
    outfile.write(json_out)
