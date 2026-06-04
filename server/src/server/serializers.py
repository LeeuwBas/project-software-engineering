from django.utils.html import MAX_URL_LENGTH
from rest_framework import serializers


class QuoteRequestSerializer(serializers.Serializer):
    mood = serializers.CharField(max_length=100)
    action = serializers.CharField(max_length=100)

class QuoteResponseSerializer(serializers.Serializer):
    quote = serializers.CharField()
