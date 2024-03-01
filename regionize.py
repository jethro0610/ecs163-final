import json

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
    out ["features"].append(out_feature)

states_file = open("us_states.json")
states = json.load(states_file)

for feature in states["features"]:
    out_feature = dict()
    out_feature["type"] = "Feature"
    out_feature["properties"] = {
        "name": "US." + feature["properties"]["NAME"]
    }
    out_feature["geometry"] = feature["geometry"]
    out ["features"].append(out_feature)

json_out = json.dumps(out, indent = 2)
with open("world.json", "w") as outfile:
    outfile.write(json_out)
