from django.conf import settings
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import IsAdminPermission

from ..models import Tenant
from ..serializers.tenant_serializers import TenantSerializer


class AdminTenantList(ListAPIView):
    """
    GET View to retrieve a list of tenants. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class AdminTenantDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific tenant
    Takes in the primary key of the tenant to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class TenantCreate(CreateAPIView):
    """
    POST a new tenant, doesn't require auth since it's the first thing they do
    when creating a new tenant
    """
    permission_classes: list = []
    authentication_classes: list = []
    serializer_class = TenantSerializer


class MyTenant(RetrieveAPIView):
    """
    GET the user's tenant, user must be authenticated first
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = TenantSerializer

    def get_object(self):
        return self.request.user.tenant


class FindTenantByInviteCodeView(CreateAPIView):
    """
    GET the tenant based on the invite code, no permissions is required
    """
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = TenantSerializer

    def create(self, request, *args, **kwargs):
        invite_code = request.data.get('tenant_code')
        try:
            tenant = Tenant.objects.get(invite_code=invite_code)
            serializer = self.get_serializer(tenant)
            return Response(serializer.data)
        except Tenant.DoesNotExist:
            return Response({'error': 'Tenant not found.'},
                            status=status.HTTP_404_NOT_FOUND)


class ReleaseCabSettingsView(APIView):
    """
    GET tenant config, no auth required
    """
    authentication_classes: list = []

    def get(self, request):
        only_one_tenant = getattr(
            settings, 'RELEASECAB_ONLY_ONE_TENANT', False)
        if not only_one_tenant:
            return Response({'allowed_to_create_tenant': bool(True)})
        if not Tenant.objects.exists():
            return Response({'allowed_to_create_tenant': bool(True)})
        else:
            return Response({'allowed_to_create_tenant': bool(False)})
