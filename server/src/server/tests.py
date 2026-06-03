from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Quote


class RandomQuoteAPITests(APITestCase):
    def setUp(self):
        self.url = reverse('random-quote')

    def test_Get_random_quote_empty_database(self):
        response = self.client.get(self.url)

        # Expect a 404 error with No quotes found message.
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.data)
        self.assertEqual(response.data['error'], 'No quotes found in the database.')

    def test_get_random_quote_success(self):
        quote1 = Quote.objects.create(text='To be or not to be.')
        quote2 = Quote.objects.create(text='I think, therefore I am.')

        response = self.client.get(self.url)

        # Expect a code 200 with one of the 2 quotes.
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn(response.data['text'], [quote1.text, quote2.text])
