from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from datetime import date

from .models import Stats, Goals


class StatisticsTests(TestCase):
    def setUp(self):
        self.User = get_user_model()
        self.client = APIClient()

        self.validDateUpper = "2026-06-14"
        self.validDateLower = "2026-05-14"
        self.invalidDate = "2026-60-14"

        self.manageURL = lambda date: reverse("stat_manager", args=[date])
        self.summaryURL = lambda statname, start, end: reverse(
            "summary_view", args=[statname, start, end]
        )
        self.barchartURL = lambda statname, start, end: reverse(
            "bar_chart", args=[statname, start, end]
        )

        self.firstuser = self.User.objects.create_user(
            username="test1", email="test1@test.com", password="verypassword"
        )

        self.seconduser = self.User.objects.create_user(
            username="test2", email="test2@test.com", password="passwordvery"
        )

    def authenticate(self, user):
        self.client.force_authenticate(user)

    def testUnauthGet(self):
        response = self.client.get(self.manageURL(self.validDateUpper))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(
            self.barchartURL("water", self.validDateLower, self.validDateUpper)
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        response = self.client.get(
            self.summaryURL("water", self.validDateLower, self.validDateUpper)
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def testUnauthPost(self):
        response = self.client.post(self.manageURL(self.validDateUpper))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def testStatSeperation(self):
        self.authenticate(self.firstuser)
        self.client.post(
            self.manageURL(self.validDateUpper),
            {"stats": {"water": 5, "sleep": 0, "food": 1}},
            format="json",
        )
        self.client.force_authenticate(user=None)

        self.authenticate(self.seconduser)
        response = self.client.get(self.manageURL(self.validDateUpper))

        self.assertEqual(response.json()["water"], 0)

    def testInsert(self):
        self.authenticate(self.firstuser)

        res = self.client.post(
            self.manageURL(self.validDateUpper),
            {"stats": {"water": 5, "sleep": 0, "food": 1}},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        fetchres = self.client.get(
            self.manageURL(self.validDateUpper), {"statName": "water"}
        )
        self.assertEqual(fetchres.status_code, status.HTTP_200_OK)
        self.assertEqual(fetchres.json()["water"], 5)

    def getRange(self):
        filter = {
            "user": self.firstuser,
            "date__gt": self.validDateLower,
            "date__lte": self.validDateUpper,
        }

        return Stats.objects.filter(**filter).values_list("water", flat=True)

    def testSummary(self):
        self.authenticate(self.firstuser)
        self.client.post(
            self.manageURL(self.validDateUpper),
            {"stats": {"water": 10, "sleep": 0, "food": 1}},
            format="json",
        )

        days = (
            date.fromisoformat(self.validDateUpper)
            - date.fromisoformat(self.validDateLower)
        ).days

        get_vals = self.getRange()
        self.assertTrue(len(get_vals) > 0, "No stats found in DB, broken post?")

        check = {
            'total': sum(get_vals),
            'minimum': min(get_vals) if get_vals.count() == days else 0,
            'maximum': max(get_vals),
            'count': days,
            'average': sum(get_vals)/days
        }

        res = self.client.get(
            self.summaryURL("water", self.validDateLower, self.validDateUpper)
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertDictEqual(check, res.json())

    def testbarchart(self):
        self.authenticate(self.firstuser)
        self.client.post(
            self.manageURL(self.validDateUpper),
            {"stats": {"water": 10, "sleep": 0, "food": 1}},
            format="json",
        )

        days = (
            date.fromisoformat(self.validDateUpper) - date.fromisoformat("2026-06-10")
        ).days

        check = {}
        for i in range(days):
            check[str(i)] = 0.0

        check[str(len(check.keys()) - 1)] = 10

        res = self.client.get(
            self.barchartURL("water", "2026-06-10", self.validDateUpper)
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertDictEqual(check, res.json())

    def testNewInsert(self):
        self.authenticate(self.firstuser)

        res = self.client.post(
            self.manageURL(self.validDateUpper),
            {"stats": {"water": 5, "sleep": 0, "food": 1}},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        res = self.client.post(
            self.manageURL(self.validDateUpper),
            {"stats": {"water": 10, "sleep": 0, "food": 1}},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        fetchres = self.client.get(
            self.manageURL(self.validDateUpper), {"statName": "water"}
        )
        self.assertEqual(fetchres.status_code, status.HTTP_200_OK)
        self.assertEqual(fetchres.json()["water"], 10)
