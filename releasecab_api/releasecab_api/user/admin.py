from django import forms
from django.contrib import admin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from releasecab_api.tenant.models import Tenant
from releasecab_api.user.models import Role, Team, User


class CustomUserCreationForm(UserCreationForm):
    tenant = forms.ModelChoiceField(queryset=Tenant.objects.all())

    class Meta(UserCreationForm.Meta):
        model = User
        exclude = ('username',)


class CustomUserChangeForm(UserChangeForm):
    tenant = forms.ModelChoiceField(queryset=Tenant.objects.all())

    class Meta(UserChangeForm.Meta):
        model = User
        exclude = ('username',)


class UserAdmin(admin.ModelAdmin):
    model = User
    form = CustomUserChangeForm
    add_form = CustomUserCreationForm
    list_display = ('email', 'tenant', 'is_active', 'last_login')
    list_filter = ('is_active', 'tenant')
    search_fields = ('email', 'tenant__name')

    def tenant(self, obj):
        return obj.tenant.name if obj.tenant else ''


class RoleAdmin(admin.ModelAdmin):
    model = Role
    list_display = ('name', 'description')
    search_fields = ('name', 'description')


class TeamAdmin(admin.ModelAdmin):
    model = Team
    list_display = ('name', 'can_create_blackouts', 'can_create_releases')
    list_filter = ('can_create_blackouts', 'can_create_releases')
    search_fields = ('name',)


admin.site.register(User, UserAdmin)
admin.site.register(Role, RoleAdmin)
admin.site.register(Team, TeamAdmin)
