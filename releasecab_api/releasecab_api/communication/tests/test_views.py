from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from releasecab_api.tenant.models import Tenant
from releasecab_api.user.models import User

from ..models import Communication


class CommunicationViewTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.admin_user = User.objects.create(
            email="admin@example.com",
            password="adminpassword",
            is_staff=True,
            is_superuser=True,
            tenant=self.tenant)
        self.normal_user = User.objects.create(
            email="test@example.com",
            password="password123",
            tenant=self.tenant)
        self.admin_client = APIClient()
        self.admin_client.force_authenticate(user=self.admin_user)
        self.normal_client = APIClient()
        self.normal_client.force_authenticate(user=self.normal_user)
        self.admin_communication = Communication.objects.create(
            to_user=self.admin_user,
            message_title='Admin Test Title',
            message_body='Admin Test Body',
            tenant=self.tenant
        )
        self.normal_communication = Communication.objects.create(
            to_user=self.normal_user,
            message_title='Normal Test Title',
            message_body='Normal Test Body',
            tenant=self.tenant
        )

    def test_admin_communication_list(self):
        url = reverse('admin-communication-list')
        response = self.admin_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(
            response.data['results'][0]['to_user'],
            self.admin_user.id)
        self.assertEqual(
            response.data['results'][0]['message_title'],
            'Admin Test Title')
        self.assertEqual(
            response.data['results'][0]['message_body'],
            'Admin Test Body')

    def test_admin_communication_detail(self):
        url = reverse('admin-communication-detail',
                      kwargs={'pk': self.admin_communication.pk})
        response = self.admin_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['to_user'], self.admin_user.id)
        self.assertEqual(response.data['message_title'], 'Admin Test Title')
        self.assertEqual(response.data['message_body'], 'Admin Test Body')

    def test_normal_communication_list(self):
        url = reverse('communication-user-list')
        response = self.normal_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(
            response.data['results'][0]['to_user'],
            self.normal_user.id)
        self.assertEqual(
            response.data['results'][0]['message_title'],
            'Normal Test Title')
        self.assertEqual(
            response.data['results'][0]['message_body'],
            'Normal Test Body')

    def test_communication_detail(self):
        url = reverse('communication-retrieve',
                      kwargs={'id': self.normal_communication.pk})
        response = self.normal_client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['to_user'], self.normal_user.id)
        self.assertEqual(response.data['message_title'], 'Normal Test Title')
        self.assertEqual(response.data['message_body'], 'Normal Test Body')
