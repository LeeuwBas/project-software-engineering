import random
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import QuoteRequestSerializer


@api_view(['POST'])
@permission_classes([AllowAny])
def get_quote(request):
    serializer = QuoteRequestSerializer(data=request.data)

<<<<<<< HEAD
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
                selected_quote = random.choice(lines).strip('\n')
                return Response({'text': selected_quote})
            except FileNotFoundError:
                # Handle if file does not exist
                return Response(
                    {'error': 'No quotes found in the database.'},
                    status=status.HTTP_404_NOT_FOUND,
                )

        return Response(
            {'status': 'success', 'quote': quote}, status=status.HTTP_200_OK
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
=======
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
>>>>>>> b9087bf (single quote style)
