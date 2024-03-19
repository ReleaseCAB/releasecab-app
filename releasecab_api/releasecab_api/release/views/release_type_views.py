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

from ..models import ReleaseType
from ..serializers.release_type_serializers import ReleaseTypeSerializer


class AdminReleaseTypeList(ListAPIView):
    """
    GET View to retrieve a list of ReleaseTypes. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseType.objects.all()
    serializer_class = ReleaseTypeSerializer
    pagination_class = None


class AdminReleaseTypeDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific ReleaseType
    Takes in the primary key of the ReleaseType to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseType.objects.all()
    serializer_class = ReleaseTypeSerializer


class ReleaseTypesByTenantId(ListAPIView):
    """
    GET View to retrieve a list of ReleaseTypes by Tenant ID.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseTypeSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        release_types = ReleaseType.objects.filter(tenant=tenant)
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


class ReleaseTypeCreateView(APIView):
    """
    POST an release and add it to the table. Returns an error if the release
    already exists
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseTypeSerializer

    def post(self, request):
        serializer = ReleaseTypeSerializer(data=request.data)
        tenant = request.user.tenant

        if serializer.is_valid():
            name = serializer.validated_data['name']
            existing_user = ReleaseType.objects.filter(
                name=name, tenant=tenant).first()

            if existing_user:
                return Response({"detail": "Name already exists"},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                release_type = serializer.save(tenant=tenant)
                message_title = f"Release Type '{release_type.name}'\
                      Was Created"
                message_body = f"Release type '{release_type.name}'\
                      was created"
                CommunicationHelpers.create_new_message(
                    [self.request.user],
                    message_title,
                    message_body,
                    False)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ReleaseTypeRetrieve(RetrieveAPIView):
    """
    GET a release type by identifier.
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseTypeSerializer

    def get_object(self):
        id = self.kwargs.get('pk')
        tenant = self.request.user.tenant

        try:
            releases = ReleaseType.objects.get(
                id=id, tenant=tenant)
            self.check_object_permissions(self.request, releases)
            return releases
        except ReleaseType.DoesNotExist:
            return Response(
                {"error": "Release Type not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class ReleaseTypeUpdateView(UpdateAPIView):
    """
    POST an updated release type
    """
    serializer_class = ReleaseTypeSerializer
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return ReleaseType.objects.all()

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
            release_type = serializer.save()
            message_title = f"Release Type '{release_type.name}' Was Updated"
            message_body = f"Release type '{release_type.name}' was updated"
            CommunicationHelpers.create_new_message(
                [self.request.user],
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


class ReleaseTypeDeleteAPIView(DestroyAPIView):
    '''
    DELETE an release type
    '''
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    queryset = ReleaseType.objects.all()
    serializer_class = ReleaseTypeSerializer

    def perform_destroy(self, instance):
        message_title = f"Release Type '{instance.name}' Was Deleted"
        message_body = f"Release Type '{instance.name}' was deleted"
        CommunicationHelpers.create_new_message(
            [self.request.user],
            message_title,
            message_body,
            False)
        super(ReleaseTypeDeleteAPIView, self).perform_destroy(instance)
