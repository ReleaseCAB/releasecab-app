from django.contrib.auth import get_user_model
from django.test import TestCase
from releasecab_api.user.models import Role, Team
from releasecab_api.tenant.models import Tenant
from ..helpers import ReleaseHelpers

User = get_user_model()

class TestReleaseHelpers(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.user = User.objects.create(
            email="user@example.com",
            password="password456",
            tenant=self.tenant,
            is_tenant_owner=True
        )
        self.role = Role.objects.create(name="Test Role", tenant=self.tenant)
        self.team = Team.objects.create(name="Test Team", tenant=self.tenant)

    def test_is_user_in_role_connection(self):
        self.user.role.add(self.role)
        self.assertTrue(ReleaseHelpers.is_user_in_role_connection(self.user, [{'id': self.role.id}]))
        self.assertTrue(ReleaseHelpers.is_user_in_role_connection(self.user, []))

    def test_is_user_in_team_connection(self):
        self.team.members.add(self.user)
        self.assertTrue(ReleaseHelpers.is_user_in_team_connection(self.user, [{'id': self.team.id}]))
        self.assertTrue(ReleaseHelpers.is_user_in_team_connection(self.user, []))
