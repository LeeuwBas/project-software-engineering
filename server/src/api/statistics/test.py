from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

class StatisticsTests(TestCase):

    def setup(self):
        self.User = get_user_model()
        self.client = APIClient()

        self.validDateUpper = "2026-06-14"
        self.validDateLower = "2026-05-14"
        self.invalidDate = "2026-60-14"

        self.manageURL = lambda date: reverse("stat_manager", args=[date])
        self.summaryURL = lambda date: reverse("summary_view", args=[date])
        self.barchartURL = lambda date: reverse("bar_chart", args=[date])


    def authenticate(self):
        self.client.force_au
