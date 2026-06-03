import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


class RandomQuoteAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        try:
            with open('resources/quotes.txt', 'r') as f:
                lines = f.readlines()
            # Select and format a random quote.
            selected_quote = random.choice(lines).strip('\n')
            return Response({'text': selected_quote})
        except FileNotFoundError:
            # Handle if file does not exist
            return Response(
                {'error': 'No quotes found in the database.'},
                status=status.HTTP_404_NOT_FOUND,
            )
