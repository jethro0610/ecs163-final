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

out = dict()
out["type"] = "FeatureCollection"
out["features"] = []

countries_file = open("countries.json")
countries = json.load(countries_file)

for feature in countries["features"]:
    if feature["properties"]["ADMIN"] == "United States of America":
        continue

    out_feature = dict()
    out_feature["type"] = "Feature"
    out_feature["properties"] = {
        "name": feature["properties"]["ADMIN"]
    }
    out_feature["geometry"] = feature["geometry"]
    out["features"].append(out_feature)

states_file = open("us_states.json")
states = json.load(states_file)

def make_feature(name):
    feature = dict()
    feature["type"] = "Feature"
    feature["properties"] = { "name": name }
    feature["geometry"] = {
        "type": "MultiPolygon",
        "coordinates": []
    }
    return feature

west_feature = make_feature("US West")
southwest_feature = make_feature("US Southwest")
midwest_feature = make_feature("US Midwest")
southeast_feature = make_feature("US Southeast")
northeast_feature = make_feature("US Northeast")
islands_feature = make_feature("US Islands")

def get_feature(name):
    if name in west:
        return west_feature
    elif name in southwest:
        return southwest_feature
    elif name in midwest:
        return midwest_feature
    elif name in southeast:
        return southeast_feature
    elif name in northeast:
        return northeast_feature
    elif name in islands:
        return islands_feature

for feature in states["features"]:
    out_feature = get_feature(feature["properties"]["NAME"])
    if out_feature == None:
        continue

    if feature["geometry"]["type"] == "MultiPolygon":
        for coordinate in feature["geometry"]["coordinates"]:
            out_feature["geometry"]["coordinates"].append(coordinate)
    else:
        coords = []
        for coordinate in feature["geometry"]["coordinates"]:
            coords.append(coordinate)

        out_feature["geometry"]["coordinates"].append(coords)

out["features"].append(west_feature)
out["features"].append(southwest_feature)
out["features"].append(midwest_feature)
out["features"].append(southeast_feature)
out["features"].append(northeast_feature)
out["features"].append(islands_feature)

feature_names = dict()
for feature in out["features"]:
    name = feature["properties"]["name"]
    feature_names[name] = feature
    feature["properties"]["scores"] = [0] * 23
    feature["properties"]["players"] = [0] * 23

players_file = open("players.json")
players = json.load(players_file)

ranks_file = open("players.json")
ranks = json.load(ranks_file)

players_file = open("players.json")
players = json.load(players_file)
ranks_file = open("ranks.json")
ranks = json.load(ranks_file)

def get_player_score(player_rank, lowest_rank):
    return (lowest_rank - (player_rank - 1))

out["highestScores"] = [0] * 23

for ranking in ranks:
    year = ranking["year"]
    lowest_rank = -1
    for player in ranking["players"]:
        if player["rank"] > lowest_rank:
            lowest_rank = player["rank"]

    region_scores = dict()
    region_players = dict()

    for player in ranking["players"]:
        player_location = players[player["name"]]
        region = ""
        if player_location["country"] == "United States":
            region = state_acronym_regions[player_location["state"]]
        else:
            region = player_location["country"]

        if region not in region_scores:
            region_scores[region] = 0
        if region not in region_players:
            region_players[region] = []

        region_scores[region] += get_player_score(player["rank"], lowest_rank)
        region_players[region].append({
            "name": player["name"],
            "rank": player["rank"],
            "state": player_location["state"]
        })

    highestScore = 0
    for score in region_scores.values():
        if score > highestScore:
            highestScore = score
    out["highestScores"][year - 2001] = highestScore

    print(ranking["year"])
    for region in region_scores.keys():
        feature_names[region]["properties"]["scores"][year - 2001] = region_scores[region]
        feature_names[region]["properties"]["players"][year - 2001] = region_players[region]
        print("\t" + region + ": " + str(region_scores[region]))

json_out = json.dumps(out)
with open("world_melee_data.json", "w") as outfile:
    outfile.write(json_out)
