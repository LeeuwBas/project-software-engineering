from django.shortcuts import render
from .models import Quote
from .serializers import QuoteSerializer
import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny


class RandomQuoteAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, format=None):
        quote_ids = Quote.objects.values_list('id', flat=True)

        if not quote_ids:
            return Response(
                {'error': 'No quotes found in the database.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        random_id = random.choice(quote_ids)
        quote = Quote.objects.get(id=random_id)

        serializer = QuoteSerializer(quote)
        return Response(serializer.data)
