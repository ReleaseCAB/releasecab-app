from django.contrib import admin

from .models import (Release, ReleaseComment, ReleaseConfig,
                     ReleaseEnvironment, ReleaseStage, ReleaseStageConnection,
                     ReleaseStageConnectionApprover, ReleaseType)


class ReleaseAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'current_stage', 'created_at')
    search_fields = ['name']
    list_filter = ['current_stage']


class ReleaseTypeAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


class ReleaseEnvironmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description')


class ReleaseStageAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_end_stage')


class ReleaseStageConnectionAdmin(admin.ModelAdmin):
    list_display = ('from_stage', 'to_stage')
    filter_horizontal = ('approvers',)


class ReleaseStageConnectionApproverAdmin(admin.ModelAdmin):
    list_display = ('id',)


class ReleaseConfigAdmin(admin.ModelAdmin):
    list_display = ('initial_stage',)


class ReleaseCommentAdmin(admin.ModelAdmin):
    list_display = ('comment_body', 'writer', 'release')


admin.site.register(Release, ReleaseAdmin)
admin.site.register(ReleaseType, ReleaseTypeAdmin)
admin.site.register(ReleaseEnvironment, ReleaseEnvironmentAdmin)
admin.site.register(ReleaseStage, ReleaseStageAdmin)
admin.site.register(ReleaseStageConnection, ReleaseStageConnectionAdmin)
admin.site.register(
    ReleaseStageConnectionApprover,
    ReleaseStageConnectionApproverAdmin)
admin.site.register(ReleaseConfig, ReleaseConfigAdmin)
admin.site.register(ReleaseComment, ReleaseCommentAdmin)
