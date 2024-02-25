from django.db import IntegrityError
from django.test import TestCase

from ..models import InvitedUser, Tenant


class TenantModelTest(TestCase):
    def test_tenant_creation(self):
        tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123"
        )
        self.assertEqual(Tenant.objects.count(), 1)
        self.assertEqual(tenant.name, "Test Tenant")
        self.assertEqual(tenant.number_of_employees, 50)
        self.assertEqual(tenant.invite_code, "TEST123")

    def test_duplicate_invite_code(self):
        Tenant.objects.create(
            name="Test Tenant 1",
            number_of_employees=50,
            invite_code="TEST123"
        )
        with self.assertRaises(IntegrityError):
            Tenant.objects.create(
                name="Test Tenant 2",
                number_of_employees=100,
                invite_code="TEST123"
            )

    def test_string_representation(self):
        tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123"
        )
        self.assertEqual(str(tenant), "Test Tenant")


class InvitedUserModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123"
        )

    def test_invited_user_creation(self):
        invited_user = InvitedUser.objects.create(
            email="test@example.com",
            tenant=self.tenant
        )
        self.assertEqual(InvitedUser.objects.count(), 1)
        self.assertEqual(invited_user.email, "test@example.com")
        self.assertEqual(invited_user.tenant, self.tenant)

    def test_invalid_tenant_association(self):
        with self.assertRaises(IntegrityError):
            InvitedUser.objects.create(email="test@example.com")

    def test_string_representation(self):
        invited_user = InvitedUser.objects.create(
            email="test@example.com",
            tenant=self.tenant
        )
        self.assertEqual(str(invited_user), "test@example.com")
