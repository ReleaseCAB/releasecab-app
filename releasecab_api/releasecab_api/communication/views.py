from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import IsAdminPermission

from .models import Communication
from .serializers import CommunicationSerializer


class AdminCommunicationList(ListAPIView):
    """
    GET View to retrieve a list of Communication. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Communication.objects.all()
    serializer_class = CommunicationSerializer


class AdminCommunicationDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific Communication
    Takes in the primary key of the Communication to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Communication.objects.all()
    serializer_class = CommunicationSerializer


class CommunicationUserList(ListAPIView):
    """
    GET a list of all Communications for that tenant/user
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = CommunicationSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        Communications = Communication.objects.filter(
            tenant=tenant, to_user=self.request.user).order_by('-created_at')

        return Communications


class CommunicationRetrieve(RetrieveAPIView):
    """
    GET a communication by id
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = CommunicationSerializer

    def get_object(self):
        communication_id = self.kwargs.get('id')
        tenant = self.request.user.tenant

        try:
            communication = Communication.objects.get(
                id=communication_id, tenant=tenant)
            self.check_object_permissions(self.request, communication)
            return communication
        except communication.DoesNotExist:
            return Response(
                {"error": "Communication not found."},
                status=status.HTTP_404_NOT_FOUND)
