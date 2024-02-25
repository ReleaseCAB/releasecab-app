from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (ListAPIView, RetrieveAPIView,
                                     UpdateAPIView, get_object_or_404)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (IsAdminPermission,
                                            IsTenantOwnerPermission)
from releasecab_api.communication.helpers import CommunicationHelpers

from ..models import ReleaseStage
from ..serializers.release_stage_serializers import ReleaseStageSerializer


class AdminStageList(ListAPIView):
    """
    GET View to retrieve a list of Stages. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseStage.objects.all()
    serializer_class = ReleaseStageSerializer


class AdminStageDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific Stage
    Takes in the primary key of the Stage to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseStage.objects.all()
    serializer_class = ReleaseStageSerializer


class ReleaseStageRetrieve(RetrieveAPIView):
    """
    GET a release stage by identifier.
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseStageSerializer

    def get_object(self):
        id = self.kwargs.get('pk')
        tenant = self.request.user.tenant

        try:
            releases = ReleaseStage.objects.get(
                id=id, tenant=tenant)
            self.check_object_permissions(self.request, releases)
            return releases
        except ReleaseStage.DoesNotExist:
            return Response(
                {"error": "Release Type not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class ReleaseStageUpdateView(UpdateAPIView):
    """
    POST an updated release stage
    """
    serializer_class = ReleaseStageSerializer
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return ReleaseStage.objects.all()

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

        if request.user.is_tenant_owner:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            release_stage = serializer.save()
            message_title = f"Release Stage '{release_stage.name}' Was Updated"
            message_body = f"Release stage '{release_stage.name}' was updated"
            CommunicationHelpers.create_new_message(
                self.request.user,
                message_title,
                message_body,
                False)
            return Response(serializer.data)
        else:
            return Response(
                {
                    "detail": "You do not have permission to \
                    perform this action."},
                status=status.HTTP_403_FORBIDDEN)


class ReleaseStageByTenantId(ListAPIView):
    """
    GET View to retrieve a list of Release Stage by Tenant ID.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseStageSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        release_types = ReleaseStage.objects.filter(tenant=tenant)
        disable_pagination = self.request.query_params.get(
            'disable_pagination', False)
        if disable_pagination and disable_pagination.lower() == 'true':
            self.pagination_class = None
        sort_by = self.request.query_params.get('sort_by', 'name')
        order = self.request.query_params.get('order_by', 'asc')

        if order not in ['asc', 'desc']:
            order = 'asc'

        if order == 'asc':
            release_types = release_types.order_by(sort_by)
        else:
            release_types = release_types.order_by(f'-{sort_by}')

        return release_types


class ReleaseStageCreateView(APIView):
    """
    POST an release stage and add it to the table. Returns an error
    if the release stage already exists
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseStageSerializer

    def post(self, request):
        serializer = ReleaseStageSerializer(data=request.data)
        tenant = request.user.tenant

        if serializer.is_valid():
            name = serializer.validated_data['name']
            existing_release_stage = ReleaseStage.objects.filter(
                name=name, tenant=tenant).first()

            if existing_release_stage:
                return Response({"detail": "Name already exists"},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                release_stage = serializer.save(tenant=tenant)
                message_title = f"Release Stage '{release_stage.name}'\
                Was Created"
                message_body = f"Release stage '{release_stage.name}'\
                was created"
                CommunicationHelpers.create_new_message(
                    self.request.user,
                    message_title,
                    message_body,
                    False)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
