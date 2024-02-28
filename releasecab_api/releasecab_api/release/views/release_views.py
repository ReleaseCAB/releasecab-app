from rest_framework import filters, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (CreateAPIView, DestroyAPIView,
                                     ListAPIView, RetrieveAPIView,
                                     UpdateAPIView, get_object_or_404)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (CanCreateReleasesPermission,
                                            IsAdminPermission)
from releasecab_api.communication.helpers import CommunicationHelpers

from ..models import Release
from ..serializers.release_serializers import ReleaseSerializer


class AdminReleaseList(ListAPIView):
    """
    GET View to retrieve a list of Releases. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Release.objects.all()
    serializer_class = ReleaseSerializer


class AdminReleaseDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific Release
    Takes in the primary key of the Release to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Release.objects.all()
    serializer_class = ReleaseSerializer


class ReleaseCreate(CreateAPIView):
    """
    POST a new release. Authentication is required.
    """
    permission_classes = [IsAuthenticated, CanCreateReleasesPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseSerializer

    def perform_create(self, serializer):
        release = serializer.save()
        message_title = f"Release '{release.name}' Was Created"
        message_body = f"Release '{release.name}' was created"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)


class ReleaseRetrieve(RetrieveAPIView):
    """
    GET a release by identifier. Automatically checks the release
    exists just for that tenant.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseSerializer

    def get_object(self):
        identifier = self.kwargs.get('identifier')
        tenant = self.request.user.tenant

        try:
            releases = Release.objects.get(
                identifier=identifier, tenant=tenant)
            self.check_object_permissions(self.request, releases)
            return releases
        except Release.DoesNotExist:
            return Response(
                {"error": "Release not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class ReleaseTenantList(ListAPIView):
    """
    GET a list of all releases for that tenant
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        releases = Release.objects.filter(tenant=tenant)
        sort_by = self.request.query_params.get('sort_by', 'name')
        order = self.request.query_params.get('order_by', 'asc')
        filter_by_me = self.request.query_params.get('filter_by_me', "false")
        filter_by_type = self.request.query_params.get('filter_by_type', "")
        filter_by_env = self.request.query_params.get('filter_by_env', "")
        if filter_by_me == "true":
            releases = releases.filter(
                owner=self.request.user)
        if filter_by_type:
            releases = releases.filter(release_type=filter_by_type)

        if filter_by_env:
            releases = releases.filter(
                release_environment=filter_by_env)

        if order not in ['asc', 'desc']:
            order = 'asc'

        if order == 'asc':
            releases = releases.order_by(sort_by)
        else:
            releases = releases.order_by(f'-{sort_by}')

        return releases


class ReleaseTenantCalendarList(ListAPIView):
    """
    GET a list of all releases for that tenant
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseSerializer
    pagination_class = None

    def get_queryset(self):
        tenant = self.request.user.tenant
        releases = Release.objects.filter(tenant=tenant).order_by('name')
        return releases


class ReleaseUpdateView(UpdateAPIView):
    '''
    PATCH a release with updated information
    '''
    serializer_class = ReleaseSerializer
    permission_classes = [IsAuthenticated, CanCreateReleasesPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Release.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        lookup_field = self.kwargs.get('id')
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
        release = serializer.save()
        message_title = f"Release '{release.name}' Was Updated"
        message_body = f"Release '{release.name}' was updated"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)
        return Response(serializer.data)


class ReleaseDeleteAPIView(DestroyAPIView):
    '''
    DELETE a Release only if you are the owner
    '''
    permission_classes = [IsAuthenticated, CanCreateReleasesPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseSerializer

    def get_queryset(self):
        return Release.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        lookup_field = self.kwargs.get('pk')
        obj = get_object_or_404(
            queryset,
            id=lookup_field,
            tenant=self.request.user.tenant,
            owner=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if not instance.current_stage.allow_release_delete:
            return Response(
                {"detail": "Deletion not allowed in this stage."},
                status=status.HTTP_403_FORBIDDEN)
        if request.user != instance.owner:
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN)

        message_title = f"Release '{instance.name}' Was Deleted"
        message_body = f"Release '{instance.name}' was deleted"
        CommunicationHelpers.create_new_message(
            request.user,
            message_title,
            message_body,
            False)

        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ReleaseSearchView(ListAPIView):
    '''
    GET search for releases. Rough version of search
    '''
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    pagination_class = None
    queryset = Release.objects.all()
    serializer_class = ReleaseSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name', 'identifier']

    def get_queryset(self):
        return Release.objects.filter(tenant=self.request.user.tenant)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        release_list = [
            f"{release.identifier} - {release.name}"
            for release in queryset
        ]

        return Response(release_list)
