from django.contrib.auth import get_user_model
from django.utils import timezone
from django.db.models import Sum, Max, Min, Avg, F

from rest_framework import mixins, viewsets, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView

from drf_spectacular.utils import extend_schema, OpenApiParameter,\
                                  OpenApiResponse
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
            defaults={'water_amount': amount}
        )

        if not created:
            line.water_amount = F("water_amount") + amount
            line.save()
            line.refresh_from_db()

        return Response({
            'new_value': line.water_amount,
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

        days_per_bin = days//bins

        bin_dict = {}
        lower_date = timezone.now() - timedelta(days)
        filter = {
            'user': request.user,
            'date__gt': lower_date,
            'date__lte': lower_date + timedelta(days_per_bin)
        }

        for i in range(bins):
            bin_dict[i] = Stats.objects.filter(**filter).aggregate(
                total=Sum('water_amount')
            )['total']

            if bin_dict[i] is None:
                bin_dict[i] = 0

            bin_dict[i] /= days_per_bin

            filter['date__gt'] = filter['date__lte']
            filter['date__lte'] += timedelta(days_per_bin)

        print(bin_dict)
        return Response({
            'days_per_bin': days_per_bin,
            'bins': bin_dict
        })
