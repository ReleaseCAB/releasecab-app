from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (DestroyAPIView, ListAPIView,
                                     RetrieveAPIView, UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (IsAdminPermission,
                                            IsTenantOwnerPermission)
from releasecab_api.communication.helpers import CommunicationHelpers

from ..models import Role
from ..serializers.role_serializers import RoleSerializer


class AdminRoleList(ListAPIView):
    """
    GET View to retrieve a list of Roles. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class AdminRoleDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific Role
    Takes in the primary key of the Role to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Role.objects.all()
    serializer_class = RoleSerializer


class RoleListByTenant(ListAPIView):
    """
    GET View to retrieve a list of Roles for a specific user's tenant
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = RoleSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        roles = Role.objects.filter(tenant=tenant)
        disable_pagination = self.request.query_params.get(
            'disable_pagination', False)
        if disable_pagination and disable_pagination.lower() == 'true':
            self.pagination_class = None
        sort_by = self.request.query_params.get('sort_by', 'name')
        order = self.request.query_params.get('order_by', 'asc')

        if order not in ['asc', 'desc']:
            order = 'asc'

        if order == 'asc':
            roles = roles.order_by(sort_by)
        else:
            roles = roles.order_by(f'-{sort_by}')

        return roles


class RoleUpdateView(UpdateAPIView):
    """
    POST an updated role
    """
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Role.objects.all()

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
            role = serializer.save()
            message_title = f"Role '{role.name}' Was Updated"
            message_body = f"Role '{role.name}' was updated"
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


class RoleDeleteAPIView(DestroyAPIView):
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    queryset = Role.objects.all()
    serializer_class = RoleSerializer

    def perform_destroy(self, instance):
        message_title = f"Role '{instance.name}' Was Deleted"
        message_body = f"Role '{instance.name}' was deleted"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)
        super(RoleDeleteAPIView, self).perform_destroy(instance)


class RoleCreateView(APIView):
    """
    POST an role and add it to the table. Returns an error if the role
    already exists
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = RoleSerializer

    def post(self, request):
        serializer = RoleSerializer(data=request.data)
        tenant = request.user.tenant

        if serializer.is_valid():
            name = serializer.validated_data['name']
            existing_role = Role.objects.filter(
                name=name, tenant=tenant).first()

            if existing_role:
                return Response({"detail": "Name already exists"},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                role = serializer.save(tenant=tenant)
                message_title = f"Role '{role.name}' Was Created"
                message_body = f"Role '{role.name}' was created"
                CommunicationHelpers.create_new_message(
                    self.request.user,
                    message_title,
                    message_body,
                    False)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GetRoleById(RetrieveAPIView):
    """
    GET View to retrieve a detail of role
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Role.objects.all()
    serializer_class = RoleSerializer

    def get_object(self):
        id = self.kwargs.get('pk')
        tenant = self.request.user.tenant

        try:
            roles = Role.objects.get(
                id=id, tenant=tenant)
            self.check_object_permissions(self.request, roles)
            return roles
        except Role.DoesNotExist:
            return Response(
                {"error": "Role not found."},
                status=status.HTTP_404_NOT_FOUND
            )
