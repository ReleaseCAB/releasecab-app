from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from releasecab_api.settings import DEBUG

from .views.role_views import (AdminRoleDetail, AdminRoleList, GetRoleById,
                               RoleCreateView, RoleDeleteAPIView,
                               RoleListByTenant, RoleUpdateView)
from .views.team_views import (AddUserToTeamsView, AdminTeamDetail,
                               AdminTeamList, TeamCreateView,
                               TeamDeleteAPIView, TeamListByTenant,
                               TeamRetrieve, TeamUpdateView,
                               UserManagedTeamsListView)
from .views.user_views import (AdminUserDetail, AdminUserList, GetUserById,
                               LoginView, LogoutSessionView, MeDetail,
                               UpdateUserView, UserCreate, UserListByTenant,
                               UserProfileSearchView, UserUpdate,
                               UserValidationView)

urlpatterns = [
    # Admin
    path('admin/list/', AdminUserList.as_view(), name='admin-user-list'),
    path(
        'admin/<int:pk>/',
        AdminUserDetail.as_view(),
        name='admin-user-detail'),
    path('admin/roles/list/', AdminRoleList.as_view(), name='admin-role-list'),
    path(
        'admin/roles/<int:pk>/',
        AdminRoleDetail.as_view(),
        name='admin-role-detail'),
    path('admin/teams/list/', AdminTeamList.as_view(), name='admin-team-list'),
    path(
        'admin/teams/<int:pk>/',
        AdminTeamDetail.as_view(),
        name='admin-team-detail'),
    # Users
    path('create/', UserCreate.as_view(), name='user-create'),
    path('me/', MeDetail.as_view(), name='me-detail'),
    path('update/', UserUpdate.as_view(), name='user-update'),
    path('validate/', UserValidationView.as_view(), name='user-validation'),
    path('users/', UserListByTenant.as_view(), name='user-list-by-tenant'),
    path('<int:pk>/', GetUserById.as_view(), name='get-user-by-id'),
    path('update/<int:pk>/', UpdateUserView.as_view(), name='update-user'),
    path(
        'search/',
        UserProfileSearchView.as_view(),
        name='user-profile-search'),
    # Roles
    path('roles/', RoleListByTenant.as_view(), name='role-list-by-tenant'),
    path(
        'roles/delete/<int:pk>/',
        RoleDeleteAPIView.as_view(),
        name='role-delete'),
    path('roles/create/', RoleCreateView.as_view(), name='role-create'),
    path('roles/<int:pk>/', GetRoleById.as_view(), name='get-role-by-id'),
    path(
        'roles/update/<int:pk>/',
        RoleUpdateView.as_view(),
        name='update-role'),
    # Teams
    path('teams/', TeamListByTenant.as_view(), name='team-list-by-tenant'),
    path('teams/<int:pk>/', TeamRetrieve.as_view(), name='team-retrieve'),
    path('teams/create/', TeamCreateView.as_view(), name='team-create'),
    path(
        'teams/delete/<int:pk>/',
        TeamDeleteAPIView.as_view(),
        name='team-delete'),
    path(
        'teams/update/<int:pk>/',
        TeamUpdateView.as_view(),
        name='team-update'),
    path(
        'teams/add-users/',
        AddUserToTeamsView.as_view(),
        name='team-add-users'),
    path(
        'teams/user-managed-teams/',
        UserManagedTeamsListView.as_view(),
        name='user-managed-teams'),
]

if DEBUG:
    urlpatterns += [path('login/',
                         LoginView.as_view(),
                         name='login'),
                    path('logout-session/',
                         LogoutSessionView.as_view(),
                         name='logout-session'),
                    ]

urlpatterns = format_suffix_patterns(urlpatterns)
