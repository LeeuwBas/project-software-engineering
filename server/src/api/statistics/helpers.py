from django.utils import timezone
from django.db.models import Sum, Max, Min, Avg, F

from datetime import timedelta

from .models import Stats


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
        'date': timezone.now()
    }
    amount = getattr(Stats.objects.filter(**filter).first(), statistic)

    return amount
