from rest_framework.permissions import BasePermission

from releasecab_api.user.models import Team


class IsAdminPermission(BasePermission):
    """
    Permission class to check if the user is an admin.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_superuser)


class IsTenantOwnerPermission(BasePermission):
    """
    Permission class to check if the user is the owner of a tenant.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_tenant_owner)


class CanCreateBlackoutsPermission(BasePermission):
    """
    Permission class to check if the user can create blackouts.
    Tenant owners are assumed to be able to create blackouts
    """

    def has_permission(self, request, view):
        user_teams = Team.objects.filter(
            members=request.user, can_create_blackouts=True)
        return user_teams.exists() or request.user.is_tenant_owner


class CanCreateReleasesPermission(BasePermission):
    """
    Permission class to check if the user can create releases.
    Tenant owners are assumed to be able to create releases
    """

    def has_permission(self, request, view):
        user_teams = Team.objects.filter(
            members=request.user, can_create_releases=True)
        return user_teams.exists() or request.user.is_tenant_owner


class IsTenantOwnerOrTeamManager(BasePermission):
    """
    Permission class to check if the user is a tenant owner or a team manager.
    """

    def has_permission(self, request, view):
        user = request.user
        if user.is_tenant_owner:
            return True
        if user.teams_as_manager.exists():
            return True
        return False

    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.is_tenant_owner:
            return True
        if obj.managers.filter(id=user.id).exists():
            return True
        return False
