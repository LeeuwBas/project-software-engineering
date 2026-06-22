from rest_framework import serializers

from .models import Stats


class StatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = "__all__"


class QuoteRequestSerializer(serializers.Serializer):
    action = serializers.CharField(max_length=100)
    level = serializers.CharField(max_length=100)
    context = serializers.CharField(max_length=100)


class QuoteResponseSerializer(serializers.Serializer):
    quote = serializers.CharField()
