from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
    inline_serializer,
)
from drf_spectacular.types import OpenApiTypes

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
    """TODO (LeeuwBas): docstring (see statistics/views.py for example)"""
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
    """TODO (david kramer): docstring (see statistics/views.py for example)"""
    permission_classes = [IsAuthenticated, IsSelf]

    @extend_schema(
        summary="Gets all active settings for the user",
        description="""Gets all active settings for the user""",
        responses={200: OpenApiResponse(description="the base64 settings")},
    )
    def get(self, request):
        return Response({"settings": request.user.settings}, 200)

    @extend_schema(
        summary="Replaces the new active user settings",
        description="Replaces the new active user settings",
        request={
            "application/json": {
                "type": "object",
                "properties": {
                    "settings": {
                        "type": "string",
                        "description": "Base 64 string of the settings."
                    }
                },
            }
        },
        responses={200: "ok"}
    )
    def post(self, request):
        settings = request.data.get("settings", None)

        if settings is None:
            return Response("Bad input", 400)

        request.user.settings = settings
        request.user.save()
        return Response("ok", 200)
