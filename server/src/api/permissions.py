from rest_framework import permissions

class IsSelf(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return bool(request.user and request.user.is_authenticated and getattr(obj, "pk", None) == request.user.pk)
