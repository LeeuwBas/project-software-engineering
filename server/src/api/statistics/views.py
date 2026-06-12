from django.utils import timezone
from django.db.models import F

from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import extend_schema, OpenApiParameter,\
                                  OpenApiResponse, inline_serializer
from drf_spectacular.types import OpenApiTypes

from datetime import datetime

from .serializers import StatsSerializer
from ..authentication.permissions import IsSelf
from .models import Stats, Goals

from .helpers import getBarChart, getSummary, getDay, getGoal, setGoal, getCalender, setDay

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

        today = getDay(request.user, statistic)
        summary = getSummary(days, request.user, statistic)
        bar_chart = getBarChart(days, bin_count, request.user, statistic)

        response = {
            'days_per_bin': days//bin_count,
            'bins': bar_chart,
            'today': today,
        }
        response.update(summary)

        return Response(response)

"""
/api/stats/<date>/
    get:
        query param: statName, if None, return all stats of date

    post:
        data: statName and value dict. can have multiple in one go


/api/barchart/<statname>/<startDate>/<endDate>/
    get:
        query param: bins, if not provided, default to 1 day per bin

/api/summary/<statName>/<startDate>/<endDate>/
    get:
        no params

"""

class StatManageView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @extend_schema(
            summary="Retrieves the statistics data of a given date.",
            description="""Retrieves the statistics of a given date, if no name
            for the statistic was provided, the API will return all known stats.
            """,
            parameters=[
                OpenApiParameter(
                    name="date",
                    description="date for which the requested goal was active",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                ),
                OpenApiParameter(
                    name="statName",
                    description="Internal name of the goal. If not supplied, "\
                            "the api will return all goals at the given date.",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    required=False
                )
            ],
            responses={
                200: {
                    'type': 'object',
                    'properties': {
                        'goals': {
                            'type': 'object',
                            'additionalProperties': {'type': 'integer'},
                            'example': {
                                'water': 5
                            }
                        }
                    }
                },
                400: OpenApiResponse(description="Invalid input.")
            }
    )
    def get(self, request, date):
        statName = request.query_params.get('statName', None)
        day = datetime.fromisoformat(date)

        returnVal = getDay(request.user, statName, day)

        return Response(returnVal, 200)

    @extend_schema(
            summary="Retrieves the statistics data of a given date.",
            description="""Retrieves the statistics of a given date, if no name
            for the statistic was provided, the API will return all known stats.
            """,
            parameters=[
                OpenApiParameter(
                    name="date",
                    description="date for which the requested goal was active",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                )
            ],
            request={
                'application/json': {
                    'type': 'object',
                    'properties': {
                        'stats': {
                            'type': 'object',
                            'description': "Statistics to be inserted. "
                            "<internal_name>:<val>",
                            'additionalProperties': {'type': 'number'}
                        }
                    }
                }
            },
            responses={
                200: "ok",
                400: OpenApiResponse(description="Invalid input.")
            }
    )
    def post(self, request, date):
        stat_data = request.data.get('stats')
        day = datetime.fromisoformat(date)

        setDay(request.user, stat_data, day)

        return Response("ok", 200)


class BarchartView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @extend_schema(
            summary="Retrieves data for a bar chart between given dates.",
            description="""Retrieves the bin data to create a bar chart for a
            given statistic at a given date range. If bins is supplied, it must
            be divider of the amount of days. Date is exclusive on the lower
            bound and inclusive on the upper bound.
            """,
            parameters=[
                OpenApiParameter(
                    name="statName",
                    description="name of the statistic to get the bar chart.",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                ),
                OpenApiParameter(
                    name="startDate",
                    description="Start date of the bar chart. exclusive",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                ),
                OpenApiParameter(
                    name="endDate",
                    description="End date of the bar chart. inclusive",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                ),
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
                400: OpenApiResponse(description="Invalid input.")
            }
    )
    def get(self, request, statName, startDate, endDate):
        startDate = datetime.fromisoformat(startDate)
        endDate = datetime.fromisoformat(endDate)

        days = (endDate - startDate).days
        bins = request.query_params.get('bins', days)

        if days % bins != 0:
            return Response("Invalid input", 400)

        returnData = getBarChart(days, bins, request.user, statName)
        return Response(returnData, 200)


class GoalManageView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @extend_schema(
            summary="Retrieves the set goal at a given date.",
            description="""Retrieves the goals of a given dat for a given
            module. If the module is not supplied it will return all set goals.
            """,
            parameters=[
                OpenApiParameter(
                    name="goal_date",
                    description="date for which the requested goal was active",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                ),
                OpenApiParameter(
                    name="goal_name",
                    description="Internal name of the goal. If not supplied, "\
                            "the api will return all goals at the given date.",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.QUERY,
                    required=False
                )
            ],
            responses={
                200: {
                    'type': 'object',
                    'properties': {
                        'goals': {
                            'type': 'object',
                            'additionalProperties': {'type': 'integer'},
                            'example': {
                                'water': 5
                            }
                        }
                    }
                },
                400: OpenApiResponse(description="Invalid input.")
            }
    )
    def get(self, request, goal_date):
        goal_name = request.query_params.get('goal_name', None)
        day = datetime.fromisoformat(goal_date)

        goals = getGoal(request.user, goal_name, day)

        if goals is None:
            return Response(
                {'error': 'Invalid input.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if type(goals) is dict:
            return Response(goals, 200)
        else:
            return Response({goal_name: goals}, 200)

    @extend_schema(
            summary="Sets a new goal",
            description="""Updates or inserts a new goal to be followed.
            """,
            parameters=[
                OpenApiParameter(
                    name="goal_date",
                    description="date for which to set the goal",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                )
            ],
            request={
                'application/json': {
                    'type': 'object',
                    'properties': {
                        'goals': {
                            'type': 'object',
                            'description': "Goals that need to be updated. "
                            "<internal_name>:<val>",
                            'additionalProperties': {'type': 'number'}
                        }
                    }
                }
            },
            responses={
                200: "ok",
                400: "Invalid Input."
            }
    )
    def post(self, request, goal_date):
        goal_data = request.data.get('goals')
        day = datetime.fromisoformat(goal_date)

        if len(goal_data) == 0:
            return Response("Invalid input", 400)

        setGoal(request.user, goal_data, day)
        return Response("ok", 200)


class CalendarView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @extend_schema(
            summary="Retrieves the calendar view of a given date range.",
            description="""Retrieves boolean data if all goals are completed
            for a given date range. Inclusive on both sides of the date range
            (a <= b <= c).

            Element 0 of the return array is the oldest date.
            """,
            parameters=[
                OpenApiParameter(
                    name="start_date",
                    description="start date of the calendar view",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                ),
                OpenApiParameter(
                    name="end_date",
                    description="end date of the calender view",
                    type=OpenApiTypes.STR,
                    location=OpenApiParameter.PATH,
                    required=True
                )
            ],
            responses={
                200: inline_serializer(
                    name='MyResponse',
                    fields={
                        'key': serializers.CharField(),
                        'val': serializers.FloatField(),
                    },
                    many=True
                ),
                400: OpenApiResponse(description="Invalid input.")
            }
    )
    def get(self, request, start_date, end_date):
        startDay = datetime.fromisoformat(start_date)
        endDay = datetime.fromisoformat(end_date)

        if startDay >= endDay:
            return Response("Invalid Input", 400)

        returnList = getCalender(request.user, startDay, endDay)

        return Response(returnList, 200)
