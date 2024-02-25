from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (DestroyAPIView, ListAPIView,
                                     RetrieveAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (IsAdminPermission,
                                            IsTenantOwnerPermission)
from releasecab_api.communication.helpers import CommunicationHelpers
from releasecab_api.user.models import User

from ..models import InvitedUser
from ..serializers.invited_users_serializers import InvitedUserSerializer


class AdminInvitedUserList(ListAPIView):
    """
    GET View to retrieve a list of invited users. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = InvitedUser.objects.all()
    serializer_class = InvitedUserSerializer


class AdminInvitedUserDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific invited user
    Takes in the primary key of the tenant to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = InvitedUser.objects.all()
    serializer_class = InvitedUserSerializer


class InvitedUserListByTenant(ListAPIView):
    """
    GET View to retrieve a list of invited users based on the user's tenant
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = InvitedUserSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        invited_users = InvitedUser.objects.filter(tenant=tenant)
        disable_pagination = self.request.query_params.get(
            'disable_pagination', False)
        if disable_pagination and disable_pagination.lower() == 'true':
            self.pagination_class = None
        sort_by = self.request.query_params.get('sort_by', 'email')
        order = self.request.query_params.get('order_by', 'asc')

        if order not in ['asc', 'desc']:
            order = 'asc'

        if sort_by == "has_joined":
            def sorting_key(obj):
                user = self.request.user
                return User.objects.filter(
                    email=obj.email, tenant=user.tenant).exists()
            invited_users = sorted(
                invited_users,
                key=sorting_key,
                reverse=(order == 'desc')
            )
        else:
            if order == 'asc':
                invited_users = invited_users.order_by(sort_by)
            else:
                invited_users = invited_users.order_by(f'-{sort_by}')

        return invited_users


class InvitedUserCreateView(APIView):
    """
    POST an email and add it to invited users. Returns an error if the email
    already exists
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = InvitedUserSerializer

    def post(self, request):
        serializer = InvitedUserSerializer(data=request.data)
        tenant = request.user.tenant

        if serializer.is_valid():
            email = serializer.validated_data['email']
            existing_user = InvitedUser.objects.filter(
                email=email, tenant=tenant).first()

            if existing_user:
                return Response({"detail": "Email already exists"},
                                status=status.HTTP_400_BAD_REQUEST)
            else:
                invited_user = serializer.save(tenant=tenant)
                message_title = f"Invited User '{invited_user.email}' Was\
                      Added"
                message_body = f"Release '{invited_user.email}' was added"
                CommunicationHelpers.create_new_message(
                    self.request.user,
                    message_title,
                    message_body,
                    False)
                return Response(
                    serializer.data,
                    status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class InvitedUserDeleteAPIView(DestroyAPIView):
    '''
    DELETE an invited user
    '''
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    queryset = InvitedUser.objects.all()
    serializer_class = InvitedUserSerializer

    def perform_destroy(self, instance):
        message_title = f"Invited User '{instance.email}' Was Deleted"
        message_body = f"Invited User '{instance.email}' was deleted"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)
        super(InvitedUserDeleteAPIView, self).perform_destroy(instance)
