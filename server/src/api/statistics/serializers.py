from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Stats

class StatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = "__all__"


class QuoteRequestSerializer(serializers.Serializer):
    mood = serializers.CharField(max_length=100)
    action = serializers.CharField(max_length=100)


class QuoteResponseSerializer(serializers.Serializer):
    quote = serializers.CharField()
