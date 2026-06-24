from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from ..statistics.serializers import QuoteRequestSerializer

from .helpers import get_json_quote

from .schemas import QUOTE_GET_SCHEMA

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

    @QUOTE_GET_SCHEMA
    def get(self, request):
        serializer = QuoteRequestSerializer(data=request.query_params)

        if serializer.is_valid():
            action = serializer.validated_data["action"]
            level = serializer.validated_data["level"]
            context = serializer.validated_data.get("context", "Standard")
            quote = get_json_quote(action, level, context)

            return Response({"quote": quote}, HTTP_200_OK)
        return Response(serializer.errors, HTTP_400_BAD_REQUEST)
