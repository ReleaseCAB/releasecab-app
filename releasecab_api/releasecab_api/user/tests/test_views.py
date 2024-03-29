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

    def test_admin_can_create_role_success(self):
        url = reverse('role-create')
        self.client.force_login(self.admin_user)
        payload = {
            "name": "New Role",
            "description": "New Description"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_can_delete_role_success(self):
        url = reverse('role-delete', kwargs={'pk': self.role.pk})
        self.client.force_login(self.admin_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_can_retrieve_role_detail_success(self):
        url = reverse('get-role-by-id', kwargs={'pk': self.role.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unauthenticated_user_cannot_retrieve_role_list_by_tenant_failure(
            self):
        url = reverse('role-list-by-tenant')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_admin_can_retrieve_role_list_by_tenant_success(self):
        url = reverse('role-list-by-tenant')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
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

    def test_admin_can_delete_team_success(self):
        url = reverse('team-delete', kwargs={'pk': self.team.pk})
        self.client.force_login(self.admin_user)
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_can_retrieve_team_by_id_success(self):
        url = reverse('team-retrieve', kwargs={'pk': self.team.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_retrieve_managed_teams_list_success(self):
        url = reverse('admin-team-list')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_cannot_retrieve_managed_teams_list_failure(self):
        url = reverse('admin-team-list')
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_managed_teams_list_success(self):
        url = reverse('user-managed-teams')
        self.client.force_login(self.tenant_owner)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_add_user_to_teams_success(self):
        url = reverse('team-add-users')
        self.client.force_login(self.admin_user)
        payload = {
            "user_id": self.tenant_owner.id,
            "team_ids": [self.team.id]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


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
        self.user = User.objects.create(
            email="user@example.com",
            password="password789",
            tenant=self.tenant
        )

    def test_admin_user_list(self):
        url = reverse('admin-user-list')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_user_detail(self):
        url = reverse('admin-user-detail', kwargs={'pk': self.user.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_me_detail(self):
        url = reverse('me-detail')
        self.client.force_login(self.user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_user_by_id(self):
        url = reverse('get-user-by-id', kwargs={'pk': self.user.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_update(self):
        url = reverse('user-update')
        self.client.force_login(self.user)
        payload = {
            "first_name": "Updated",
            "last_name": "User",
            "email": "updated@example.com"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_user_view(self):
        url = reverse('update-user', kwargs={'pk': self.user.pk})
        self.client.force_login(self.admin_user)
        payload = {
            "first_name": "Updated",
            "last_name": "User",
            "email": "updated@example.com"
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_validation_view(self):
        url = reverse('user-validation')
        payload = {"email": "new@example.com"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_list_by_tenant(self):
        url = reverse('user-list-by-tenant')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_profile_search_view(self):
        url = reverse('user-profile-search')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_create_view(self):
        url = reverse('user-create')
        payload = {
            "email": "newuser@example.com",
            "tenant": self.tenant.id,
            "password": "test12344"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_login_view(self):
        url = reverse('login')
        payload = {"email": "user@example.com", "password": "password789"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_session_view(self):
        url = reverse('logout-session')
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
