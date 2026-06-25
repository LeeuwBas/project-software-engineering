from django.utils import timezone
from django.db.models import Sum, Max, Min, Count

from datetime import timedelta, datetime

from .models import Stats, Goals


def getStatDict(line: Stats | Goals):
    """
    Pulls all items in stats and goals models into a nice dictionary to
    read from and update.

    """
    return {
        "water": line.water,
        "steps": line.steps,
        "sleep": line.sleep,
        "food": line.food,
        "stress": line.stress,
    }


def getSummary(user: str, statistic: str, lowerDay: datetime, upperDay: datetime):
    """
    Aggregates a summary for the requested statistic, summarizes the past days,
    amount is given in 'days'.
    """

    filter_dict = {
        "user": user,
        "date__gt": lowerDay.date(),
        "date__lte": upperDay.date(),
    }

    day_amount = (upperDay - lowerDay).days

    lines = Stats.objects.filter(**filter_dict)

    response: dict = lines.aggregate(
        total=Sum(statistic),
        minimum=Min(statistic),
        maximum=Max(statistic),
        count=Count(statistic),
    )

    response["average"] = response["total"] / day_amount

    if response["count"] < day_amount:
        response["minimum"] = 0
        response["count"] = day_amount

    return response


def getBarChart(
    lowerDate: datetime, upperDate: datetime, bins: int, user: str, statistic: str
):
    """
    Returns statistics data aggregated into a format to render a bar chart.
    days must be a multiple of bins.
    """
    days_per_bin = (upperDate - lowerDate).days // bins

    bin_dict = {}
    filter = {
        "user": user,
        "date__gt": lowerDate,
        "date__lte": lowerDate + timedelta(days_per_bin),
    }

    for i in range(bins):
        bin_dict[i] = Stats.objects.filter(**filter).aggregate(total=Sum(statistic))[
            "total"
        ]

        if bin_dict[i] is None:
            bin_dict[i] = 0

        bin_dict[i] /= days_per_bin

        filter["date__gt"] = filter["date__lte"]
        filter["date__lte"] += timedelta(days_per_bin)

    return bin_dict


def getDay(user: str, statistic: str | None, day: datetime | None = None):
    """
    Returns the statistic line of a given day. If a statistic is given it
    will return just that statistic, if None, will return a dictionary with the full line.
    """
    if day is None:
        day = timezone.now()

    filter = {"user": user, "date": day.date()}

    line = Stats.objects.filter(**filter).first()

    if line is None:
        return None

    if statistic is None:
        return getStatDict(line)
    else:
        return getattr(line, statistic)


def setDay(user: str, statistic: dict[str, int], day: datetime | None = None):
    """
    Sets new data for a specified date.
    Takes the dictionary in statistics for all data, only overwrites.
    """
    if day is None:
        day = datetime.now()

    filter = {"user": user, "date": day.date()}

    Stats.objects.update_or_create(**filter, defaults=statistic)


def getGoal(user: str, statName: str | None, day: datetime | None = None):
    """
    Retrieves the latest goal, either for a given stat or just for all stats
    combined.

    If no day was given, will retrieve the most recent goal.
    """
    if day is None:
        day = timezone.now()

    filter = {"user": user, "date__lte": day.date()}

    line = Goals.objects.filter(**filter).order_by("-date").first()

    if line is None:
        return None

    if statName is None:
        return getStatDict(line)

    return getattr(line, statName, None)


def setGoal(user: str, goal_data: dict[str, int], day: datetime | None = None):
    """
    Updates a given goal, keeps all other goals the same.

    If no day was given, will update for today.
    """
    if day is None:
        day = timezone.now()

    oldLine = getGoal(user, None, day)
    if oldLine is None:
        oldLine = getStatDict(Goals())

    for statName, value in goal_data.items():
        oldLine[statName] = value

    filter = {"date": day.date(), "user": user}

    Goals.objects.update_or_create(**filter, defaults=oldLine)


def getCalender(user: str, startDay: datetime, endDay: datetime):
    """
    Returns a list of dictionaries to render the calendar in the frontend
    Every item in the dictionaries show if that goal was met that day.

    The dictionaries are in chronological order and are inclusive on both ends.
    """
    returnList = []

    currentDay = startDay
    while currentDay <= endDay:
        has_data = True

        stats = getDay(user, None, currentDay)
        if stats is None:
            stats = getStatDict(Stats())
            has_data = False

        goals = getGoal(user, None, currentDay)
        if goals is None:
            goals = getStatDict(Goals())
            has_data = False

        for key in stats.keys():
            if key == "stress":
                continue
            stats[key] = stats[key] >= goals[key] if has_data else False

        returnList.append(stats)

        currentDay += timedelta(1)

    return returnList


def toISOFormat(date: datetime):
    return date.strftime("%Y-%m-%d")
