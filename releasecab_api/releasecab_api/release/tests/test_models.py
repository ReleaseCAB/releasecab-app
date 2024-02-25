from django.db.utils import IntegrityError
from django.test import TestCase
from django.utils import timezone

from releasecab_api.tenant.models import Tenant
from releasecab_api.user.models import Team, User

from ..models import (Release, ReleaseComment, ReleaseEnvironment,
                      ReleaseStage, ReleaseType)


class ReleaseModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.release_type = ReleaseType.objects.create(
            name="Test Release Type",
            description="Test Description",
            tenant=self.tenant)
        self.environment = ReleaseEnvironment.objects.create(
            name="Test Environment",
            description="Test Description",
            tenant=self.tenant)
        self.stage = ReleaseStage.objects.create(
            name="Test Stage",
            description="Test Description",
            tenant=self.tenant)
        self.user = User.objects.create(
            email="test@example.com",
            password="password123",
            tenant=self.tenant)
        self.team = Team.objects.create(
            name="Test Team",
            tenant=self.tenant)

    def test_valid_release_creation(self):
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(hours=1)
        release = Release.objects.create(
            name="Test Release",
            identifier="TEST001",
            release_type=self.release_type,
            start_date=start_date,
            end_date=end_date,
            owner=self.user,
            current_stage=self.stage,
            tenant=self.tenant,
        )
        release.affected_teams.add(self.team)
        release.release_environment.add(self.environment)
        self.assertEqual(Release.objects.count(), 1)
        self.assertEqual(release.name, "Test Release")
        self.assertEqual(release.identifier, "TEST001")
        self.assertEqual(release.release_type, self.release_type)
        self.assertEqual(release.start_date, start_date)
        self.assertEqual(release.end_date, end_date)
        self.assertEqual(release.owner, self.user)
        self.assertEqual(release.current_stage, self.stage)
        self.assertIn(self.team, release.affected_teams.all())
        self.assertIn(self.environment, release.release_environment.all())

    def test_invalid_release_creation(self):
        start_date = timezone.now()
        with self.assertRaises(IntegrityError):
            Release.objects.create(
                name="Test Release",
                identifier="TEST001",
                release_type=self.release_type,
                start_date=start_date,
                end_date=None,
                owner=self.user,
                current_stage=self.stage,
                tenant=self.tenant,
            )

    def test_string_representation(self):
        start_date = timezone.now()
        end_date = start_date + timezone.timedelta(hours=1)
        release = Release(
            name="Test Release",
            identifier="TEST001",
            release_type=self.release_type,
            start_date=start_date,
            end_date=end_date,
            owner=self.user,
            current_stage=self.stage,
            tenant=self.tenant,
        )
        self.assertEqual(str(release), "Test Release")


class ReleaseCommentModelTest(TestCase):
    def setUp(self):
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.release = Release.objects.create(
            name="Test Release",
            identifier="TEST001",
            release_type=ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant),
            start_date=timezone.now(),
            end_date=timezone.now() +
            timezone.timedelta(
                hours=1),
            owner=User.objects.create(
                email="test2@example.com",
                password="password123",
                tenant=self.tenant),
            current_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant),
            tenant=self.tenant)
        self.user = User.objects.create(
            email="test@example.com",
            password="password123",
            tenant=self.tenant
        )

    def test_valid_comment_creation(self):
        comment = ReleaseComment.objects.create(
            comment_body="Test Comment",
            writer=self.user,
            release=self.release,
            tenant=self.tenant
        )
        self.assertEqual(ReleaseComment.objects.count(), 1)
        self.assertEqual(comment.comment_body, "Test Comment")
        self.assertEqual(comment.writer, self.user)
        self.assertEqual(comment.release, self.release)

    def test_string_representation(self):
        comment = ReleaseComment(
            comment_body="Test Comment",
            writer=self.user,
            release=self.release,
            tenant=self.tenant
        )
        self.assertEqual(
            str(comment),
            "Comment by test@example.com on Test Release")
