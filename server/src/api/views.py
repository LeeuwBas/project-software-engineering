from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Sum, Max, Min, Count, Avg

from rest_framework import mixins, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema, OpenApiParameter
from drf_spectacular.types import OpenApiTypes

from .serializers import UserSerializer, StatsSerializer
from .permissions import IsSelf
from .models import Stats
from datetime import timedelta

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


class StatRequestAverage(APIView):
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

        filter_dict = {"user": request.user}
        if days > 0:
            oldest = timezone.now() - timedelta(days)
            filter_dict["date__gte"] = oldest

        lines = Stats.objects.filter(**filter_dict)

        response:dict = lines.aggregate(total_water=Sum('water_amount'),
                                        average_water=Avg('water_amount'),
                                        minimum_water=Min('water_amount'),
                                        maximum_water=Max('water_amount'))


        return Response(response)
