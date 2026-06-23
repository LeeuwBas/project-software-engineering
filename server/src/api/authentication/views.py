from django.contrib.auth import get_user_model

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from drf_spectacular.utils import (
    extend_schema,
    OpenApiResponse,
)

from .serializers import UserSerializer
from .permissions import IsSelf

User = get_user_model()


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == "create":
            return [AllowAny()]
        if self.action in ("retrieve", "update", "partial_update", "destroy"):
            return [IsAuthenticated(), IsSelf()]
        return [IsAuthenticated()]

    @action(detail=False, methods=["get"])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class SettingsView(APIView):
    permission_classes = [IsAuthenticated, IsSelf]

    @extend_schema(
        summary="Gets all active settings for the user",
        description="""Gets all active settings for the user""",
        responses={200: OpenApiResponse(description="the base64 settings")},
    )
    def get(self, request):
        return Response({"settings": request.user.settings}, HTTP_200_OK)

    @extend_schema(
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
    def post(self, request):
        settings = request.data.get("settings", None)

        if settings is None:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)

        request.user.settings = settings
        request.user.save()
        return Response("ok", HTTP_200_OK)
