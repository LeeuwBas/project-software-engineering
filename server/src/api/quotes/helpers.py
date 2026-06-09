import json
import random


def get_happiness_tier(happiness):
    if happiness < 40:
        return "sad"
    elif happiness < 80:
        return "neutral"
    else:
        return "happy"


def load_quotes():
    with open("resources/quotes.json", "r") as f:
        return json.load(f)


def get_json_quote(action, happiness):
    quotes = load_quotes()

    if action not in quotes:
        return "What do you want from me?"

    tier = get_happiness_tier(happiness)

    possible_quotes = quotes[action][tier]

    return random.choice(possible_quotes)
