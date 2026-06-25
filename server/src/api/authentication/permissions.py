from rest_framework import permissions


class IsSelf(permissions.BasePermission):
    """
    Checks whether the user that makes the request has access to the information,
    as the information should be about themselves.
    """

    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.is_authenticated and getattr(obj, "pk", None) == request.user.pk)
