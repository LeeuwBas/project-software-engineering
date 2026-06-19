from unittest.mock import patch
from django.urls import reverse
from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APIClient

MOCK_QUOTES = {
    "idle": {
        "sad": {"Standard": ["Mock Idle Sad"]},
        "neutral": {"Standard": ["Mock Idle Neutral"]},
        "happy": {"Standard": ["Mock Idle Happy"]},
    },
    "click": {
        "sad": {"Standard": ["Mock Click Sad"]},
        "neutral": {"Standard": ["Mock Click Neutral"]},
        "happy": {"Standard": ["Mock Click Happy"]},
    },
}


class QuotesApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.quote_url = reverse("RequestQuote")
        self.User = get_user_model()
        creds = {
            self.User.USERNAME_FIELD: "authuser@example.com",
            "password": "testpass",
        }
        self.user = self.User.objects.create_user(**creds)

    @patch("api.quotes.helpers.load_quotes", return_value=MOCK_QUOTES)
    def test_get_quote_sad_idle(self, mock_load):
        self.client.force_authenticate(self.user)
        payload = {"action": "idle", "level": "sad", "context": "Standard"}
        res = self.client.get(self.quote_url, payload)

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertEqual(data["quote"], "Mock Idle Sad")

    @patch("api.quotes.helpers.load_quotes", return_value=MOCK_QUOTES)
    def test_get_quote_happy_click(self, mock_load):
        """Test picking a quote from the high-happiness 'happy' range during a click action."""
        self.client.force_authenticate(self.user)
        payload = {"action": "click", "level": "happy", "context": "Standard"}
        res = self.client.get(self.quote_url, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertEqual(data["quote"], "Mock Click Happy")

    def test_get_quote_missing_parameters(self):
        """Test that the API handles validation gracefully if query parameters are missing."""
        self.client.force_authenticate(self.user)
        payload = {"action": "idle"}
        res = self.client.get(self.quote_url, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("api.quotes.helpers.load_quotes", return_value=MOCK_QUOTES)
    def test_get_quote_invalid_action(self, mock_load):
        """Test that the API returns a fallback quote when an unknown action is passed."""
        self.client.force_authenticate(self.user)
        payload = {"action": "dance", "level": "happy", "context": "Standard"}
        res = self.client.get(self.quote_url, payload, format="json")

        self.assertEqual(res.status_code, status.HTTP_200_OK)
        data = res.json()
        self.assertEqual(data["quote"], "What do you want from me?")
