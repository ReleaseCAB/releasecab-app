from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.authentication import SessionAuthentication
from rest_framework.generics import (CreateAPIView, DestroyAPIView,
                                     ListAPIView, RetrieveAPIView)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from releasecab_api.api_permissions import IsAdminPermission
from releasecab_api.communication.helpers import CommunicationHelpers

from ..models import Release, ReleaseComment
from ..serializers.release_comment_serializer import ReleaseCommentSerializer


class AdminReleaseCommentList(ListAPIView):
    """
    GET View to retrieve a list of release comments. Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseComment.objects.all()
    serializer_class = ReleaseCommentSerializer


class AdminReleaseCommentDetail(RetrieveAPIView):
    """
    GET View to retrieve a detail of a specific comment
    Takes in the primary key of the Stage to retrieve.
    Admin Only.
    """
    permission_classes = [IsAuthenticated, IsAdminPermission]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    queryset = ReleaseComment.objects.all()
    serializer_class = ReleaseCommentSerializer


class ReleaseCommentRetrieve(ListAPIView):
    """
    GET all release comment associated with a release ID
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseCommentSerializer

    def get_queryset(self):
        id = self.kwargs.get('pk')
        tenant = self.request.user.tenant
        try:
            release = Release.objects.get(identifier=id, tenant=tenant)
            comments = ReleaseComment.objects.filter(
                release=release, tenant=tenant).order_by('-created_at')
            self.check_object_permissions(self.request, comments)
            return comments
        except ReleaseComment.DoesNotExist:
            return Response(
                {"error": "Release comments not found."},
                status=status.HTTP_404_NOT_FOUND
            )


class ReleaseCommentCreate(CreateAPIView):
    """
    POST a new comment.
    """
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseCommentSerializer

    def perform_create(self, serializer):
        release = Release.objects.get(
            pk=self.request.data['release'],
            tenant=self.request.user.tenant)
        comment = serializer.save(
            tenant=self.request.user.tenant,
            writer=self.request.user,
            release=release,
            comment_body=self.request.data['comment_body'],
        )
        message_title = f"Comment Was Added on Release '{release.name}'"
        message_body = f"Comment was added on release '{release.name}'.\
            Comment: '{comment.comment_body}'"
        CommunicationHelpers.create_new_message(
            self.request.user,
            message_title,
            message_body,
            False)


class CommentDeleteAPIView(DestroyAPIView):
    '''
    DELETE a Comment only if you are the owner
    '''
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication, SessionAuthentication]
    serializer_class = ReleaseCommentSerializer

    def get_queryset(self):
        return ReleaseComment.objects.all()

    def get_object(self):
        queryset = self.get_queryset()
        lookup_field = self.kwargs.get('pk')
        obj = get_object_or_404(
            queryset,
            id=lookup_field,
            tenant=self.request.user.tenant,
            writer=self.request.user)
        self.check_object_permissions(self.request, obj)
        return obj

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if request.user == instance.writer:
            message_title = f"Comment '{instance.pk}' Was Deleted"
            message_body = f"Comment '{instance.pk}' was deleted"
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
