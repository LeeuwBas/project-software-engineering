from django.contrib.auth import get_user_model
from django.utils import timezone

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView


from .serializers import UserSerializer, StatsSerializer
from .permissions import IsSelf
from .models import Stats

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


class StatInsertView(CreateAPIView):
    queryset = Stats.objects.all()
    serializer_class = StatsSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        date = self.request.data.get('date', timezone.now())
        serializer.save(user=self.request.user, date=date)
