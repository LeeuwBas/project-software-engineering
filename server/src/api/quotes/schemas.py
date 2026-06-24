from drf_spectacular.utils import OpenApiResponse, extend_schema
from .serializers import QuoteRequestSerializer, QuoteResponseSerializer

QUOTE_GET_SCHEMA = extend_schema(
    summary="Get a random quote.",
    description="Returns a random quote supported by a specific mood or action.",
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
