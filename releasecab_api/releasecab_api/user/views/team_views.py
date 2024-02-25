from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (CreateAPIView, DestroyAPIView,
                                     ListAPIView, RetrieveAPIView,
                                     UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (IsAdminPermission,
                                            IsTenantOwnerOrTeamManager,
                                            IsTenantOwnerPermission)
from releasecab_api.communication.helpers import CommunicationHelpers

from ..models import Team, User
from ..serializers.team_serializers import (AddUserToTeamsSerializer,
                                            TeamSerializer)


class AdminTeamList(ListAPIView):
    """
    GET View to retrieve a list of Teams. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class AdminTeamDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific Team
    Takes in the primary key of the User to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class TeamListByTenant(ListAPIView):
    """
    GET View to retrieve a list of teams for a specific user's tenant
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = TeamSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        teams = Team.objects.filter(tenant=tenant)
        disable_pagination = self.request.query_params.get(
            'disable_pagination', False)
        if disable_pagination and disable_pagination.lower() == 'true':
            self.pagination_class = None
        sort_by = self.request.query_params.get('sort_by', 'name')
        order = self.request.query_params.get('order_by', 'asc')

        if order not in ['asc', 'desc']:
            order = 'asc'

        if order == 'asc':
            teams = teams.order_by(sort_by)
        else:
            teams = teams.order_by(f'-{sort_by}')

        return teams


class TeamCreateView(APIView):
    """
    POST an team and add it to the table. Returns an error if the team
    already exists
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = TeamSerializer

    def post(self, request):
        serializer = TeamSerializer(data=request.data)
        tenant = request.user.tenant

        if serializer.is_valid():
            name = serializer.validated_data['name']
            existing_user = Team.objects.filter(
                name=name, tenant=tenant).first()

            if existing_user:
                return Response({"detail": "Name already exists"},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                team = serializer.save(tenant=tenant)
                message_title = f"Team '{team.name}' Was Created"
                message_body = f"Team '{team.name}' was created"
                CommunicationHelpers.create_new_message(
                    self.request.user,
                    message_title,
                    message_body,
                    False)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TeamDeleteAPIView(DestroyAPIView):
    '''
    DELETE a team
    '''
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    queryset = Team.objects.all()
    serializer_class = TeamSerializer

    def perform_destroy(self, instance):
        message_title = f"Team '{instance.name}' Was Deleted"
        message_body = f"Team '{instance.name}' was deleted"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)
        super(TeamDeleteAPIView, self).perform_destroy(instance)


class TeamRetrieve(RetrieveAPIView):
    """
    GET a team by identifier.
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerOrTeamManager]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = TeamSerializer

    def get_object(self):
        id = self.kwargs.get('pk')
        tenant = self.request.user.tenant

        try:
            releases = Team.objects.get(
                id=id, tenant=tenant)
            self.check_object_permissions(self.request, releases)
            return releases
        except Team.DoesNotExist:
            return Response(
                {"error": "Team not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class TeamUpdateView(UpdateAPIView):
    """
    POST an updated team
    """
    serializer_class = TeamSerializer
    permission_classes = [IsAuthenticated, IsTenantOwnerOrTeamManager]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Team.objects.all()

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

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        team = serializer.save()
        message_title = f"Team '{team.name}' Was Updated"
        message_body = f"Team '{team.name}' was updated"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)
        return Response(serializer.data)


class AddUserToTeamsView(CreateAPIView):
    """
    POST a user to a list of teams
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = AddUserToTeamsSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        team_ids = serializer.validated_data.get('team_ids', [])
        user_id = serializer.validated_data.get('user_id')

        try:
            user = User.objects.get(id=user_id)
            current_teams = user.teams_as_member.filter(
                tenant=request.user.tenant)
            teams_to_remove_from = current_teams.exclude(id__in=team_ids)
            for team in teams_to_remove_from:
                team.members.remove(user)
            teams_to_add_to = Team.objects.filter(
                id__in=team_ids,
                tenant=request.user.tenant).exclude(
                members=user)
            for team in teams_to_add_to:
                team.members.add(user)

            return Response(
                {'message': 'Users added to teams successfully.'},
                status=status.HTTP_200_OK)

        except Team.DoesNotExist:
            return Response(
                {'message': 'One or more teams do not exist.'},
                status=status.HTTP_404_NOT_FOUND)


class UserManagedTeamsListView(ListAPIView):
    """
    GET View to retrieve a list of teams the user manages
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = TeamSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        user = self.request.user
        teams = Team.objects.filter(managers=user, tenant=tenant)
        disable_pagination = self.request.query_params.get(
            'disable_pagination', False)
        if disable_pagination and disable_pagination.lower() == 'true':
            self.pagination_class = None
        sort_by = self.request.query_params.get('sort_by', 'name')
        order = self.request.query_params.get('order_by', 'asc')

        if order not in ['asc', 'desc']:
            order = 'asc'

        if order == 'asc':
            teams = teams.order_by(sort_by)
        else:
            teams = teams.order_by(f'-{sort_by}')

        return teams
