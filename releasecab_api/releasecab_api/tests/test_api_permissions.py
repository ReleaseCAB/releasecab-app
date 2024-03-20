from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from releasecab_api.user.models import Team
from releasecab_api.tenant.models import Tenant

from releasecab_api.api_permissions import (
    IsAdminPermission,
    IsTenantOwnerPermission,
    CanCreateBlackoutsPermission,
    CanCreateReleasesPermission,
    IsTenantOwnerOrTeamManager,
)

User = get_user_model()

class PermissionsTestCase(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123"
        )
        self.user = User.objects.create(
            email='test@example.com',
            password='password123',
            tenant=self.tenant
        )
        self.team = Team.objects.create(
            name="Test Team",
            can_create_blackouts=False,
            can_create_releases=False,
            tenant=self.tenant
        )
        self.team.members.add(self.user)
        # self.team.managers.add(self.user)

    def test_is_admin_permission(self):
        request = APIRequestFactory().get('/')
        request.user = self.user
        self.assertFalse(IsAdminPermission().has_permission(request, None))
        self.user.is_superuser = True
        self.assertTrue(IsAdminPermission().has_permission(request, None))

    def test_is_tenant_owner_permission(self):
        request = APIRequestFactory().get('/')
        request.user = self.user
        self.assertFalse(IsTenantOwnerPermission().has_permission(request, None))
        self.user.is_tenant_owner = True
        self.assertTrue(IsTenantOwnerPermission().has_permission(request, None))

    def test_can_create_blackouts_permission(self):
        request = APIRequestFactory().get('/')
        request.user = self.user
        self.assertFalse(CanCreateBlackoutsPermission().has_permission(request, None))
        self.team.can_create_blackouts = True
        self.team.save()
        self.assertTrue(CanCreateBlackoutsPermission().has_permission(request, None))

    def test_can_create_releases_permission(self):
        request = APIRequestFactory().get('/')
        request.user = self.user
        self.assertFalse(CanCreateReleasesPermission().has_permission(request, None))
        self.team.can_create_releases = True
        self.team.save()
        self.assertTrue(CanCreateReleasesPermission().has_permission(request, None))

    def test_is_tenant_owner_or_team_manager_permission(self):
        request = APIRequestFactory().get('/')
        request.user = self.user
        self.assertFalse(IsTenantOwnerOrTeamManager().has_permission(request, None))

        self.user.is_tenant_owner = True
        self.assertTrue(IsTenantOwnerOrTeamManager().has_permission(request, None))

        self.user.is_tenant_owner = False
        self.team.managers.remove(self.user)
        self.assertFalse(IsTenantOwnerOrTeamManager().has_permission(request, None))

        self.team.managers.add(self.user)
        self.assertTrue(IsTenantOwnerOrTeamManager().has_permission(request, None))
