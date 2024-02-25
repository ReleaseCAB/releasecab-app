from django.core.exceptions import ValidationError
from django.test import TestCase
from django.utils import timezone

from releasecab_api.release.models import ReleaseEnvironment
from releasecab_api.tenant.models import Tenant
from releasecab_api.user.models import User

from ..models import Blackout


class BlackoutModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.environment = ReleaseEnvironment.objects.create(
            name="Test Environment",
            description="Test Description",
            tenant=self.tenant)
        self.user = User.objects.create(
            email="test@example.com",
            password="password123",
            tenant=self.tenant)

    def test_valid_blackout_creation(self):
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(hours=1)
        blackout = Blackout.objects.create(
            name="Test Blackout",
            description="Test Description",
            start_date=start_date,
            end_date=end_date,
            tenant=self.tenant,
            owner=self.user,
        )
        blackout.release_environment.add(self.environment)
        self.assertEqual(Blackout.objects.count(), 1)
        self.assertEqual(blackout.name, "Test Blackout")
        self.assertEqual(blackout.description, "Test Description")
        self.assertEqual(blackout.start_date, start_date)
        self.assertEqual(blackout.end_date, end_date)
        self.assertEqual(blackout.owner, self.user)
        self.assertIn(self.environment, blackout.release_environment.all())

    def test_clean_method(self):
        start_date = timezone.now()
        end_date = start_date - timezone.timedelta(hours=1)
        blackout = Blackout(
            name="Test Blackout",
            description="Test Description",
            start_date=start_date,
            end_date=end_date,
            tenant=self.tenant,
            owner=self.user)
        with self.assertRaises(ValidationError):
            blackout.clean()

    def test_string_representation(self):
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(hours=1)
        blackout = Blackout(
            name="Test Blackout",
            description="Test Description",
            start_date=start_date,
            end_date=end_date,
            tenant=self.tenant,
            owner=self.user)
        self.assertEqual(
            str(blackout),
            "Test Blackout ({} - {})".format(start_date, end_date))
