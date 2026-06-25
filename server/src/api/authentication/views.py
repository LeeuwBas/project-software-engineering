from django.contrib.auth import get_user_model

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response

from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.views import APIView

from .schemas import SETTINGS_GET_SCHEMA, SETTINGS_POST_SCHEMA

from .serializers import UserSerializer
from .permissions import IsSelf

User = get_user_model()

"""
Cheatsheet of the endpoints defined in this file. For descriptions on functionality
or extended descriptions on the parameters, check the documentation at the actual functions.

/users/settings
    get:
        returns the b64 string containing all settings.

    post:
        data: b64 encoded string of all settings.
"""

class UserViewSet(
    mixins.CreateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """
    A user view that allows for users to be viewed, created and updated.
    """
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

    @SETTINGS_GET_SCHEMA
    def get(self, request):
        return Response({"settings": request.user.settings}, HTTP_200_OK)

    @SETTINGS_POST_SCHEMA
    def post(self, request):
        settings = request.data.get("settings", None)

        if settings is None:
            return Response("Invalid input", HTTP_400_BAD_REQUEST)

        request.user.settings = settings
        request.user.save()
        return Response("ok", HTTP_200_OK)
