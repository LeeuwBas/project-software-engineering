from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import User, Stats


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "email", "username", "settings", "password")
        read_only_fields = ("id",)

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class StatsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stats
        fields = "__all__"


class QuoteRequestSerializer(serializers.Serializer):
    mood = serializers.CharField(max_length=100)
    action = serializers.CharField(max_length=100)


class QuoteResponseSerializer(serializers.Serializer):
    quote = serializers.CharField()
