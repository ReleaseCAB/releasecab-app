from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from rest_framework import filters, status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (CreateAPIView, ListAPIView,
                                     RetrieveAPIView, UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (IsAdminPermission,
                                            IsTenantOwnerOrTeamManager,
                                            IsTenantOwnerPermission)
from releasecab_api.communication.helpers import CommunicationHelpers

from ..models import User
from ..serializers.user_serializers import (UserSerializer,
                                            UserValidationSerializer)


class AdminUserList(ListAPIView):
    """
    GET View to retrieve a list of Users. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AdminUserDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific User
    Takes in the primary key of the User to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = User.objects.all()
    serializer_class = UserSerializer


class MeDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of the current logged in user
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class GetUserById(RetrieveAPIView):
    """
    GET View to retrieve a detail of a different user.
    Check if the user fetching the data is a tenant owner, and the
    user we are fetching belongs to that tenant
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        id = self.kwargs.get('pk')
        tenant = self.request.user.tenant

        try:
            releases = User.objects.get(
                id=id, tenant=tenant)
            self.check_object_permissions(self.request, releases)
            return releases
        except User.DoesNotExist:
            return Response(
                {"error": "Release not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class UserUpdate(APIView):
    """
    POST an updated user for yourself. Authentication is required
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def post(self, request):
        user = request.user
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            user_serializer.save()
            CommunicationHelpers.create_new_message(
                [self.request.user],
                'You Have Updated Your Profile',
                "Your profile was updated.",
                False)
            return Response({'message': 'User updated successfully'})
        else:
            return Response(user_serializer.errors)


class UpdateUserView(UpdateAPIView):
    """
    POST an updated user for someone else.
    """
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return User.objects.all()

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
            user = serializer.save()
            message_title = f"You have Updated {user.email}'s profile"
            message_body = f"User {user.email}'s profile was updated."
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


class UserValidationView(APIView):
    """
    POST to validate a new user's email is not taken.
    No auth is required since this is signup flow
    """

    def post(self, request):
        serializer = UserValidationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        try:
            User.objects.get(email=email)
            email_taken = True
            return Response(status=409, data={'email_taken': email_taken})
        except User.DoesNotExist:
            email_taken = False
            return Response(status=200, data={'email_taken': email_taken})


class UserListByTenant(ListAPIView):
    """
    GET a list of all users for that tenant. Only tenant owners can view this
    """
    permission_classes = [IsAuthenticated, IsTenantOwnerPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = UserSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        users = User.objects.filter(tenant=tenant)
        sort_by = self.request.query_params.get('sort_by', 'last_name')
        order = self.request.query_params.get('order_by', 'asc')

        if order not in ['asc', 'desc']:
            order = 'asc'

        if order == 'asc':
            users = users.order_by(sort_by)
        else:
            users = users.order_by(f'-{sort_by}')

        return users


class UserProfileSearchView(ListAPIView):
    '''
    GET search for a user. Only tenant owners or managers can search
    '''
    permission_classes = [IsAuthenticated, IsTenantOwnerOrTeamManager]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    pagination_class = None
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['first_name', 'last_name']

    def get_queryset(self):
        return User.objects.filter(tenant=self.request.user.tenant)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())

        user_list = [
            {"label": f"{user.first_name} {user.last_name}", "value": user.id}
            for user in queryset
        ]

        return Response(user_list)


class UserCreate(CreateAPIView):
    """
    POST a new user. No authentication is required
    """
    serializer_class = UserSerializer


class LoginView(APIView):
    """
    POST View to login a user
    Note: This is only for session based authentication which is only
    used for the browsable API. JWT authentication is used for all other
    API calls.
    """

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            login(request, user)
            return Response({'message': 'Login successful'})
        else:
            return Response({'message': 'Invalid credentials'})


class LogoutSessionView(APIView):
    """
    POST View to logout a user
    Only for session based authentication which is only
    used for the browsable API. JWT authentication is used for all other
    API calls.
    """

    def post(self, request):
        logout(request)
        return Response({'message': 'Logout successful'})
