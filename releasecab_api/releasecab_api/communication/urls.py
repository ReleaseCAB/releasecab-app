from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import (AdminCommunicationDetail, AdminCommunicationList,
                    CommunicationRetrieve, CommunicationUserList)

urlpatterns = [
    # Admin
    path('admin/list/', AdminCommunicationList.as_view(),
         name='admin-communication-list'),
    path('admin/<int:pk>/', AdminCommunicationDetail.as_view(),
         name='admin-communication-detail'),
    # Communication
    path('', CommunicationUserList.as_view(),
         name='communication-user-list'),
    path('communication/<int:id>/', CommunicationRetrieve.as_view(),
         name='communication-retrieve'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
