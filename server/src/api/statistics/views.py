from django.utils import timezone
from django.db.models import F

from rest_framework import status, serializers
from rest_framework.status import HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    inline_serializer,
)
from drf_spectacular.types import OpenApiTypes

from datetime import datetime, timedelta

from .serializers import StatsSerializer
from ..authentication.permissions import IsSelf
from .models import Stats, Goals

from .helpers import getBarChart, getSummary, getDay, getGoal, setGoal, getCalender, setDay, getStatDict, toISOFormat

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
                required=True,
            ),
            OpenApiParameter(
                name="statName",
                description="Internal name of the goal. If not supplied, "
                "the api will return all goals at the given date.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
            ),
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "goals": {
                        "type": "object",
                        "additionalProperties": {"type": "integer"},
                        "example": {"water": 5},
                    }
                },
            },
            400: OpenApiResponse(description="Invalid input."),
        },
    )
    def get(self, request, date):
        statName = request.query_params.get("statName", None)
        day = datetime.fromisoformat(date)

        returnVal = getDay(request.user, statName, day)

        if returnVal is None:
            returnVal = getStatDict(Stats())

        if type(returnVal) is not dict:
            returnVal = {statName: returnVal}

        return Response(returnVal, 200)

    # TODO: Make POST request documentation (now GET)
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
                required=True,
            )
        ],
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "stats": {
                        "type": "object",
                        "description": "Statistics to be inserted. "
                        "<internal_name>:<val>",
                        "additionalProperties": {"type": "number"},
                    }
                },
            }
        },
        responses={200: "ok", 400: OpenApiResponse(description="Invalid input.")},
    )
    def post(self, request, date):
        stat_data = request.data.get("stats")
        day = datetime.fromisoformat(date)

        setDay(request.user, stat_data, day)

        return Response("ok", 200)


class StatBulkView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @extend_schema(
        summary="Retrieves the set stat at a given date range",
        description="""Retrieves the stats of a given date range for a given
                module. If the module is not supplied it will return all stats.
                """,
        parameters=[
            OpenApiParameter(
                name="start_date",
                description="start date for the stats",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            ),
            OpenApiParameter(
                name="end_date",
                description="End date of the stats",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            ),
            OpenApiParameter(
                name="stat_name",
                description="Internal name of the stat. If not supplied, "
                            "the api will return all stats at the given date.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
            ),
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "object",
                        "additionalProperties": {"type": "integer"},
                        "example": {"water": 5},
                    }
                },
            },
        },
    )
    def get(self, request):
        stat_name = request.query_params.get("stat_name", None)
        start_date = request.query_params.get("start_date", None)
        end_date = request.query_params.get("end_date", None)
        try:
            day = datetime.fromisoformat(start_date)
            end_day = datetime.fromisoformat(end_date)
        except ValueError:
            return Response(status=HTTP_400_BAD_REQUEST)

        if day + timedelta(days=90) < end_day:
            return Response(status=HTTP_400_BAD_REQUEST)

        return_dict = {}

        while day < end_day:
            stats = getDay(request.user, stat_name, day)
            if stats is None:
                stats = getStatDict(Stats()) if stat_name is None else {stat_name: 0}

            if type(stats) is dict:
                return_dict[toISOFormat(day)] = stats
            else:
                return_dict[toISOFormat(day)] = {stat_name: stats}

            day = day + timedelta(days=1)

        return Response(return_dict, 200)

    @extend_schema(
        summary="Sets a new stat",
        description="""Updates or inserts a new stat for a given date range
                """,
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "object",
                        "description": "Goals that need to be updated. "
                                       "<internal_name>:<val>",
                        "additionalProperties": {"type": "number"},
                    }
                },
            }
        },
        responses={200: "ok", 400: "Invalid Input."},
    )
    def post(self, request):
        for date in request.data:
            data = request.data[date]
            if len(data) == 0:
                return Response("Invalid input", 400)

            try:
                day = datetime.fromisoformat(date)
            except ValueError:
                return Response(status=HTTP_400_BAD_REQUEST)
            setDay(request.user, request.data[date], day)

        return Response(status=200)


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
                required=True,
            ),
            OpenApiParameter(
                name="startDate",
                description="Start date of the bar chart. exclusive",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="endDate",
                description="End date of the bar chart. inclusive",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="bins",
                description="Amount of bins to put the data in, defaults to the amount of days",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=True,
            ),
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "days_per_bin": {
                        "type": "integer",
                        "example": 5,
                    },
                    "bins": {
                        "type": "object",
                        "additionalProperties": {"type": "integer"},
                        "example": {"0": 5, "1": 8, "2": 3},
                    },
                },
            },
            400: OpenApiResponse(description="Invalid input."),
        },
    )
    def get(self, request, statName, startDate, endDate):
        startDate = datetime.fromisoformat(startDate)
        endDate = datetime.fromisoformat(endDate)

        days = (endDate - startDate).days
        bins = int(request.query_params.get("bins", days))

        if days % bins != 0:
            return Response(f"Invalid input days%bins = {days % bins}", 400)

        returnData = getBarChart(startDate, endDate, bins, request.user, statName)
        return Response(returnData, 200)


class SummaryView(APIView):
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
                name="statName",
                description="name of the stat to summarize.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="startDate",
                description="start date of the calendar view",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="endDate",
                description="end date of the calender view",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "total_water": {"type": "integer"},
                    "average_water": {"type": "number"},
                    "minimum_water": {"type": "integer"},
                    "maximum_water": {"type": "integer"},
                },
            },
            400: OpenApiResponse(description="Invalid input."),
        },
    )
    def get(self, request, statName, startDate, endDate):
        if endDate < startDate:
            Response("Invalid input", 400)

        startDate = datetime.fromisoformat(startDate)
        endDate = datetime.fromisoformat(endDate)

        returnDict = getSummary(request.user, statName, startDate, endDate)

        return Response(returnDict, 200)


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
                required=True,
            ),
            OpenApiParameter(
                name="goal_name",
                description="Internal name of the goal. If not supplied, "
                "the api will return all goals at the given date.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
            ),
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "goals": {
                        "type": "object",
                        "additionalProperties": {"type": "integer"},
                        "example": {"water": 5},
                    }
                },
            },
            400: OpenApiResponse(description="Invalid input."),
        },
    )
    def get(self, request, goal_date):
        goal_name = request.query_params.get("goal_name", None)
        day = datetime.fromisoformat(goal_date)

        goals = getGoal(request.user, goal_name, day)

        if goals is None:
            return Response(
                getStatDict(Goals()), status=status.HTTP_200_OK
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
                required=True,
            )
        ],
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "goals": {
                        "type": "object",
                        "description": "Goals that need to be updated. "
                        "<internal_name>:<val>",
                        "additionalProperties": {"type": "number"},
                    }
                },
            }
        },
        responses={200: "ok", 400: "Invalid Input."},
    )
    def post(self, request, goal_date):
        goal_data = request.data.get("goals")
        day = datetime.fromisoformat(goal_date)

        if len(goal_data) == 0:
            return Response("Invalid input", 400)

        setGoal(request.user, goal_data, day)
        return Response("ok", 200)

class GoalBulkView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @extend_schema(
        summary="Retrieves the set goal at a given date range",
        description="""Retrieves the goals of a given date range for a given
                module. If the module is not supplied it will return all set goals.
                """,
        parameters=[
            OpenApiParameter(
                name="start_date",
                description="start date for the goals",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            ),
            OpenApiParameter(
                name="end_date",
                description="End date of the goal",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=True,
            ),
            OpenApiParameter(
                name="goal_name",
                description="Internal name of the goal. If not supplied, "
                            "the api will return all goals at the given date.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.QUERY,
                required=False,
            ),
        ],
        responses={
            200: {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "object",
                        "additionalProperties": {"type": "integer"},
                        "example": {"water": 5},
                    }
                },
            },
        },
    )
    def get(self, request,):
        goal_name = request.query_params.get("goal_name", None)
        start_date = request.query_params.get("start_date", None)
        end_date = request.query_params.get("end_date", None)
        try:
            day = datetime.fromisoformat(start_date)
            end_day = datetime.fromisoformat(end_date)
        except ValueError:
            return Response(status=HTTP_400_BAD_REQUEST)

        if day + timedelta(days=90) < end_day:
            return Response(status=HTTP_400_BAD_REQUEST)

        return_dict = {}

        while day < end_day:
            goals = getGoal(request.user, goal_name, day)
            if goals is None:
                goals = getStatDict(Goals()) if goal_name is None else {goal_name: 0}

            if type(goals) is dict:
                return_dict[toISOFormat(day)] = goals
            else:
                return_dict[toISOFormat(day)] = {goal_name: goals}

            day = day + timedelta(days=1)

        return Response(return_dict, 200)

    @extend_schema(
        summary="Sets a new goal",
        description="""Updates or inserts a new goal to be followed. for a given date range
                """,
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "date": {
                        "type": "object",
                        "description": "Goals that need to be updated. "
                                       "<internal_name>:<val>",
                        "additionalProperties": {"type": "number"},
                    }
                },
            }
        },
        responses={200: "ok", 400: "Invalid Input."},
    )
    def post(self, request):
        for date in request.data:
            data = request.data[date]
            if len(data) == 0:
                return Response("Invalid input", 400)

            try:
                day = datetime.fromisoformat(date)
            except ValueError:
                return Response(status=HTTP_400_BAD_REQUEST)
            setGoal(request.user, request.data[date], day)

        return Response(status=200)


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
                required=True,
            ),
            OpenApiParameter(
                name="end_date",
                description="end date of the calender view",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
        ],
        responses={
            200: inline_serializer(
                name="MyResponse",
                fields={
                    "key": serializers.CharField(),
                    "val": serializers.FloatField(),
                },
                many=True,
            ),
            400: OpenApiResponse(description="Invalid input."),
        },
    )
    def get(self, request, start_date, end_date):
        startDay = datetime.fromisoformat(start_date)
        endDay = datetime.fromisoformat(end_date)

        if startDay >= endDay:
            return Response("Invalid Input", 400)

        returnList = getCalender(request.user, startDay, endDay)

        return Response(returnList, 200)
