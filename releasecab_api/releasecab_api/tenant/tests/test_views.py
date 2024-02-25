from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from releasecab_api.user.models import User

from ..models import InvitedUser, Tenant


class InvitedUserViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.admin_user = User.objects.create(
            email="admin@example.com",
            password="password123",
            is_staff=True,
            is_superuser=True,
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.normal_user = User.objects.create(
            email="normal@example.com",
            password="password456",
            tenant=self.tenant
        )
        self.invited_user = InvitedUser.objects.create(
            email="invited@example.com",
            tenant=self.tenant
        )

    def test_admin_can_retrieve_invited_users_list_success(self):
        url = reverse('admin-invited-user-list')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_cannot_retrieve_invited_users_list_failure(self):
        url = reverse('admin-invited-user-list')
        self.client.force_login(self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_normal_user_cannot_retrieve_invited_user_detail_failure(self):
        url = reverse(
            'admin-tenant-detail',
            kwargs={
                'pk': self.invited_user.pk})
        self.client.force_login(self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_invited_user_success(self):
        url = reverse('tenant-invited-users-create')
        self.client.force_login(self.admin_user)
        payload = {"email": "test@example.com"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_normal_user_cannot_create_invited_user_failure(self):
        url = reverse('tenant-invited-users-create')
        self.client.force_login(self.normal_user)
        payload = {"email": "test@example.com"}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_invited_users_by_tenant_success(self):
        url = reverse('tenant-invited-users')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_cannot_retrieve_invited_users_by_tenant_failure(self):
        url = reverse('tenant-invited-users')
        self.client.force_login(self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class TenantViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.admin_user = User.objects.create(
            email="admin@example.com",
            password="password123",
            is_staff=True,
            is_superuser=True,
            is_tenant_owner=True,
            tenant=self.tenant
        )
        self.normal_user = User.objects.create(
            email="normal@example.com",
            password="password456",
            tenant=self.tenant
        )
        self.invite_code = "TEST123"

    def test_admin_can_retrieve_tenant_list_success(self):
        url = reverse('admin-tenant-list')
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_cannot_retrieve_tenant_list_failure(self):
        url = reverse('admin-tenant-list')
        self.client.force_login(self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_tenant_detail_success(self):
        tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code=self.invite_code + '1'
        )
        url = reverse('admin-tenant-detail', kwargs={'pk': tenant.pk})
        self.client.force_login(self.admin_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_normal_user_cannot_retrieve_tenant_detail_failure(self):
        tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code=self.invite_code + '2'
        )
        url = reverse('admin-tenant-detail', kwargs={'pk': tenant.pk})
        self.client.force_login(self.normal_user)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_create_tenant_success(self):
        url = reverse('tenant-create')
        self.client.force_login(self.admin_user)
        payload = {
            "name": "New Tenant",
            "number_of_employees": 100,
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_can_retrieve_tenant_by_invite_code_success(self):
        url = reverse('tenant-find-by-code')
        payload = {"tenant_code": self.invite_code}
        self.client.force_login(self.admin_user)
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_by_invite_code_not_found_failure(self):
        url = reverse('tenant-find-by-code')
        payload = {"tenant_code": "NONEXISTENT"}
        self.client.force_login(self.admin_user)
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
