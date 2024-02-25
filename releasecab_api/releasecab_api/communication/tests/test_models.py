from django.db.utils import IntegrityError
from django.test import TestCase

from releasecab_api.tenant.models import Tenant
from releasecab_api.user.models import User

from ..models import Communication


class CommunicationModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.user = User.objects.create(
            email="test@example.com",
            password="password123",
            tenant=self.tenant)

    def test_valid_communication_creation(self):
        communication = Communication.objects.create(
            to_user=self.user,
            message_title="Test Title",
            message_body="Test Body",
            tenant=self.tenant
        )
        self.assertEqual(Communication.objects.count(), 1)
        self.assertEqual(communication.to_user, self.user)
        self.assertEqual(communication.message_title, "Test Title")
        self.assertEqual(communication.message_body, "Test Body")

    def test_message_title_and_body_required(self):
        with self.assertRaises(IntegrityError):
            Communication.objects.create(
                to_user=self.user,
                message_title=None,
                message_body=None,
                tenant=self.tenant
            )

    def test_string_representation(self):
        communication = Communication.objects.create(
            to_user=self.user,
            message_title="Test Title",
            message_body="Test Body",
            tenant=self.tenant
        )
        self.assertEqual(
            str(communication),
            f"{self.user} Test Title"
        )
