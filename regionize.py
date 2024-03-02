import json

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
islands_feature = make_feature("US Island")

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

json_out = json.dumps(out)
with open("world.json", "w") as outfile:
    outfile.write(json_out)
