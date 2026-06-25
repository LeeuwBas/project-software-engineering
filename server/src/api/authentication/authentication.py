from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken


class IDMarkedRefreshToken(RefreshToken):
    """
    A Refresh token that also contains a login id, to identify the most recent session
    """
    @classmethod
    def for_user(cls, user):
        token = super().for_user(user)
        token["token_id"] = user.token_id # type: ignore[attr-defined]
        return token


class MarkedJWTAuthentication(JWTAuthentication):
    """
    An authenticated token, that validates tokens based on the token id.
    This makes sure that there can only be one token active at a time.
    """
    def get_user(self, validated_token):
        user = super().get_user(validated_token)

        # Validate that the token's token_id matches the user's token_id.
        if validated_token.get("token_id") != user.token_id: # type: ignore[attr-defined]
            raise AuthenticationFailed("Token is no longer valid")

        return user
