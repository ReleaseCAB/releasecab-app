from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views import (AdminBlackoutDetail, AdminBlackoutList, BlackoutCreate,
                    BlackoutDeleteAPIView, BlackoutRetrieve,
                    BlackoutTenantCalendarList, BlackoutTenantList,
                    BlackoutUpdateView)

urlpatterns = [
    # Admin
    path(
        'admin/list/',
        AdminBlackoutList.as_view(),
        name='admin-blackout-list'),
    path(
        'admin/<int:pk>/',
        AdminBlackoutDetail.as_view(),
        name='admin-blackout-detail'),
    # Blackout
    path('create/', BlackoutCreate.as_view(), name='blackout-create'),
    path(
        'update/<int:id>/',
        BlackoutUpdateView.as_view(),
        name='blackout-update'),
    path(
        'blackout/<str:id>/',
        BlackoutRetrieve.as_view(),
        name='blackout-retrieve'),
    path(
        'blackout/',
        BlackoutTenantList.as_view(),
        name='blackout-tenant-list'),
    path(
        'calendar-blackouts/',
        BlackoutTenantCalendarList.as_view(),
        name='calendar-blackout-list'),
    path(
        'delete/<int:pk>/',
        BlackoutDeleteAPIView.as_view(),
        name='blackout-delete'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
