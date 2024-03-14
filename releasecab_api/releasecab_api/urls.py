from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import (TokenBlacklistView,
                                            TokenObtainPairView,
                                            TokenRefreshView, TokenVerifyView)

from .api_root import APIRootView

urlpatterns = [
    # Admin Site
    path('admin/', admin.site.urls),

    # APIs
    path('api/', APIRootView.as_view(), name='api-root'),

    # JWT Token Endpoints
    path(
        'api/token-create/',
        TokenObtainPairView.as_view(),
        name='token_obtain_pair'),
    path(
        'api/token-blacklist/',
        TokenBlacklistView.as_view(),
        name='token_blacklist'),
    path(
        'api/token-refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'),
    path('api/token-verify/',
         TokenVerifyView.as_view(), name='token_verify'),
    path('api/password_reset/', include('django_rest_passwordreset.urls',
                                        namespace='password_reset')),

    # App Endpoints
    path('api/users/', include('releasecab_api.user.urls'), name='api-users'),
    path(
        'api/tenants/',
        include('releasecab_api.tenant.urls'),
        name='api-tenants'),
    path('api/releases/', include('releasecab_api.release.urls'),
         name='api-releases'),
    path('api/blackouts/', include('releasecab_api.blackout.urls'),
         name='api-blackouts'),
    path('api/communications/', include('releasecab_api.communication.urls'),
         name='api-communications')
]
