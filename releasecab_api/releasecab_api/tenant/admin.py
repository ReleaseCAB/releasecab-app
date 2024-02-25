from django.contrib import admin

from .models import InvitedUser, Tenant


class InvitedUserInline(admin.TabularInline):
    model = InvitedUser
    extra = 1


class TenantAdmin(admin.ModelAdmin):
    list_display = ('name', 'number_of_employees', 'invite_code')
    search_fields = ('name', 'invite_code')
    inlines = [InvitedUserInline]


class InvitedUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'tenant')
    list_filter = ('tenant__name', 'tenant__number_of_employees')
    search_fields = ('email', 'tenant__name')


admin.site.register(Tenant, TenantAdmin)
admin.site.register(InvitedUser, InvitedUserAdmin)
