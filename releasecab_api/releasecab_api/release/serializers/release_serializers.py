import random
import string

from rest_framework import serializers

from releasecab_api.blackout.models import Blackout

from ..helpers import ReleaseHelpers
from ..models import (Release, ReleaseConfig, ReleaseStage,
                      ReleaseStageConnection, ReleaseStageConnectionApprover,
                      ReleaseType)


class ReleaseSerializer(serializers.ModelSerializer):
    current_stage = serializers.SerializerMethodField()
    current_stage_id = serializers.SerializerMethodField()
    release_type = serializers.SerializerMethodField()
    release_environment = serializers.SerializerMethodField()
    affected_teams = serializers.SerializerMethodField()
    owner_name = serializers.SerializerMethodField()
    next_stage_name = serializers.SerializerMethodField()
    is_release_deletable = serializers.SerializerMethodField()

    class Meta:
        model = Release
        fields = '__all__'
        read_only_fields = [
            'pk',
            'created_at',
            'owner',
            'identifier',
            'tenant',
            'pending_approval',
            'next_stage']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(ReleaseSerializer, self).__init__(*args, **kwargs)

    def update(self, instance, validated_data):
        affected_teams_data = self.context['request'].data.get(
            'affected_teams', None)
        release_environment_data = self.context['request'].data.get(
            'release_environment', None)
        release_type_data = self.context['request'].data.get(
            'release_type', None)
        current_stage_data = self.context['request'].data.get(
            'current_stage', None)
        if release_type_data is not None:
            validated_data['release_type'] = ReleaseType.objects.get(
                pk=release_type_data, tenant=instance.tenant)
        instance = super().update(instance, validated_data)
        if affected_teams_data is not None:
            instance.affected_teams.set(affected_teams_data)
        if release_environment_data is not None:
            instance.release_environment.set(release_environment_data)
        if current_stage_data is not None:
            self.validate_current_stage_change(current_stage_data)
        return instance

    def get_current_stage(self, obj):
        return str(obj.current_stage)

    def get_current_stage_id(self, obj):
        if obj.current_stage:
            return obj.current_stage.id
        return None

    def get_next_stage_name(self, obj):
        if obj.next_stage:
            return obj.next_stage.name
        return ""

    def get_release_type(self, obj):
        if obj.release_type:
            return {
                "value": obj.release_type.id,
                "label": str(
                    obj.release_type)}
        else:
            return {"value": "", 'label': ""}

    def get_release_environment(self, obj):
        return [{'value': release_environment.id, 'label': str(
            release_environment)} for release_environment in
            obj.release_environment.all()]

    def get_affected_teams(self, obj):
        return [{'value': affected_teams.id, 'label': str(
            affected_teams)} for affected_teams in obj.affected_teams.all()]

    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.first_name + " " + obj.owner.last_name
        return None

    def get_is_release_deletable(self, obj):
        if obj.current_stage:
            return obj.current_stage.allow_release_delete
        return False

    def validate_current_stage_change(self, value):
        user = self.context['request'].user
        instance = self.instance
        current_stage_before_save = getattr(instance, 'current_stage',
                                            None)
        current_stage_to_save = value
        connection = ReleaseStageConnection.objects.get(
            from_stage=current_stage_before_save,
            to_stage=current_stage_to_save,
            tenant=user.tenant)
        stage = ReleaseStage.objects.get(pk=current_stage_to_save,
                                         tenant=user.tenant)
        if not connection.approvers.values():
            # No approver so they can progress
            instance.current_stage = stage
            instance.pending_approval = False
            instance.next_stage = None
            instance.save()
            return current_stage_to_save
        else:
            for approver in connection.approvers.values():
                connection_approver = \
                    ReleaseStageConnectionApprover.objects.get(
                        pk=approver['id'])
                approver_roles = \
                    connection_approver.approver_role.values()
                approver_teams = \
                    connection_approver.approver_team.values()
                role_approver_found = \
                    ReleaseHelpers.is_user_in_role_connection(
                        user, approver_roles)
                team_approver_found = \
                    ReleaseHelpers.is_user_in_team_connection(
                        user, approver_teams)
                owner_only_approver = connection.owner_only
                owner_included = connection.owner_included
                if team_approver_found and role_approver_found:
                    # No approver so they can progress
                    instance.pending_approval = False
                    instance.next_stage = None
                    instance.current_stage = stage
                    instance.save()
                    return current_stage_to_save
                elif owner_only_approver or owner_included:
                    if Release.objects.filter(
                            id=instance.id,
                            owner=user,
                            tenant=user.tenant).exists():
                        instance.pending_approval = False
                        instance.next_stage = None
                        instance.current_stage = stage
                        instance.save()
                        return current_stage_to_save
            instance.pending_approval = True
            instance.next_stage = stage
            instance.save()
            return current_stage_before_save

    # TODO: Handle identifier logic to be random or counted up
    def generate_unique_identifier(self):
        identifier = f"REL{''.join(random.choices(string.digits, k=5))}"
        while Release.objects.filter(identifier=identifier).exists():
            identifier = f"REL{''.join(random.choices(string.digits, k=5))}"
        return identifier

    def create(self, validated_data):
        tenant = self.context['request'].user.tenant
        owner = self.context['request'].user
        validated_data['tenant'] = tenant
        validated_data['owner'] = owner
        release_environments_data = self.context['request'].data.get(
            'release_environment', None)
        affected_teams_data = self.context['request'].data.get(
            'affected_teams', None)
        release_type_data = self.context['request'].data.get(
            'release_type', None)
        if release_type_data is not None:
            validated_data['release_type'] = ReleaseType.objects.get(
                pk=release_type_data, tenant=tenant)
        unique_identifier = self.generate_unique_identifier()
        release = Release.objects.create(
            **validated_data,
            current_stage=ReleaseConfig.objects.get(
                tenant=tenant).initial_stage,
            identifier=unique_identifier)
        for release_environment_data in release_environments_data:
            release.release_environment.add(release_environment_data)
        for affected_team_data in affected_teams_data:
            release.affected_teams.add(affected_team_data)
        return release

    def validate(self, data):
        if 'start_date' in data and 'end_date' in data:
            start_date = data['start_date']
            end_date = data['end_date']
            if start_date and end_date:
                if start_date >= end_date:
                    raise serializers.ValidationError(
                        "End date must be after the start date.")
                tenant = self.context['request'].user.tenant
                overlapping_blackouts = Blackout.objects.filter(
                    tenant=tenant,
                    start_date__lte=end_date,
                    end_date__gte=start_date,
                    release_environment__in=self.context['request'].data.get(
                        'release_environment')
                )
                if overlapping_blackouts.exists():
                    blackout_names = ", ".join(
                        [blackout.name for blackout in overlapping_blackouts]
                    )
                    raise serializers.ValidationError(
                        f"The provided dates fall within blackout period(s): \
                            {blackout_names}"
                    )
        return data
