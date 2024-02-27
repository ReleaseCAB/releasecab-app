from datetime import datetime, timedelta

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from releasecab_api.release.models import ReleaseEnvironment
from releasecab_api.tenant.models import Tenant
from releasecab_api.user.models import User

from ..models import Blackout


def create_access_token(user):
    token = AccessToken.for_user(user)
    return str(token)


class BlackoutViewsTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.admin_user = User.objects.create(
            email="admin@example.com",
            password="password123",
            tenant=self.tenant,
            is_staff=True,
            is_superuser=True,
            is_tenant_owner=True
        )
        self.normal_user = User.objects.create(
            email="user@example.com",
            password="password456",
            tenant=self.tenant,
            is_tenant_owner=True
        )
        self.lower_normal_user = User.objects.create(
            email="user2@example.com",
            password="password456",
            tenant=self.tenant,
        )
        self.environment = ReleaseEnvironment.objects.create(
            name="Test Environment",
            description="Test Description",
            tenant=self.tenant
        )
        self.blackout = Blackout.objects.create(
            name="Test Blackout",
            description="Test Description",
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(hours=1),
            tenant=self.tenant,
            owner=self.admin_user
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
            {create_access_token(self.admin_user)}')

    def test_admin_can_retrieve_blackouts_success(self):
        url = reverse('admin-blackout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_can_retrieve_blackout_detail_success(self):
        url = reverse('admin-blackout-detail', kwargs={'pk': self.blackout.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.blackout.name)

    def test_user_can_create_blackout_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
            {create_access_token(self.normal_user)}')
        url = reverse('blackout-create')
        payload = {
            "name": "Test Blackout 2",
            "description": "Test Description 2",
            "start_date": datetime.now() + timedelta(hours=1),
            "end_date": datetime.now() + timedelta(hours=2),
            "release_environment": [self.environment.pk]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Blackout.objects.count(), 2)

    def test_only_admin_can_retrieve_blackouts_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('admin-blackout-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_non_existent_blackout_failure(self):
        url = reverse('admin-blackout-detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_create_blackout_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('blackout-create')
        payload = {
            "name": "Test Blackout 2",
            "description": "Test Description 2",
            "start_date": datetime.now(),
            "end_date": datetime.now() - timedelta(hours=1),
            "release_environments": [self.environment.pk]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Blackout.objects.count(), 1)

    def test_user_cannot_retrieve_blackout_detail_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('admin-blackout-detail', kwargs={'pk': self.blackout.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_cannot_create_blackout_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.lower_normal_user)}')
        url = reverse('blackout-create')
        payload = {
            "name": "Test Blackout 2",
            "description": "Test Description 2",
            "start_date": datetime.now(),
            "end_date": datetime.now() + timedelta(hours=1),
            "release_environments": [self.environment.pk]
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Blackout.objects.count(), 1)

    def test_admin_can_update_blackout_success(self):
        url = reverse('blackout-update', kwargs={'id': self.blackout.pk})
        payload = {
            "name": "Updated Blackout Name",
            "description": "Updated Description",
            "start_date": datetime.now() + timedelta(hours=1),
            "end_date": datetime.now() + timedelta(hours=2),
            "release_environments": [self.environment.pk]
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            Blackout.objects.get(
                pk=self.blackout.pk).name,
            "Updated Blackout Name")

    def test_user_cannot_update_blackout_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.lower_normal_user)}')
        url = reverse('blackout-update', kwargs={'id': self.blackout.pk})
        payload = {
            "name": "Updated Blackout Name",
            "description": "Updated Description",
            "start_date": datetime.now(),
            "end_date": datetime.now() + timedelta(hours=2),
            "release_environments": [self.environment.pk]
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertNotEqual(
            Blackout.objects.get(
                pk=self.blackout.pk).name,
            "Updated Blackout Name")

    def test_admin_can_delete_blackout_success(self):
        url = reverse('blackout-delete', kwargs={'pk': self.blackout.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Blackout.objects.count(), 0)

    def test_user_cannot_delete_blackout_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.lower_normal_user)}')
        url = reverse('blackout-delete', kwargs={'pk': self.blackout.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Blackout.objects.count(), 1)
