from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Stats, Goals

class StatisticsTests(TestCase):

    def setup(self):
        self.User = get_user_model()
        self.client = APIClient()

        self.validDateUpper = "2026-06-14"
        self.validDateLower = "2026-05-14"
        self.invalidDate = "2026-60-14"

        self.manageURL = lambda date: reverse("stat_manager", args=[date])
        self.summaryURL = lambda statname, start, end: reverse("summary_view", args=[statname, start, end])
        self.barchartURL = lambda statname, start, end: reverse("bar_chart", args=[statname, start, end])

        self.firstuser = self.User.objects.create_user(
            username = "test1@test.com",
            password = "verypassword"
        )

        self.seconduser = self.User.objects.create_user(
            username = "test2@test.com",
            password = "passwordvery"
        )


    def authenticate(self, user):
        self.client.force_login(user)

    def testUnAuthGet(self):
        response = self.client.get(self.manageURL(self.validDateUpper))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(self.barchartURL('water', self.validDateLower, self.validDateUpper))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        response = self.client.get(self.summaryURL('water', self.validDateLower, self.validDateUpper))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def testUnAuthPost(self):
        response = self.client.post(self.manageURL(self.validDateUpper))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def testOtherUser(self):
        self.authenticate(self.seconduser)
        response = self.client.post(self.manageURL(self.validDateUpper))
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def testInsert(self):
        self.authenticate(self.firstuser)
        res = self.client.post(self.manageURL(self.validDateUpper), {
            "water": 5
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)

        fetchres = self.client.get(self.manageURL(self.validDateUpper),{
            "statName": "water"
        })
        self.assertEqual(fetchres.content)
