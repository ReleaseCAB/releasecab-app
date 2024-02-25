from django.test import TestCase

from releasecab_api.tenant.models import Tenant

from ..models import Role, Team, User


class UserModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.user = User.objects.create(
            email='test@example.com',
            password='password123',
            tenant=self.tenant
        )

    def test_user_creation(self):
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(self.user.email, 'test@example.com')
        self.assertFalse(self.user.is_staff)
        self.assertFalse(self.user.is_superuser)
        self.assertFalse(self.user.is_tenant_owner)

    def test_superuser_creation(self):
        superuser = User.objects.create_superuser(
            email='superuser@example.com',
            password='admin123'
        )
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_user_string_representation(self):
        self.assertEqual(str(self.user), 'test@example.com')


class RoleModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.role = Role.objects.create(
            name='Test Role',
            description='Test Description',
            tenant=self.tenant
        )

    def test_role_creation(self):
        self.assertEqual(Role.objects.count(), 1)
        self.assertEqual(self.role.name, 'Test Role')
        self.assertEqual(self.role.description, 'Test Description')

    def test_role_string_representation(self):
        self.assertEqual(str(self.role), 'Test Role')


class TeamModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.team = Team.objects.create(
            name='Test Team',
            can_create_blackouts=True,
            can_create_releases=False,
            tenant=self.tenant
        )
        self.user = User.objects.create(
            email='test@example.com',
            password="test123",
            tenant=self.tenant)

    def test_team_creation(self):
        self.assertEqual(Team.objects.count(), 1)
        self.assertEqual(self.team.name, 'Test Team')
        self.assertTrue(self.team.can_create_blackouts)
        self.assertFalse(self.team.can_create_releases)

    def test_add_member_to_team(self):
        self.assertEqual(self.team.members.count(), 0)
        self.team.members.add(self.user)
        self.assertEqual(self.team.members.count(), 1)
        self.assertTrue(self.user in self.team.members.all())

    def test_add_manager_to_team(self):
        self.assertEqual(self.team.managers.count(), 0)
        self.team.managers.add(self.user)
        self.assertEqual(self.team.managers.count(), 1)
        self.assertTrue(self.user in self.team.managers.all())

    def test_team_string_representation(self):
        self.assertEqual(str(self.team), 'Test Team')
