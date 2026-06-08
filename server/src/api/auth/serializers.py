from django.contrib.auth import get_user_model
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework_simplejwt.settings import api_settings

from api.auth.authentication import IDMarkedRefreshToken


class SingleSessionTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        self.user.token_id += 1
        self.user.save(update_fields=["token_id"])

        refresh = self.get_token(self.user)
        refresh["token_id"] = self.user.token_id

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data

class SingleSessionTokenRefreshSerializer(TokenRefreshSerializer):
    token_class = IDMarkedRefreshToken

    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.token_class(data["refresh"])

        user_id = refresh.payload.get(api_settings.USER_ID_CLAIM, None)
        user = get_user_model().objects.get(id=user_id)

        if not user_id or not user:
            raise AuthenticationFailed()

        if user.token_id != refresh.payload.get("token_id"):
            raise AuthenticationFailed("Session ended", "session_end")

        return data