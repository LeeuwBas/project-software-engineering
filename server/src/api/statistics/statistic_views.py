from django.utils import timezone
from django.db.models import Sum, Max, Min, Avg, F

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from datetime import timedelta

from drf_spectacular.utils import extend_schema, OpenApiParameter,\
                                  OpenApiResponse
from drf_spectacular.types import OpenApiTypes

from ..serializers import StatsSerializer
from ..permissions import IsSelf
from ..models import Stats

from .statistics_helper import getBarChart, getSummary, getToday

class StatsWaterRequestAverage(APIView):
    permission_classes = [IsAuthenticated, IsSelf]

    @extend_schema(
            summary="Get calculated stats about water usage.",
            description="""Returns calculated stats about water consumption,
                           stats are from the authenticated user, optionally
                           limited how many days are summarized.""",
            parameters=[
                OpenApiParameter(
                    name="days",
                    type=OpenApiTypes.INT,
                    location=OpenApiParameter.QUERY,
                    description="amount of days you want to summarize",
                    required=False
                )
            ],
            responses={
                200: {
                    'type': 'object',
                    'properties': {
                        'total_water':   {'type': 'integer'},
                        'average_water': {'type': 'number'},
                        'minimum_water': {'type': 'integer'},
                        'maximum_water': {'type': 'integer'},
                    }
                }
            }
    )
    def get(self, request):
        days = int(request.query_params.get('days', 0))

        response = getSummary(days, request.user, 'water')

        return Response(response)


class StatsWaterUpdate(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @extend_schema(
            summary="Update or insert the water usage at a given date",
            description="""Update the amount of water that is stored by
                           amount. If the line does not yet exist, makes a new
                           entry.""",
            parameters=[
                OpenApiParameter(
                    name="amount",
                    description="Amount of glasses of water to add.",
                    type=OpenApiTypes.INT,
                    location=OpenApiParameter.QUERY,
                    required=True
                )
            ],
            responses={
                200: {
                    'type': 'object',
                    'properties': {
                        'new_value': {'type': 'integer', 'example': 5},
                        'inserted_value': {'type': 'boolean', 'example': False}
                    }
                },
                400: OpenApiResponse(description="Invalid input.")
            }
    )
    def post(self, request):
        amount = request.query_params.get('amount', None)
        print(request.query_params)

        if amount is None:
            return Response(
                {'error': 'Amount of glasses drank needs to be set.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        line, created = Stats.objects.get_or_create(
            user = request.user,
            date = timezone.now().date(),
            defaults={'water': amount}
        )

        if not created:
            line.water = F("water") + amount
            line.save()
            line.refresh_from_db()

        return Response({
            'new_value': line.water,
            'inserted_line': created,
        })


class StatsWaterBarChart(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
            summary="Calculates and returns a set of bins to display water " \
                    "stats in a bar chart.",
            description="Calculates and returns a set of bins to display " \
                        "water statistics in a bar chart. Calculates the " \
                        "average value per day for every bin. The amount of " \
                        "days must be a multiple of the bin count.",
            parameters=[
                OpenApiParameter(
                    name='days',
                    type=OpenApiTypes.INT,
                    description="Amount of days to look back.",
                    location=OpenApiParameter.QUERY,
                    required=True
                ),
                OpenApiParameter(
                    name='bin_count',
                    type=OpenApiTypes.INT,
                    description="Amount of bins to include in the graph.",
                    location=OpenApiParameter.QUERY,
                    required=True
                )
            ],
            responses={
                200: {
                    'type': 'object',
                    'properties': {
                        'days_per_bin': {
                            'type': 'integer',
                            'example': 5,
                        },
                        'bins': {
                            'type': 'object',
                            'additionalProperties': {'type': 'integer'},
                            'example': {
                                '0': 5,
                                '1': 8,
                                '2': 3
                            }
                        }
                    }
                },
                400: OpenApiResponse(description="Invalid input."),
            }
    )
    def get(self, request):
        days = int(request.query_params.get('days', 0))
        bins = int(request.query_params.get('bin_count', 0))

        if days == 0 or bins == 0 or days % bins != 0:
            return Response(
                {'error': 'Invalid input.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        bin_dict = getBarChart(days, bins, request.user, "water")

        print(bin_dict)
        return Response({
            'days_per_bin': days//bins,
            'bins': bin_dict
        })

class StatisticsView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(
            summary="Endpoint to request statistics for barcharts and averages.",
            parameters=[
                OpenApiParameter(
                    name='days',
                    type=OpenApiTypes.INT,
                    description="Amount of days to look back.",
                    location=OpenApiParameter.QUERY,
                    required=True
                ),
                OpenApiParameter(
                    name='bin_count',
                    type=OpenApiTypes.INT,
                    description="Amount of bins to include in the graph.",
                    location=OpenApiParameter.QUERY,
                    required=True
                ),
                OpenApiParameter(
                    name='statistic',
                    type=OpenApiTypes.STR,
                    description="statistic to view",
                    location=OpenApiParameter.QUERY,
                    required=True
                )
            ],
            responses={
                200: {
                    'type': 'object',
                    'properties': {
                        'days_per_bin': {
                            'type': 'integer',
                            'example': 5
                        },
                        'bins': {
                            'type': 'object',
                            'additionalProperties': {'type': 'integer'},
                            'example': {
                                '0': 5,
                                '1': 8,
                                '2': 3
                            }
                        },
                        'today': {
                            'type': 'integer',
                            'example': 5
                        },
                        'properties': {
                            'total_water':   {
                                'type': 'integer',
                                'example': 5
                            },
                            'average_water': {
                                'type': 'number',
                                'example': 5
                            },
                            'minimum_water': {
                                'type': 'integer',
                                'example': 5
                            },
                            'maximum_water': {
                                'type': 'integer',
                                'example': 5
                            },
                        }
                    }
                }
            }
    )
    def get(self, request):
        days = int(request.query_params.get('days'))
        bin_count = int(request.query_params.get('bin_count'))
        statistic = request.query_params.get('statistic')

        print(statistic)

        today = getToday(request.user, statistic)
        summary = getSummary(days, request.user, statistic)
        bar_chart = getBarChart(days, bin_count, request.user, statistic)

        response = {
            'days_per_bin': days//bin_count,
            'bins': bar_chart,
            'today': today,
        }
        response.update(summary)

        return Response(response)
