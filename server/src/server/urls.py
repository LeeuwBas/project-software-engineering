"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.conf import settings
from django.contrib import admin

from django.urls import path, include
from rest_framework import routers
from api.statistics.views import (
    GoalManageView,
    CalendarView,
    StatManageView,
    BarchartView,
    SummaryView, GoalBulkView, StatBulkView
)
from api.quotes.views import RequestQuote

from django.urls import path, include
from rest_framework import routers
from api.authentication.views import UserViewSet
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from drf_spectacular.contrib.rest_framework_simplejwt import SimpleJWTScheme

router = routers.DefaultRouter()
router.register(r"users", UserViewSet)

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path("api/get-quote/", RequestQuote.as_view(), name="RequestQuote"),
    path("api/goals/<str:goal_date>", GoalManageView.as_view(), name="goal_endpoint"),
    path("api/goals/bulk/", GoalBulkView.as_view(), name="goal_bulk_endpoint"),
    path("api/calendar/<str:start_date>/<str:end_date>", CalendarView.as_view(), name="calendar_endpoint"),
    path("api/stats/<str:date>", StatManageView.as_view(), name="stat_manager"),
    path("api/stats/bulk/", StatBulkView.as_view(), name="stat_bulk_endpoint"),
    path("api/barchart/<str:statName>/<str:startDate>/<str:endDate>/", BarchartView.as_view(), name="bar_chart"),
    path("api/summary/<str:statName>/<str:startDate>/<str:endDate>/", SummaryView.as_view(), name="summary_view"),
    path('', include(router.urls)),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

if settings.DEBUG:
    # Provides the authentication button in the swagger-ui
    class VersionedJWTScheme(SimpleJWTScheme):
        target_class = "api.authentication.authentication.MarkedJWTAuthentication"

    # Enables the schema and swagger-ui views
    urlpatterns += [
        path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
        path(
            "api/schema/swagger-ui/",
            SpectacularSwaggerView.as_view(url_name="schema"),
            name="swagger-ui",
        ),
    ]
