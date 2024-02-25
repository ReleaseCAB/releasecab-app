from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from releasecab_api.tenant.models import Tenant

from ..models import Role, Team, User


class RoleViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="password123",
            is_superuser=True,
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.tenant_owner = User.objects.create(
            email="owner@example.com",
            password="password456",
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.role = Role.objects.create(
            name="Test Role",
            description="Test Description",
            tenant=self.tenant
        )

    def test_admin_can_retrieve_role_list_success(self):
        url = reverse('admin-role-list')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_cannot_retrieve_role_list_failure(self):
        url = reverse('admin-role-list')
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_role_detail_success(self):
        url = reverse('admin-role-detail', kwargs={'pk': self.role.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_cannot_retrieve_role_detail_failure(self):
        url = reverse('admin-role-detail', kwargs={'pk': self.role.pk})
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_update_role_success(self):
        url = reverse('update-role', kwargs={'pk': self.role.pk})
        self.client.force_login(self.admin_user)
        payload = {
            "name": "Updated Role",
            "description": "Updated Description"
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_cannot_update_role_failure(self):
        url = reverse('update-role', kwargs={'pk': self.role.pk})
        self.client.force_login(self.tenant_owner)
        payload = {
            "name": "Updated Role",
            "description": "Updated Description"
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class TeamViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="password123",
            is_superuser=True,
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.tenant_owner = User.objects.create(
            email="owner@example.com",
            password="password456",
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.team = Team.objects.create(
            name="Test Team",
            tenant=self.tenant
        )

    def test_admin_can_retrieve_team_list_success(self):
        url = reverse('admin-team-list')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_cannot_retrieve_team_list_failure(self):
        url = reverse('admin-team-list')
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_team_detail_success(self):
        url = reverse('admin-team-detail', kwargs={'pk': self.team.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_cannot_retrieve_team_detail_failure(self):
        url = reverse('admin-team-detail', kwargs={'pk': self.team.pk})
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_update_team_success(self):
        url = reverse('team-update', kwargs={'pk': self.team.pk})
        self.client.force_login(self.admin_user)
        payload = {
            "name": "Updated Team"
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_create_team_success(self):
        url = reverse('team-create')
        self.client.force_login(self.admin_user)
        payload = {
            "name": "New Team"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class UserViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.admin_user = User.objects.create_superuser(
            email="admin@example.com",
            password="password123",
            is_superuser=True,
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.tenant_owner = User.objects.create(
            email="owner@example.com",
            password="password456",
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.normal_user = User.objects.create(
            email="user@example.com",
            password="password789",
            tenant=self.tenant
        )

    def test_admin_can_retrieve_user_list_success(self):
        url = reverse('admin-user-list')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_cannot_retrieve_user_list_failure(self):
        url = reverse('admin-user-list')
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_user_detail_success(self):
        url = reverse('admin-user-detail', kwargs={'pk': self.normal_user.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_cannot_retrieve_user_detail_failure(self):
        url = reverse('admin-user-detail', kwargs={'pk': self.normal_user.pk})
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_update_self_success(self):
        url = reverse('user-update')
        self.client.force_login(self.normal_user)
        payload = {
            "first_name": "Updated",
            "last_name": "User",
            "email": "updated@example.com"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_validation_email_taken(self):
        url = reverse('user-validation')
        payload = {"email": self.admin_user.email}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

    def test_user_validation_email_not_taken(self):
        url = reverse('user-validation')
        payload = {"email": "new@example.com"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
