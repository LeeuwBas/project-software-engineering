import json
import random


def get_happiness_tier(happiness):
    # Change these values to allow for different happiness scales
    # If these values/names get changed, make sure to adapt the tests
    if happiness < 40:
        return "sad"
    elif happiness < 80:
        return "neutral"
    else:
        return "happy"


def load_quotes():
    with open("resources/quotes.json", "r") as f:
        return json.load(f)


def get_json_quote(action, level, context="Standard"):
    quotes = load_quotes()
    return random.choice(quotes["Neutral"]["WaterLow"]) # temp for testing

    if action not in quotes or level not in quotes[action]:
        return "What do you want from me?"

    tier = quotes[action][level]
    # Get's the specific context, if it doesn't exist, it defaults to the "Standard" context
    possible_quotes = tier.get(context, tier.get("Standard", []))

    return random.choice(possible_quotes)
