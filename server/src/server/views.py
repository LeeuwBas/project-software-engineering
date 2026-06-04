import random

from drf_spectacular.utils import extend_schema
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .serializers import QuoteRequestSerializer, QuoteResponseSerializer

@extend_schema(
    request=QuoteRequestSerializer,
    responses={
        200: QuoteResponseSerializer,
    },
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_quote(request):
    serializer = QuoteRequestSerializer(data=request.data)

    if serializer.is_valid():
        mood = serializer.validated_data['mood']
        action = serializer.validated_data['action']

        if mood.lower() == 'tired' and action.lower() == 'coding':
            quote = 'Take a break. Even the best code needs a coffee.'
        else:
            try:
                with open('resources/quotes.txt', 'r') as f:
                    lines = f.readlines()
                # Select and format a random quote.
                quote = random.choice(lines).strip('\n')
            except FileNotFoundError:
                # Handle if file does not exist
                return Response(
                    {'error': 'No quotes found in the database.'},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response(
            QuoteResponseSerializer(quote),
            status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
