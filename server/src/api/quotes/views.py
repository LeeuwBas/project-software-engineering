
from drf_spectacular.utils import OpenApiResponse, extend_schema
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..statistics.serializers import (QuoteRequestSerializer,
                                      QuoteResponseSerializer)
from .helpers import get_json_quote

"""
/api/get-quote/
    get:
        query param: 
            action: string - Category of quote.
            level: string - 'strength' of requested quote.
            context: string - Extra contextual perameter for relevant context like if it's good weather or if the user
                exercised a lot today.
"""

class RequestQuote(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
        summary="Get a random quote.",
        description="Returns a random quote for a action, level, and context.",
        request=QuoteRequestSerializer,
        responses={
            200: OpenApiResponse(
                response=QuoteResponseSerializer,
                description="Successfully retrieved quote.",
            ),
            400: OpenApiResponse(
                description="Serializer invalid (missing fields or wrong types)."
            ),
            404: OpenApiResponse(description="Database or text file not found."),
        },
    )
    def get(self, request):
        serializer = QuoteRequestSerializer(data=request.query_params)

        if serializer.is_valid():
            action = serializer.validated_data["action"]
            level = serializer.validated_data["level"]
            context = serializer.validated_data.get("context", "Standard")
            quote = get_json_quote(action, level, context)

            return Response({"quote": quote}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
