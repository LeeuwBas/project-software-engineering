from django.db import models
from django.utils import timezone

from ..authentication.models import User

class Stats(models.Model):
    """
        Simple stats model.
        Contains one line per user per day which holds the accumulated stats of
        the day.
        data held:
            user: holds the user id for identification
            date: holds date of the statistic

            water_amount: glasses of water drank on the given day
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    water = models.IntegerField(default=0)
