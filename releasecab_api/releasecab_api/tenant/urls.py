from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views.invited_users_views import (AdminInvitedUserDetail,
                                        AdminInvitedUserList,
                                        InvitedUserCreateView,
                                        InvitedUserDeleteAPIView,
                                        InvitedUserListByTenant)
from .views.tenants_view import (AdminTenantDetail, AdminTenantList,
                                 FindTenantByInviteCodeView, MyTenant,
                                 ReleaseCabSettingsView, TenantCreate)

urlpatterns = [
    # Admin
    path('admin/list/', AdminTenantList.as_view(), name='admin-tenant-list'),
    path(
        'admin/<int:pk>/',
        AdminTenantDetail.as_view(),
        name='admin-tenant-detail'),
    path('admin/invited-users/list/',
         AdminInvitedUserList.as_view(),
         name='admin-invited-user-list'),
    path('admin/invited-users/<int:pk>/',
         AdminInvitedUserDetail.as_view(),
         name='admin-invited-user-detail'),
    # Tenants
    path('create/', TenantCreate.as_view(), name='tenant-create'),
    path('', MyTenant.as_view(), name='my-tenant-detail'),
    path(
        'find-by-invite-code/',
        FindTenantByInviteCodeView.as_view(),
        name='tenant-find-by-code'),
    path('config/', ReleaseCabSettingsView.as_view(), name='tenant-config'),
    # Invited Users
    path(
        'invited-users/',
        InvitedUserListByTenant.as_view(),
        name='tenant-invited-users'),
    path(
        'invited-users/create/',
        InvitedUserCreateView.as_view(),
        name='tenant-invited-users-create'),
    path(
        'invited-users/delete/<int:pk>/',
        InvitedUserDeleteAPIView.as_view(),
        name='invited-users-delete'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
