from rest_framework import serializers

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    inline_serializer,
)
from drf_spectacular.types import OpenApiTypes


STAT_GET_SCHEMA = extend_schema(
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

STAT_POST_SCHEMA = extend_schema(
    summary="Updates the given statistics on the given day",
    description="""Sets or updates the statistics for a day set in the path.
        Request body must be a dictionary, any key not in the dictionary will not be
        changed or set to the default value in case there is no data of the day.
            """,
    parameters=[
        OpenApiParameter(
            name="date",
            description="Date to insert the data for.",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            required=True,
        ),
    ],
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "stats": {
                    "type": "object",
                    "description": "Statistics to be inserted. <internal_name>:<val>",
                    "additionalProperties": {"type": "number"},
                }
            },
            "required": ["stats"],
        }
    },
    responses={
        200: OpenApiResponse(description="Statistics successfully updated or created."),
        400: OpenApiResponse(description="Invalid input."),
        401: OpenApiResponse(description="Unauthorised request."),
    },
)

STAT_BULK_GET_SCHEMA = extend_schema(
    summary="Retrieves the set stat at a given date range",
    description="""Retrieves the stats of a given date range for a given
                module. If the module is not supplied it will return all stats.
                """,
    parameters=[
        OpenApiParameter(
            name="start_date",
            description="Start date for the stats.",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=True,
        ),
        OpenApiParameter(
            name="end_date",
            description="End date of the stats.",
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
        401: OpenApiResponse(description="Unauthorised request."),
    },
)

STAT_BULK_POST_SCHEMA = extend_schema(
    summary="Sets a new stat",
    description="""Updates or inserts a new stat 
                    for a given date range""",
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "object",
                    "description": "Stats that need to be updated. "
                    "<internal_name>:<val>",
                    "additionalProperties": {"type": "number"},
                }
            },
        }
    },
    responses={
        200: OpenApiResponse(
            description="Updated or created stat values for given dates."
        ),
        400: OpenApiResponse(description="Invalid Input."),
        401: OpenApiResponse(description="Unauthorised request."),
    },
)

BARCHART_GET_SCHEMA = extend_schema(
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

SUMMARY_GET_SCHEMA = extend_schema(
    summary="Retrieves the summary view of a given date range.",
    description="""Retrieves the total, average, minimum on a 
            date and maximum on a date in the range.
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
            description="Start date of the summary view.",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            required=True,
        ),
        OpenApiParameter(
            name="endDate",
            description="End date of the summary view.",
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

GOAL_GET_SCHEMA = extend_schema(
    summary="Retrieves the set goal at a given date.",
    description="""Retrieves the goals of a given dat for a given
            module. If the module is not supplied it will return all set goals.
            """,
    parameters=[
        OpenApiParameter(
            name="goal_date",
            description="Date for which the requested goal was active.",
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
        401: OpenApiResponse(description="Unauthorised request."),
    },
)

GOAL_POST_SCHEMA = extend_schema(
    summary="Sets a new goal",
    description="""Updates or inserts a new goal to be followed for a single date.
            """,
    parameters=[
        OpenApiParameter(
            name="goal_date",
            description="Date for which to set the goal.",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            required=True,
        ),
    ],
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "goals": {
                    "type": "object",
                    "description": "Goals that need to be updated."
                    "<internal_name>:<val>",
                    "additionalProperties": {"type": "number"},
                }
            },
        }
    },
    responses={
        200: OpenApiResponse(description="Updated goal(s) for specified date."),
        400: OpenApiResponse(description="Invalid input."),
        401: OpenApiResponse(description="Unauthorised request."),
    },
)

GOAL_BULK_GET_SCHEMA = extend_schema(
    summary="Retrieves the set goal at a given date range",
    description="""Retrieves the goals of a given date range for a given
                module. If the module is not supplied it will return all set goals.
                """,
    parameters=[
        OpenApiParameter(
            name="start_date",
            description="Start date for the goals.",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            required=True,
        ),
        OpenApiParameter(
            name="end_date",
            description="End date of the goal.",
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
        400: OpenApiResponse(description="Invalid input."),
        401: OpenApiResponse(description="Unauthorised request."),
    },
)

GOAL_BULK_POST_SCHEMA = extend_schema(
    summary="Sets a new goal",
    description="""Updates or inserts a new goal to be followed. for a given date range
                """,
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "date": {
                    "type": "object",
                    "description": "Goals that need to be updated."
                    "<internal_name>:<val>",
                    "additionalProperties": {"type": "number"},
                }
            },
        }
    },
    responses={
        200: OpenApiResponse(description="Updated goals for specified dates."),
        400: OpenApiResponse(description="Invalid input."),
        401: OpenApiResponse(description="Unauthorised request."),
    },
)

CALENDAR_GET_SCHEMA = extend_schema(
    summary="Retrieves the calendar view of a given date range.",
    description="""Retrieves boolean data if all goals are completed
            for a given date range. Inclusive on both sides of the date range
            (a <= b <= c).

            Element 0 of the return array is the oldest date.
            """,
    parameters=[
        OpenApiParameter(
            name="start_date",
            description="Start date of the calendar view.",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.PATH,
            required=True,
        ),
        OpenApiParameter(
            name="end_date",
            description="End date of the calender view.",
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
        401: OpenApiResponse(description="Unauthorised request."),
    },
)
