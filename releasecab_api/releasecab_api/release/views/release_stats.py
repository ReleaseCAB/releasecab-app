
from django.db.models import Q
from django.utils import timezone
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.blackout.models import Blackout

from ..models import Release


class ReleaseStatViewForUser(APIView):
    '''
    GET a user's dashboard stats
    '''
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]

    def get(self, request, *args, **kwargs):
        user = self.request.user
        my_open_releases = Release.objects.filter(
            owner=user,
            current_stage__is_end_stage=False,
            tenant=user.tenant
        )
        all_open_releases = Release.objects.filter(
            current_stage__is_end_stage=False,
            tenant=user.tenant
        )
        current_datetime = timezone.now()
        blackout_exists_now = Blackout.objects.filter(
            Q(start_date__lte=current_datetime) &
            Q(end_date__gte=current_datetime)
        ).exists()

        return Response({'my_open_releases': my_open_releases.count(),
                         'all_open_releases': all_open_releases.count(),
                         'current_blackout': blackout_exists_now},
                        status=status.HTTP_200_OK)
