from django.db.models import Case, CharField, Value, When
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (CreateAPIView, DestroyAPIView,
                                     ListAPIView, RetrieveAPIView,
                                     UpdateAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import (CanCreateBlackoutsPermission,
                                            IsAdminPermission)

from ..communication.helpers import CommunicationHelpers
from .models import Blackout
from .serializers import BlackoutSerializer


class AdminBlackoutList(ListAPIView):
    """
    GET View to retrieve a list of blackout. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Blackout.objects.all()
    serializer_class = BlackoutSerializer


class AdminBlackoutDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific blackout
    Takes in the primary key of the blackout to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = Blackout.objects.all()
    serializer_class = BlackoutSerializer


class BlackoutCreate(CreateAPIView):
    """
    POST a new blackout. Authentication is required. User must have
    CanCreateBlackout Permission
    """
    permission_classes = [IsAuthenticated, CanCreateBlackoutsPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = BlackoutSerializer

    def perform_create(self, serializer):
        validated_data = serializer.validated_data
        tenant = self.request.user.tenant
        owner = self.request.user
        validated_data['tenant'] = tenant
        validated_data['owner'] = owner
        blackout_instance = serializer.save()
        message_title = f"Blackout '{blackout_instance.name}' Was Created"
        message_body = f"Blackout '{blackout_instance.name}' was created"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)


class BlackoutRetrieve(RetrieveAPIView):
    """
    GET a blackout by id. Automatically checks the blackout
    exists just for that tenant.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = BlackoutSerializer

    def get_object(self):
        blackout_id = self.kwargs.get('id')
        tenant = self.request.user.tenant

        try:
            blackout = Blackout.objects.get(id=blackout_id, tenant=tenant)
            self.check_object_permissions(self.request, blackout)
            return blackout
        except Blackout.DoesNotExist:
            return Response(
                {"error": "Blackout not found."},
                status=status.HTTP_404_NOT_FOUND)


class BlackoutUpdateView(UpdateAPIView):
    """
    PATCH a blackout. User must have CanCreateBlackout permission and
    be the owner of the blackout
    """
    serializer_class = BlackoutSerializer
    permission_classes = [IsAuthenticated, CanCreateBlackoutsPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get_queryset(self):
        return Blackout.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        lookup_field = self.kwargs.get('id')
        obj = get_object_or_404(
            queryset,
            id=lookup_field,
            tenant=self.request.user.tenant,
            owner=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user == instance.owner:
            serializer = self.get_serializer(instance, data=request.data)
            serializer.is_valid(raise_exception=True)
            blackout_instance = serializer.save()
            message_title = f"Blackout '{blackout_instance.name}' Was Updated"
            message_body = f"Blackout '{blackout_instance.name}' was updated"
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


class BlackoutTenantList(ListAPIView):
    """
    GET a list of all blackouts for that tenant
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = BlackoutSerializer

    def get_queryset(self):
        tenant = self.request.user.tenant
        blackouts = Blackout.objects.filter(tenant=tenant)
        sort_by = self.request.query_params.get('sort_by', 'name')
        order = self.request.query_params.get('order_by', 'asc')
        if order not in ['asc', 'desc']:
            order = 'asc'
        blackouts = blackouts.annotate(
            active_status=Case(
                When(
                    start_date__lte=timezone.now(),
                    end_date__gte=timezone.now(),
                    then=Value('active')
                ),
                When(
                    start_date__gt=timezone.now(),
                    then=Value('future')
                ),
                When(
                    end_date__lt=timezone.now(),
                    then=Value('expired')
                ),
                default=Value(''),
                output_field=CharField()
            )
        )
        if sort_by == 'active_status':
            def key(x): return x.active_status
        else:
            def key(x): return getattr(x, sort_by)
        if order == 'asc':
            blackouts = sorted(blackouts, key=key)
        else:
            blackouts = sorted(blackouts, key=key, reverse=True)

        return blackouts


class BlackoutTenantCalendarList(ListAPIView):
    """
    GET a list of all blackouts for that tenant
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = BlackoutSerializer
    pagination_class = None

    def get_queryset(self):
        tenant = self.request.user.tenant
        blackouts = Blackout.objects.filter(tenant=tenant).order_by('name')
        return blackouts


class BlackoutDeleteAPIView(DestroyAPIView):
    '''
    DELETE a blackout only if you are the owner and has
    CanCreateBlackoutPermissions
    '''
    permission_classes = [IsAuthenticated, CanCreateBlackoutsPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = BlackoutSerializer

    def get_queryset(self):
        return Blackout.objects.all()

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
        if request.user == instance.owner:
            serializer = self.get_serializer(instance)
            blackout_status = serializer.get_active_status(instance)
            if blackout_status == 'active':
                return Response(
                    {"detail": "Cannot delete an active blackout."},
                    status=status.HTTP_403_FORBIDDEN)
            elif blackout_status == 'expired':
                return Response(
                    {"detail": "Cannot delete an expired blackout."},
                    status=status.HTTP_403_FORBIDDEN)
            message_title = f"Blackout '{instance.name}' Was Deleted"
            message_body = f"Blackout '{instance.name}' was deleted"
            CommunicationHelpers.create_new_message(
                request.user,
                message_title,
                message_body,
                False)
            instance.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        else:
            return Response(
                {"detail": "You do not have permission\
                  to perform this action."},
                status=status.HTTP_403_FORBIDDEN)
