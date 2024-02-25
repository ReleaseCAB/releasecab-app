from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import IsAdminPermission

from ..models import ReleaseConfig
from ..serializers.release_config_serializers import ReleaseConfigSerializer


class AdminReleaseConfigList(ListAPIView):
    """
    GET View to retrieve a list of ReleaseEnvironments. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseConfig.objects.all()
    serializer_class = ReleaseConfigSerializer


class AdminReleaseConfigDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific ReleaseEnvironment
    Takes in the primary key of the ReleaseEnvironment to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseConfig.objects.all()
    serializer_class = ReleaseConfigSerializer


class ReleaseConfigByTenantId(ListAPIView):
    """
    GET View to retrieve a list of release configs by Tenant ID.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseConfigSerializer
    pagination_class = None

    def get_queryset(self):
        tenant = self.request.user.tenant
        config = ReleaseConfig.objects.filter(
            tenant=tenant)

        return config
