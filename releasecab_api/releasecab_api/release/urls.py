from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns

from .views.release_comment_views import (AdminReleaseCommentDetail,
                                          AdminReleaseCommentList,
                                          CommentDeleteAPIView,
                                          ReleaseCommentCreate,
                                          ReleaseCommentRetrieve)
from .views.release_config_views import (AdminReleaseConfigDetail,
                                         AdminReleaseConfigList,
                                         ReleaseConfigByTenantId)
from .views.release_connections_views import (
    ReleaseConnectionCreate, ReleaseConnectionDeleteAPIView,
    ReleaseStageConnectionsByTenantId, ReleaseStageConnectionsView,
    ReleaseStageConnectionUpdateView)
from .views.release_env_views import (AdminReleaseEnvironmentDetail,
                                      AdminReleaseEnvironmentList,
                                      ReleaseEnvCreateView,
                                      ReleaseEnvDeleteAPIView,
                                      ReleaseEnvironmentByTenantId,
                                      ReleaseEnvRetrieve, ReleaseEnvUpdateView)
from .views.release_stage_views import (AdminStageDetail, AdminStageList,
                                        ReleaseStageByTenantId,
                                        ReleaseStageCreateView,
                                        ReleaseStageDeleteAPIView,
                                        ReleaseStageRetrieve,
                                        ReleaseStageUpdateView)
from .views.release_stats_views import ReleaseStatViewForUser
from .views.release_type_views import (AdminReleaseTypeDetail,
                                       AdminReleaseTypeList,
                                       ReleaseTypeCreateView,
                                       ReleaseTypeDeleteAPIView,
                                       ReleaseTypeRetrieve,
                                       ReleaseTypesByTenantId,
                                       ReleaseTypeUpdateView)
from .views.release_views import (AdminReleaseDetail, AdminReleaseList,
                                  ReleaseCreate, ReleaseDeleteAPIView,
                                  ReleaseRetrieve, ReleaseSearchView,
                                  ReleaseTenantCalendarList, ReleaseTenantList,
                                  ReleaseUpdateView)

urlpatterns = [
    # Admin Urls
    path('admin/list/', AdminReleaseList.as_view(),
         name='admin-release-list'),
    path(
        'admin/<int:pk>/',
        AdminReleaseDetail.as_view(),
        name='admin-release-detail'),
    path('admin/release-environments/list/',
         AdminReleaseEnvironmentList.as_view(),
         name='admin-release-environment-list'),
    path('admin/release-environments/<int:pk>/',
         AdminReleaseEnvironmentDetail.as_view(),
         name='admin-release-environment-detail'),
    path('admin/release-types/list/',
         AdminReleaseTypeList.as_view(),
         name='admin-release-type-list'),
    path('admin/release-types/<int:pk>/',
         AdminReleaseTypeDetail.as_view(),
         name='admin-release-type-detail'),
    path(
        'admin/release-stage/list/',
        AdminStageList.as_view(),
        name='admin-release-stage-list'),
    path(
        'admin/release-stage/<int:pk>/',
        AdminStageDetail.as_view(),
        name='admin-release-stage-detail'),
    path('admin/release-config/list/',
         AdminReleaseConfigList.as_view(),
         name='admin-release-config-list'),
    path('admin/release-config/<int:pk>/',
         AdminReleaseConfigDetail.as_view(),
         name='admin-release-config-detail'),
    path('admin/release-comment/list/',
         AdminReleaseCommentList.as_view(),
         name='admin-release-comment-list'),
    path('admin/release-comment/<int:pk>/',
         AdminReleaseCommentDetail.as_view(),
         name='admin-release-comment-detail'),
    path('admin/release-stage-connections/list/',
         AdminReleaseCommentList.as_view(),
         name='admin-release-stage-connections-list'),
    path('admin/release-stage-connections/<int:pk>/',
         AdminReleaseCommentDetail.as_view(),
         name='admin-release-stage-connections-detail'),
    # Release Types
    path(
        'release-types/',
        ReleaseTypesByTenantId.as_view(),
        name='release-type-list'),
    path(
        'release-types/create/',
        ReleaseTypeCreateView.as_view(),
        name='release-type-create'),
    path(
        'release-types/<int:pk>/',
        ReleaseTypeRetrieve.as_view(),
        name='release-type-detail'),
    path('release-types/update/<int:pk>/',
         ReleaseTypeUpdateView.as_view(),
         name='release-type-update'),
    path(
        'release-types/delete/<int:pk>/',
        ReleaseTypeDeleteAPIView.as_view(),
        name='release-types-delete'),
    # Release Envs
    path('release-environments/',
         ReleaseEnvironmentByTenantId.as_view(),
         name='release-environment-list'),
    path('release-environments/create/', \
         ReleaseEnvCreateView.as_view(),
         name='release-environment-create'),
    path('release-environments/<int:pk>/', \
         ReleaseEnvRetrieve.as_view(),
         name='release-environment-detail'),
    path('release-environments/update/<int:pk>/',
         ReleaseEnvUpdateView.as_view(),
         name='release-environment-update'),
    path(
        'release-environments/delete/<int:pk>/',
        ReleaseEnvDeleteAPIView.as_view(),
        name='release-environments-delete'),
    # Releases
    path('create/', ReleaseCreate.as_view(), name='release-create'),
    path(
        'release/<str:identifier>/',
        ReleaseRetrieve.as_view(),
        name='release-detail'),
    path('release/', ReleaseTenantList.as_view(), name='release-list'),
    path(
        'calendar-release/',
        ReleaseTenantCalendarList.as_view(),
        name='release-calendar'),
    path(
        'update/<int:id>/',
        ReleaseUpdateView.as_view(),
        name='release-update'),
    path(
        'delete/<int:pk>/',
        ReleaseDeleteAPIView.as_view(),
        name='release-delete'),
    path('search/', ReleaseSearchView.as_view(), name='release-search'),
    # Stages
    path(
        'release-stages/',
        ReleaseStageByTenantId.as_view(),
        name='release-stage-list'),
    path('release-stages/create/',
         ReleaseStageCreateView.as_view(),
         name='release-stage-create'),
    path('release-stages/<int:pk>/',
         ReleaseStageRetrieve.as_view(),
         name='release-stage-detail'),
    path('release-stages/update/<int:pk>/',
         ReleaseStageUpdateView.as_view(),
         name='release-stage-update'),
    path(
        'release-stages/delete/<int:pk>/',
        ReleaseStageDeleteAPIView.as_view(),
        name='release-stage-delete'),
    # Stage Connections
    path('release-stage-connections/',
         ReleaseStageConnectionsByTenantId.as_view(),
         name='release-stage-connection-list'),
    path('release-stage-connections/update/<int:pk>/',
         ReleaseStageConnectionUpdateView.as_view(),
         name='release-stage-connection-update'),
    path('release-stage-connections/get-to-stages/<int:release_stage_id>/',
         ReleaseStageConnectionsView.as_view(),
         name='release-stage-connection-get-to-stages'),
    path(
        'release-stage-connections/delete/<int:pk>/',
        ReleaseConnectionDeleteAPIView.as_view(),
        name='release-stage-connection-delete'),
    path('release-stage-connections/create/',
         ReleaseConnectionCreate.as_view(),
         name='release-stage-connection-create'),
    # Release Config
    path('release-config/',
         ReleaseConfigByTenantId.as_view(), name='release-config-list'),
    # Release Stats
    path('release-stats/me/',
         ReleaseStatViewForUser.as_view(), name='release-stats'),
    # Release Comments
    path('release-comments/create/',
         ReleaseCommentCreate.as_view(), name='release-comment-create'),
    path('release-comments/<str:pk>/',
         ReleaseCommentRetrieve.as_view(), name='release-comment-detail'),
    path(
        'release-comments/delete/<int:pk>/',
        CommentDeleteAPIView.as_view(),
        name='release-comments-delete'),
]

urlpatterns = format_suffix_patterns(urlpatterns)
