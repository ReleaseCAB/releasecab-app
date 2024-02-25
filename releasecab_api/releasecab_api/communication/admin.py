from django.contrib import admin

from .models import Communication


class CommunicationAdmin(admin.ModelAdmin):
    model = Communication
    list_display = ('to_user', 'message_title', 'created_at')

    list_filter = ('to_user',)
    search_fields = ('to_user__username', 'message_title', 'message_body')


admin.site.register(Communication, CommunicationAdmin)
