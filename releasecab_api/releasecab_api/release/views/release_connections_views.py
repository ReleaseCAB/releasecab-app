from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (DestroyAPIView, ListAPIView,
                                     RetrieveAPIView, UpdateAPIView,
                                     get_object_or_404)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (IsAdminPermission,
                                            IsTenantOwnerPermission)
from releasecab_api.communication.helpers import CommunicationHelpers
from releasecab_api.user.models import Role, Team

from ..helpers import ReleaseHelpers
from ..models import (Release, ReleaseStage, ReleaseStageConnection,
                      ReleaseStageConnectionApprover)
from ..serializers.release_connections_serializers import \
    ReleaseStageConnectionSerializer
from ..serializers.release_stage_serializers import ReleaseStageSerializer


class AdminStageConnectionList(ListAPIView):
    """
    GET View to retrieve a list of StageConnections. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseStageConnection.objects.all()
    serializer_class = ReleaseStageConnectionSerializer


class AdminStageConnectionDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific StageConnection
    Takes in the primary key of the StageConnection to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseStageConnection.objects.all()
    serializer_class = ReleaseStageConnectionSerializer


class ReleaseStageConnectionsByTenantId(ListAPIView):
    """
    GET View to retrieve a list of stage connections by Tenant ID.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseStageConnectionSerializer
    pagination_class = None

    def get_queryset(self):
        tenant = self.request.user.tenant
        stage_connections = ReleaseStageConnection.objects.filter(
            tenant=tenant)

        return stage_connections


class ReleaseStageConnectionUpdateView(UpdateAPIView):
    """
    POST an updated release connection. Only tenant owners can update
    """
    serializer_class = ReleaseStageConnectionSerializer
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return ReleaseStageConnection.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        lookup_field = self.kwargs.get('pk')
        obj = get_object_or_404(
            queryset,
            id=lookup_field,
            tenant=self.request.user.tenant)
        self.check_object_permissions(self.request, obj)
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        data = request.data.get("approvers_list", [])

        if request.user.is_tenant_owner:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            release_connection = serializer.save()
            self.update_approvers(instance, data)
            message_title = f"Release Connection from '{release_connection.from_stage}'\
            to '{release_connection.to_stage}' Was Updated"
            message_body = f"Release connection from '{release_connection.from_stage}'\
            to '{release_connection.to_stage}' was updated"
            CommunicationHelpers.create_new_message(
                self.request.user,
                message_title,
                message_body,
                False)
            return Response(serializer.data)
        else:
            return Response(
                {
                    "detail": "You do not have permission to perform \
                        this action."},
                status=status.HTTP_403_FORBIDDEN)

    def update_approvers(self, instance, data):
        existing_approvers = instance.approvers.all()
        existing_approvers.delete()
        unique_approver_set = set()
        for item in data:
            roles = item.get('roles', [])
            teams = item.get('teams', [])
            if not roles and not teams:
                continue
            approver_identifier = tuple(sorted(set(roles + teams)))
            if approver_identifier in unique_approver_set:
                continue
            unique_approver_set.add(approver_identifier)
            approver = ReleaseStageConnectionApprover.objects.create(
                tenant=instance.tenant,
            )
            for role_id in roles:
                role = Role.objects.get(id=role_id)
                approver.approver_role.add(role)
            for team_id in teams:
                team = Team.objects.get(id=team_id)
                approver.approver_team.add(team)
            instance.approvers.add(approver)
        instance.save()


class ReleaseStageConnectionsView(APIView):
    """
    GET Given a release_stage_id, get all valid next
    stages for that user
    """
    serializer_class = ReleaseStageConnectionSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get(self, request, release_stage_id, format=None):
        release_id = self.request.query_params.get('release')
        try:
            from_stage = ReleaseStage.objects.get(pk=release_stage_id)
            connections = ReleaseStageConnection.objects.filter(
                from_stage=from_stage, tenant=request.user.tenant)
            approver_connections = set()
            non_approver_connections = set()
            for connection in connections:
                if connection.owner_only:
                    # Check if the user is the owner of the release
                    if Release.objects.filter(
                            id=release_id,
                            owner=request.user,
                            tenant=request.user.tenant).exists():
                        non_approver_connections.add(connection)
                else:
                    if not connection.approvers.values():
                        # No approvers for that connection
                        non_approver_connections.add(connection)
                    else:
                        for approver in connection.approvers.values():
                            connection_approver = \
                                ReleaseStageConnectionApprover.objects.get(
                                    pk=approver['id'])
                            approver_roles = \
                                connection_approver.approver_role.values()
                            approver_teams = \
                                connection_approver.approver_team.values()

                            if connection.owner_included and \
                                Release.objects.filter(
                                    id=release_id,
                                    owner=request.user,
                                    tenant=request.user.tenant).exists():
                                non_approver_connections.add(connection)
                            else:
                                role_approver_found = \
                                    ReleaseHelpers.is_user_in_role_connection(
                                        request.user, approver_roles)
                                team_approver_found = \
                                    ReleaseHelpers.is_user_in_team_connection(
                                        request.user, approver_teams)
                                if team_approver_found and role_approver_found:
                                    non_approver_connections.add(connection)
                                else:
                                    approver_connections.add(connection)
            to_stages_no_approver = [
                connection.to_stage for connection in non_approver_connections]
            serialized_to_stages_no_approver = ReleaseStageSerializer(
                to_stages_no_approver, many=True)
            to_stages_with_approver = [
                connection.to_stage for connection in approver_connections]
            serialized_to_stages_with_approver = ReleaseStageSerializer(
                to_stages_with_approver, many=True)
            to_stages = {
                'to_stages_with_approver':
                serialized_to_stages_with_approver.data,
                'to_stages_without_approver':
                serialized_to_stages_no_approver.data}
            return Response(to_stages)

        except ReleaseStage.DoesNotExist:
            return Response(
                {
                    "error": f"ReleaseStage with id \
                        {release_stage_id} does not exist"},
                status=status.HTTP_404_NOT_FOUND)


class ReleaseConnectionDeleteAPIView(DestroyAPIView):
    '''
    DELETE a release connection, requires tenant owner permissions
    '''
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return ReleaseStageConnection.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        lookup_field = self.kwargs.get('pk')
        obj = get_object_or_404(
            queryset,
            id=lookup_field,
            tenant=self.request.user.tenant)
        self.check_object_permissions(self.request, obj)
        return obj

    def perform_destroy(self, instance):
        message_title = f"Release Connection from '{instance.from_stage}'\
            to '{instance.to_stage}' Was Deleted"
        message_body = f"Release connection from '{instance.from_stage}'\
            to '{instance.to_stage}' was deleted"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)
        super(ReleaseConnectionDeleteAPIView, self).perform_destroy(instance)
