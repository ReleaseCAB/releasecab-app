from releasecab_api.release.models import (ReleaseConfig, ReleaseEnvironment,
                                           ReleaseStage,
                                           ReleaseStageConnection, ReleaseType)
from releasecab_api.user.models import Role, Team


class TenantHelpers():
    '''
    Tenant helpers
    '''
    @staticmethod
    def set_default_data(tenant):
        '''
        Set the default data for a new tenant
        '''
        Role.objects.create(
            name='Technical Manager',
            description='Typically can approve most stages of the release',
            tenant=tenant
        )
        Role.objects.create(
            name='Developers',
            description='Typically can create new releases',
            tenant=tenant
        )
        Role.objects.create(
            name='Testers',
            description='Typically can approve certain stages of the release',
            tenant=tenant
        )
        Team.objects.create(
            name='Frontend',
            tenant=tenant
        )
        Team.objects.create(
            name='Backend',
            tenant=tenant
        )
        Team.objects.create(
            name='Leadership',
            tenant=tenant
        )
        ReleaseType.objects.create(
            name='Feature',
            description='The release is for a new feature',
            tenant=tenant
        )
        ReleaseType.objects.create(
            name='Hotfix',
            description='The release is for a hotfix',
            tenant=tenant
        )
        ReleaseType.objects.create(
            name='Patch',
            description='The release is for patching',
            tenant=tenant
        )
        ReleaseEnvironment.objects.create(
            name='Production',
            description='Production environment',
            tenant=tenant
        )
        ReleaseEnvironment.objects.create(
            name='Staging',
            description='Staging environment',
            tenant=tenant
        )
        planning_stage = ReleaseStage.objects.create(
            name='Planning in Progress',
            description='Planning in Progress',
            allow_release_delete=True,
            tenant=tenant
        )
        in_progress_stage = ReleaseStage.objects.create(
            name='In Progress',
            description='In Progress',
            allow_release_delete=False,
            tenant=tenant
        )
        ready_to_deploy_stage = ReleaseStage.objects.create(
            name='Ready To Deploy',
            description='Ready To Deploy',
            allow_release_delete=True,
            tenant=tenant
        )
        completed_stage = ReleaseStage.objects.create(
            name='Completed',
            description='Completed',
            tenant=tenant,
            is_end_stage=True,
            allow_release_delete=False
        )
        cancelled_stage = ReleaseStage.objects.create(
            name='Cancelled',
            description='Cancelled',
            tenant=tenant,
            is_end_stage=True,
            allow_release_delete=False
        )
        ReleaseStageConnection.objects.create(
            from_stage=in_progress_stage,
            to_stage=completed_stage,
            tenant=tenant,
        )
        ReleaseStageConnection.objects.create(
            from_stage=planning_stage,
            to_stage=cancelled_stage,
            tenant=tenant,
        )
        ReleaseStageConnection.objects.create(
            from_stage=planning_stage,
            to_stage=ready_to_deploy_stage,
            tenant=tenant,
        )
        ReleaseStageConnection.objects.create(
            from_stage=ready_to_deploy_stage,
            to_stage=in_progress_stage,
            tenant=tenant,
        )
        ReleaseStageConnection.objects.create(
            from_stage=ready_to_deploy_stage,
            to_stage=cancelled_stage,
            tenant=tenant,
        )
        ReleaseConfig.objects.create(
            initial_stage=planning_stage,
            tenant=tenant
        )
