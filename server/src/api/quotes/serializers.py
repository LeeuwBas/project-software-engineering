from rest_framework import serializers


class QuoteRequestSerializer(serializers.Serializer):
    action = serializers.CharField(max_length=100)
    level = serializers.CharField(max_length=100)
    context = serializers.CharField(max_length=100)


class QuoteResponseSerializer(serializers.Serializer):
    quote = serializers.CharField()
