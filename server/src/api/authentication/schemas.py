from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
)

SETTINGS_GET_SCHEMA = extend_schema(
    summary="Gets all active settings for the user",
    description="""Gets all active settings for the user""",
    responses={200: OpenApiResponse(description="the base64 settings")},
)

SETTINGS_POST_SCHEMA = extend_schema(
    summary="Replaces the new active user settings",
    description="Replaces the new active user settings",
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "settings": {
                    "type": "string",
                    "description": "Base 64 string of the settings.",
                }
            },
        }
    },
    responses={
        200: OpenApiResponse(description="ok"),
        400: OpenApiResponse(description="Invalid input"),
    },
)
