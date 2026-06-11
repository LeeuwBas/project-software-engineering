from django.utils import timezone
from django.db.models import Sum, Max, Min, Avg, F

from datetime import timedelta, date, datetime

from .models import Stats, Goals


def getStatDict(line: Stats | Goals):
    """
        Pulls all items in stats and goals models into a nice dictionary to
        read from and update.

    """
    return {
        'water': line.water
    }

def getSummary(days: int, user: str, statistic: str):
    filter_dict = {"user": user}
    if days > 0:
        oldest = timezone.now() - timedelta(days)
        filter_dict["date__gte"] = oldest

    lines = Stats.objects.filter(**filter_dict)

    response:dict = lines.aggregate(total=Sum(statistic),
                                    average=Avg(statistic),
                                    low=Min(statistic),
                                    high=Max(statistic))

    return response

def getBarChart(days: int, bins: int, user: str, statistic: str):
    days_per_bin = days//bins

    bin_dict = {}
    lower_date = timezone.now() - timedelta(days)
    filter = {
        'user': user,
        'date__gt': lower_date,
        'date__lte': lower_date + timedelta(days_per_bin)
    }

    for i in range(bins):
        bin_dict[i] = Stats.objects.filter(**filter).aggregate(
            total=Sum(statistic)
        )['total']

        if bin_dict[i] is None:
            bin_dict[i] = 0

        bin_dict[i] /= days_per_bin

        filter['date__gt'] = filter['date__lte']
        filter['date__lte'] += timedelta(days_per_bin)

    return bin_dict

def getToday(user: str, statistic: str):

    filter = {
        'user': user,
        'date': timezone.now().date()
    }
    amount = getattr(Stats.objects.filter(**filter).first(), statistic)

    return amount

def getGoal(user: str, statName: str | None = None, day: datetime | None = None):
    """
        Retrieves the latest goal, either for a given stat or just for all stats
        combined.

        If no day was given, will retrieve the most recent goal.
    """
    if day is None:
        day = timezone.now()

    filter = {
        'user': user,
        'date__lte': day.date()
    }

    line = Goals.objects.filter(filter).order_by('-date').first()

    if line is None:
        line = Goals()

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
    for statName, value in goal_data.items():
        setattr(oldLine, statName, value)
    oldLine.update({
        'date': day.date(),
        'user': user
    })

    Goals.objects.update_or_create(**oldLine)
