from django.forms.models import FieldError

from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
)
from drf_spectacular.types import OpenApiTypes

from .schemas import (
    STAT_GET_SCHEMA,
    STAT_POST_SCHEMA,
    STAT_BULK_GET_SCHEMA,
    STAT_BULK_POST_SCHEMA,
    GOAL_GET_SCHEMA,
    GOAL_POST_SCHEMA,
    GOAL_BULK_GET_SCHEMA,
    GOAL_BULK_POST_SCHEMA,
    CALENDAR_GET_SCHEMA,
)

from datetime import datetime, timedelta

from .serializers import StatsSerializer
from ..authentication.permissions import IsSelf
from .models import Stats, Goals

from .helpers import (
    getBarChart,
    getSummary,
    getDay,
    getGoal,
    setGoal,
    getCalender,
    setDay,
    getStatDict,
    toISOFormat,
)

"""
Cheatsheet of the endpoints defined in this file. For descriptions on functionality
or extended descriptions on the parameters, check the documentation at the actual functions.

/api/stats/<date>/
    get:
        query param: statName, if None, returns all stats of date

    post:
        data: statName and value dict. Can have multiple in single request

/api/stats/bulk/
    get:
        query params:
            stat_name, if None, returns all stats of date range
            start_date, required
            end_date, required

    post:
        data: dict with dates as keys and statName and value dicts as keys


/api/barchart/<statname>/<startDate>/<endDate>/
    get:
        query param: bins, if not provided, default to 1 day per bin

/api/summary/<statName>/<startDate>/<endDate>/
    get:
        no params

/api/goals/<goal_date>/
    get:
        query param: goal_name, if None, returns all goals of date

    post:
        data: statName and goal dict. Can have multiple in single request

/api/goals/bulk/
    get:
        query_params:
            goal_name, if None, returns all goals of date range
            start_date, required
            end_date, required

    post:
        data: dict with dates as keys and goalName and value dicts as keys

/api/calendar/<start_date>/<end_date>/
    get:
        no params

"""


class StatManageView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @STAT_GET_SCHEMA
    def get(self, request, date):
        statName = request.query_params.get("statName", None)
        day = datetime.fromisoformat(date)

        returnVal = getDay(request.user, statName, day)

        if returnVal is None:
            returnVal = getStatDict(Stats())

        if type(returnVal) is not dict:
            returnVal = {statName: returnVal}

        return Response(returnVal, HTTP_200_OK)

    @STAT_POST_SCHEMA
    def post(self, request, date):
        stat_data = request.data.get("stats")
        day = datetime.fromisoformat(date)

        setDay(request.user, stat_data, day)

        return Response("ok", HTTP_200_OK)


class StatBulkView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @STAT_BULK_GET_SCHEMA
    def get(self, request):
        stat_name = request.query_params.get("stat_name", None)
        start_date = request.query_params.get("start_date", None)
        end_date = request.query_params.get("end_date", None)
        try:
            day = datetime.fromisoformat(start_date)
            end_day = datetime.fromisoformat(end_date)
        except ValueError:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)

        if day + timedelta(days=90) < end_day:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)

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

        return Response(return_dict, HTTP_200_OK)

    @STAT_BULK_POST_SCHEMA
    def post(self, request):
        for date in request.data:
            data = request.data[date]
            if len(data) == 0:
                return Response("Invalid input", HTTP_400_BAD_REQUEST)

            try:
                day = datetime.fromisoformat(date)
            except ValueError:
                return Response("Invalid input", HTTP_400_BAD_REQUEST)
            setDay(request.user, request.data[date], day)

        return Response("ok", HTTP_200_OK)


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
                description="Name of the statistic to get the bar chart.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="startDate",
                description="Start date of the bar chart. (exclusive)",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="endDate",
                description="End date of the bar chart. (inclusive)",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="bins",
                description="Amount of bins to put the data in, defaults to the amount of days.",
                type=OpenApiTypes.INT,
                location=OpenApiParameter.QUERY,
                required=False,
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
            401: OpenApiResponse(description="Unauthorised request."),
        },
    )
    def get(self, request, statName, startDate, endDate):
        startDate = datetime.fromisoformat(startDate)
        endDate = datetime.fromisoformat(endDate)

        days = (endDate - startDate).days
        bins = int(request.query_params.get("bins", days))

        if days % bins != 0:
            return Response(
                f"Invalid input days%bins = {days % bins}", HTTP_400_BAD_REQUEST
            )

        returnData = getBarChart(startDate, endDate, bins, request.user, statName)
        return Response(returnData, HTTP_200_OK)


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
                description="Name of the stat to summarize.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="startDate",
                description="Start date of the calendar view.",
                type=OpenApiTypes.STR,
                location=OpenApiParameter.PATH,
                required=True,
            ),
            OpenApiParameter(
                name="endDate",
                description="End date of the calender view.",
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
            401: OpenApiResponse(description="Unauthorised request."),
        },
    )
    def get(self, request, statName, startDate, endDate):
        if endDate < startDate:
            Response("Invalid input", HTTP_400_BAD_REQUEST)

        startDate = datetime.fromisoformat(startDate)
        endDate = datetime.fromisoformat(endDate)

        returnDict = getSummary(request.user, statName, startDate, endDate)

        return Response(returnDict, HTTP_200_OK)


class GoalManageView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @GOAL_GET_SCHEMA
    def get(self, request, goal_date):
        goal_name = request.query_params.get("goal_name", None)
        if goal_name is None:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)
        day = datetime.fromisoformat(goal_date)

        goals = getGoal(request.user, goal_name, day)

        if goals is None:
            return Response(getStatDict(Goals()), HTTP_200_OK)

        if type(goals) is dict:
            return Response(goals, HTTP_200_OK)
        else:
            return Response({goal_name: goals}, HTTP_200_OK)

    @GOAL_POST_SCHEMA
    def post(self, request, goal_date):
        goal_data = request.data.get("goals")
        day = datetime.fromisoformat(goal_date)

        if goal_data is None or len(goal_data) == 0:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)

        try:
            setGoal(request.user, goal_data, day)
            return Response("ok", HTTP_200_OK)
        except FieldError:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)


class GoalBulkView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @GOAL_BULK_GET_SCHEMA
    def get(self, request):
        goal_name = request.query_params.get("goal_name", None)
        start_date = request.query_params.get("start_date", None)
        end_date = request.query_params.get("end_date", None)
        try:
            day = datetime.fromisoformat(start_date)
            end_day = datetime.fromisoformat(end_date)
        except ValueError:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)

        if day + timedelta(days=90) < end_day:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)

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

        return Response(return_dict, HTTP_200_OK)

    @GOAL_BULK_POST_SCHEMA
    def post(self, request):
        for date in request.data:
            data = request.data[date]
            if len(data) == 0:
                return Response("Invalid input", HTTP_400_BAD_REQUEST)

            try:
                day = datetime.fromisoformat(date)
            except ValueError:
                return Response("Invalid input", HTTP_400_BAD_REQUEST)
            try:
                setGoal(request.user, request.data[date], day)
            except FieldError:
                return Response("Invalid input", HTTP_400_BAD_REQUEST)

        return Response("ok", HTTP_200_OK)


class CalendarView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]
    serializer_class = StatsSerializer

    @CALENDAR_GET_SCHEMA
    def get(self, request, start_date, end_date):
        startDay = datetime.fromisoformat(start_date)
        endDay = datetime.fromisoformat(end_date)

        if startDay >= endDay:
            return Response("Invalid Input", HTTP_400_BAD_REQUEST)

        if startDay + timedelta(days=45) < endDay:
            return Response(
                {"reason": "Too long of a period requested"}, HTTP_400_BAD_REQUEST
            )

        returnList = getCalender(request.user, startDay, endDay)

        return Response(returnList, HTTP_200_OK)
