from datetime import datetime, timedelta

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import AccessToken

from releasecab_api.blackout.models import Blackout
from releasecab_api.tenant.models import Tenant
from releasecab_api.user.models import Role, Team, User

from ..models import (Release, ReleaseComment, ReleaseConfig,
                      ReleaseEnvironment, ReleaseStage, ReleaseStageConnection,
                      ReleaseStageConnectionApprover, ReleaseType)


def create_access_token(user):
    token = AccessToken.for_user(user)
    return str(token)


class ReleaseViewsTest(TestCase):
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
        self.release = Release.objects.create(
            name="Test Release",
            identifier="TEST-123",
            tenant=self.tenant,
            release_type=ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant,
            ),
            created_at=datetime.now(),
            start_date=datetime.now(),
            end_date=datetime.now() +
            timedelta(
                hours=1),
            owner=self.admin_user,
            current_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant,
            ))
        self.comment = ReleaseComment.objects.create(
            comment_body="Test Comment",
            tenant=self.tenant,
            writer=self.admin_user,
            release=self.release
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
            {create_access_token(self.admin_user)}')

    def test_admin_can_retrieve_release_comments_success(self):
        url = reverse('admin-release-comment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_can_retrieve_release_comment_detail_success(self):
        url = reverse(
            'admin-release-comment-detail',
            kwargs={
                'pk': self.comment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['comment_body'],
            self.comment.comment_body)

    def test_user_can_create_release_comment_success(self):
        url = reverse('release-comment-create')
        payload = {
            "release": self.release.pk,
            "comment_body": "New Comment"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReleaseComment.objects.count(), 2)

    def test_only_admin_can_retrieve_release_comments_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('admin-release-comment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_non_existent_release_comment_failure(self):
        url = reverse('admin-release-comment-detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_cannot_create_release_comment_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION='')
        url = reverse('release-comment-create')
        payload = {
            "release": self.release.pk,
            "comment_body": "New Comment"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(ReleaseComment.objects.count(), 1)

    def test_admin_can_retrieve_release_comment_list_success(self):
        url = reverse('admin-release-comment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_can_delete_release_comment_success(self):
        url = reverse(
            'release-comments-delete',
            kwargs={
                'pk': self.comment.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ReleaseComment.objects.filter(
                pk=self.comment.pk).exists())


class ReleaseConfigViewsTest(TestCase):
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
        self.release_config = ReleaseConfig.objects.create(
            tenant=self.tenant,
            initial_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant,
            )
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
            {create_access_token(self.admin_user)}')

    def test_admin_can_retrieve_release_configs_success(self):
        url = reverse('admin-release-config-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_can_retrieve_release_config_detail_success(self):
        url = reverse(
            'admin-release-config-detail',
            kwargs={'pk': self.release_config.pk}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['initial_stage'],
            self.release_config.initial_stage.pk
        )

    def test_user_cannot_retrieve_release_configs_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('admin-release-config-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_non_existent_release_config_failure(self):
        url = reverse('admin-release-config-detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TestStageConnectionViews(TestCase):
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
        self.planning_stage = ReleaseStage.objects.create(
            name='Planning in Progress',
            description='Planning in Progress',
            allow_release_delete=True,
            allow_release_update=True,
            tenant=self.tenant
        )
        self.in_progress_stage = ReleaseStage.objects.create(
            name='In Progress',
            description='In Progress',
            allow_release_delete=False,
            allow_release_update=False,
            tenant=self.tenant
        )
        self.connection = ReleaseStageConnection.objects.create(
            from_stage=self.planning_stage,
            to_stage=self.in_progress_stage,
            tenant=self.tenant,
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')

    def test_admin_can_retrieve_stage_connections_list(self):
        url = reverse('admin-release-stage-connections-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_not_found_stage_connection_detail(self):
        url = reverse(
            'admin-release-stage-connections-detail',
            kwargs={
                'pk': '2'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_retrieve_stage_connections_by_tenant_id(self):
        url = reverse('release-stage-connection-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_retrieve_release_stage_connections(self):
        release_stage_id = self.in_progress_stage.pk
        url = reverse('release-stage-connection-get-to-stages',
                      kwargs={'release_stage_id': release_stage_id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_update_stage_connection(self):
        new_to_stage = ReleaseStage.objects.create(
            name='New Stage',
            description='New Stage',
            allow_release_delete=False,
            allow_release_update=False,
            tenant=self.tenant
        )
        payload = {
            'to_stage': new_to_stage.pk
        }
        url = reverse('release-stage-connection-update',
                      kwargs={'pk': self.connection.pk})
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['to_stage'], new_to_stage.pk)

    def test_admin_can_delete_stage_connection(self):
        url = reverse('release-stage-connection-delete',
                      kwargs={'pk': self.connection.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ReleaseStageConnection.objects.filter(
                pk=self.connection.pk).exists())

    def test_user_can_update_stage_connection(self):
        new_to_stage = ReleaseStage.objects.create(
            name='New Stage',
            description='New Stage',
            allow_release_delete=False,
            allow_release_update=False,
            tenant=self.tenant
        )
        payload = {
            'to_stage': new_to_stage.pk
        }
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('release-stage-connection-update',
                      kwargs={'pk': self.connection.pk})
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_delete_stage_connection(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('release-stage-connection-delete',
                      kwargs={'pk': self.connection.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_admin_can_create_stage_connection(self):
        new_to_stage = ReleaseStage.objects.create(
            name='New Stage',
            description='New Stage',
            allow_release_delete=False,
            allow_release_update=False,
            tenant=self.tenant
        )
        payload = {
            'from_stage': self.planning_stage.pk,
            'to_stage': new_to_stage.pk,
            'tenant': self.tenant.pk,
            'owner_only': False
        }
        url = reverse('release-stage-connection-create')
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(ReleaseStageConnection.objects.filter(
            from_stage=self.planning_stage,
            to_stage=new_to_stage
        ).exists())

    def test_admin_can_update_approvers(self):
        approver_role = Role.objects.create(
            name='Approver', tenant=self.tenant)
        approver_team = Team.objects.create(
            name='Approver Team', tenant=self.tenant)
        connection = ReleaseStageConnection.objects.create(
            from_stage=self.planning_stage,
            to_stage=self.in_progress_stage,
            tenant=self.tenant,
            owner_only=False
        )
        payload = {
            'approvers_list': [
                {
                    'roles': [approver_role.pk],
                    'teams': [approver_team.pk]
                }
            ]
        }
        url = reverse(
            'release-stage-connection-update',
            kwargs={
                'pk': connection.pk})
        response = self.client.patch(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(ReleaseStageConnectionApprover.objects.filter(
            approver_role=approver_role,
            approver_team=approver_team
        ).exists())


class ReleaseEnvironmentViewsTest(TestCase):
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
        self.release_environment = ReleaseEnvironment.objects.create(
            name="Test Environment",
            tenant=self.tenant
        )
        self.release_stage = ReleaseStage.objects.create(
            name="Test Stage",
            tenant=self.tenant)
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')

    def test_admin_can_retrieve_release_environment_list(self):
        url = reverse('admin-release-environment-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_can_retrieve_release_environment_detail(self):
        url = reverse(
            'admin-release-environment-detail',
            kwargs={
                'pk': self.release_environment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.release_environment.name)

    def test_tenant_owner_can_retrieve_release_environment_by_id(self):
        url = reverse('release-environment-detail',
                      kwargs={'pk': self.release_environment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.release_environment.name)

    def test_admin_can_update_release_environment(self):
        url = reverse('release-environment-update',
                      kwargs={'pk': self.release_environment.pk})
        payload = {'name': 'Updated Environment Name'}
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Environment Name')

    def test_tenant_owner_can_update_release_environment(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('release-environment-update',
                      kwargs={'pk': self.release_environment.pk})
        payload = {'name': 'Updated Environment Name'}
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Environment Name')

    def test_admin_can_create_release_environment(self):
        url = reverse('release-environment-create')
        payload = {'name': 'New Environment'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Environment')

    def test_tenant_owner_cannot_create_duplicate_release_environment(self):
        url = reverse('release-environment-create')
        payload = {'name': self.release_environment.name}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_can_delete_release_environment(self):
        url = reverse('release-environments-delete',
                      kwargs={'pk': self.release_environment.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ReleaseEnvironment.objects.filter(
                pk=self.release_environment.pk).exists())

    def test_tenant_owner_can_delete_release_environment(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('release-environments-delete',
                      kwargs={'pk': self.release_environment.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ReleaseEnvironment.objects.filter(
                pk=self.release_environment.pk).exists())

    def test_admin_can_retrieve_stage_list(self):
        url = reverse('admin-release-stage-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_can_retrieve_stage_detail(self):
        url = reverse(
            'admin-release-stage-detail',
            kwargs={
                'pk': self.release_stage.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.release_stage.name)

    def test_tenant_owner_can_retrieve_release_stage_by_id(self):
        url = reverse(
            'release-stage-detail',
            kwargs={
                'pk': self.release_stage.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], self.release_stage.name)

    def test_admin_can_update_release_stage(self):
        url = reverse(
            'release-stage-update',
            kwargs={
                'pk': self.release_stage.pk})
        payload = {'name': 'Updated Stage Name'}
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Stage Name')

    def test_tenant_owner_can_update_release_stage(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse(
            'release-stage-update',
            kwargs={
                'pk': self.release_stage.pk})
        payload = {'name': 'Updated Stage Name'}
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Stage Name')

    def test_admin_can_create_release_stage(self):
        url = reverse('release-stage-create')
        payload = {'name': 'New Stage'}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Stage')

    def test_tenant_owner_cannot_create_duplicate_release_stage(self):
        url = reverse('release-stage-create')
        payload = {'name': self.release_stage.name}
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_can_delete_release_stage(self):
        url = reverse(
            'release-stage-delete',
            kwargs={
                'pk': self.release_stage.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ReleaseStage.objects.filter(
                pk=self.release_stage.pk).exists())

    def test_tenant_owner_can_delete_release_stage(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse(
            'release-stage-delete',
            kwargs={
                'pk': self.release_stage.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ReleaseStage.objects.filter(
                pk=self.release_stage.pk).exists())


class ReleaseTypeViewsTest(TestCase):
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
        self.release_type = ReleaseType.objects.create(
            name="Test Release Type",
            tenant=self.tenant
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
            {create_access_token(self.admin_user)}')

    def test_admin_can_retrieve_release_types_list_success(self):
        url = reverse('admin-release-type-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreaterEqual(len(response.data), 1)

    def test_admin_can_retrieve_release_type_detail_success(self):
        url = reverse(
            'admin-release-type-detail',
            kwargs={'pk': self.release_type.pk}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['name'],
            self.release_type.name
        )

    def test_user_cannot_retrieve_release_types_list_failure(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('admin-release-type-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_retrieve_non_existent_release_type_failure(self):
        url = reverse('admin-release-type-detail', kwargs={'pk': 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tenant_owner_can_create_release_type_success(self):
        url = reverse('release-type-create')
        payload = {
            "name": "New Release Type"
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ReleaseType.objects.count(), 2)

    def test_user_cannot_create_duplicate_release_type_failure(self):
        url = reverse('release-type-create')
        payload = {
            "name": self.release_type.name
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data['detail'],
            "Name already exists"
        )

    def test_tenant_owner_can_retrieve_release_type_success(self):
        url = reverse(
            'release-type-detail',
            kwargs={'pk': self.release_type.pk}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['name'],
            self.release_type.name
        )

    def test_tenant_owner_can_update_release_type_success(self):
        url = reverse(
            'release-type-update',
            kwargs={'pk': self.release_type.pk}
        )
        payload = {
            "name": "Updated Release Type"
        }
        response = self.client.put(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            response.data['name'],
            "Updated Release Type"
        )

    def test_tenant_owner_can_delete_release_type_success(self):
        url = reverse(
            'release-types-delete',
            kwargs={'pk': self.release_type.pk}
        )
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            ReleaseType.objects.filter(
                pk=self.release_type.pk
            ).exists()
        )

    def test_user_can_retrieve_release_types_by_tenant_id_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.normal_user)}')
        url = reverse('release-type-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ReleaseTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123"
        )
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
        self.release = Release.objects.create(
            name="Test Release",
            tenant=self.tenant,
            identifier="TEST-123",
            release_type=ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant
            ),
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(hours=1),
            owner=self.admin_user,
            current_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant
            )
        )
        self.release_config = ReleaseConfig.objects.create(
            tenant=self.tenant,
            initial_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant,
            )
        )

    def test_admin_can_retrieve_release_list_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('admin-release-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_can_retrieve_invalid_release_detail_success(self):
        url = reverse('admin-release-detail', kwargs={'pk': 99})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_tenant_owner_can_create_release_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-create')
        payload = {
            "name": "Test Release",
            "description": "Test Description",
            "release_type": ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant,
            ).id,
            "release_environment": [],
            "affected_teams": [],
            "ticket_link": "ticketLink",
            "start_date": timezone.now(),
            "end_date": timezone.now() + timedelta(hours=1),
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_can_retrieve_release_by_identifier_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-detail', kwargs={'identifier': 'TEST-123'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_cannot_retrieve_invalid_release_by_identifier_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-detail', kwargs={'identifier': 'None'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_can_retrieve_releases_for_tenant_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_retrieve_releases_for_tenant_calendar_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-calendar')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_can_update_release_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-update', kwargs={'id': self.release.id})
        payload = {
            "name": "Updated Name"
        }
        response = self.client.patch(url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_tenant_owner_can_delete_release_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-delete', kwargs={'pk': self.release.id})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_user_can_search_releases_success(self):
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer \
                {create_access_token(self.admin_user)}')
        url = reverse('release-search')
        response = self.client.get(url, {'search': 'example_query'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class ReleaseStatViewForUserTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tenant = Tenant.objects.create(
            name="Test Tenant",
            number_of_employees=50,
            invite_code="TEST123")
        self.user = User.objects.create(
            email="user@example.com",
            password="password123",
            tenant=self.tenant,
            is_staff=False,
            is_superuser=False,
            is_tenant_owner=False
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f'Bearer {create_access_token(self.user)}'
        )

    def test_get_dashboard_stats(self):
        Release.objects.create(
            name="Test Release",
            tenant=self.tenant,
            identifier="TEST-12",
            release_type=ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant
            ),
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(hours=1),
            owner=self.user,
            current_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant
            )
        )
        Release.objects.create(
            name="Test Release",
            tenant=self.tenant,
            identifier="TEST-123",
            release_type=ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant
            ),
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(hours=1),
            owner=self.user,
            current_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant
            )
        )
        url = reverse('release-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['my_open_releases'], 2)
        self.assertEqual(response.data['all_open_releases'], 2)
        self.assertFalse(response.data['current_blackout'])

    def test_get_dashboard_stats_with_blackout(self):
        Release.objects.create(
            name="Test Release",
            tenant=self.tenant,
            identifier="TEST-123",
            release_type=ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant
            ),
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(hours=1),
            owner=self.user,
            current_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant
            )
        )
        Release.objects.create(
            name="Test Release",
            tenant=self.tenant,
            identifier="TEST-1234",
            release_type=ReleaseType.objects.create(
                name="Test Type",
                tenant=self.tenant
            ),
            start_date=timezone.now(),
            end_date=timezone.now() + timedelta(hours=1),
            owner=self.user,
            current_stage=ReleaseStage.objects.create(
                name="Test Stage",
                tenant=self.tenant
            )
        )
        Blackout.objects.create(
            start_date="2024-03-22 00:00:00",
            end_date="2024-03-23 00:00:00",
            tenant=self.tenant,
            owner=self.user
        )
        url = reverse('release-stats')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['my_open_releases'], 2)
        self.assertEqual(response.data['all_open_releases'], 2)
        self.assertFalse(response.data['current_blackout'])
