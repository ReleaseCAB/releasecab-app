from django.contrib import admin

from releasecab_api.blackout.models import Blackout


class BlackoutAdmin(admin.ModelAdmin):
    model = Blackout
    list_display = ('name', 'start_date', 'end_date', 'owner', 'created_at')
    search_fields = ('name', 'owner__username')
    list_filter = ('owner', 'created_at')
    readonly_fields = ('created_at',)


admin.site.register(Blackout, BlackoutAdmin)
