from django.contrib.auth import password_validation
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from releasecab_api.tenant.models import InvitedUser, Tenant

from ..models import User
from .team_serializers import TeamSerializer


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.SerializerMethodField()
    tenant = serializers.SerializerMethodField()
    teams = serializers.SerializerMethodField()
    is_manager = serializers.SerializerMethodField()
    teams_managed = serializers.SerializerMethodField()
    can_create_blackouts = serializers.SerializerMethodField()
    can_create_releases = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'tenant',
            'role',
            'last_onboarding_step',
            'is_onboarding_complete',
            'is_tenant_owner',
            'password',
            'is_active',
            'is_manager',
            'teams_managed',
            'can_create_blackouts',
            'can_create_releases',
            'teams',
            'tenant']
        read_only_fields = [
            'pk', 'created_at']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super().__init__(*args, **kwargs)

    def validate_password(self, value):
        user = self.context['request'].user if 'request' in self.context \
            else None
        password_validation.validate_password(value, user=user)
        return value

    def create(self, validated_data):
        print(self.context['request'].data.get(
            'tenant', None))
        email = validated_data.get('email')
        if email:
            if InvitedUser.objects.filter(email=email).exists():
                validated_data['is_active'] = True
            else:
                validated_data['is_active'] = False
            tenant = self.context['request'].data.get(
                'tenant', None)
            validated_data['tenant'] = Tenant.objects.get(pk=tenant)
            user_count = User.objects.filter(tenant=tenant).count()
            if user_count == 0:
                validated_data['is_active'] = True
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        if 'request' in self.context:
            role_data = self.context['request'].data.get('role', None)
        else:
            role_data = None
        if role_data is not None:
            instance.role.set(role_data)
        instance = super().update(instance, validated_data)
        if role_data is not None:
            instance.role.clear()
            for role in role_data:
                instance.role.add(role)
        return instance

    def get_tenant(self, obj):
        return obj.tenant.name if obj.tenant else None

    def get_teams(self, obj):
        teams = obj.teams_as_member.all()
        return TeamSerializer(teams, many=True).data

    def get_is_manager(self, obj):
        return obj.teams_as_manager.exists()

    def get_teams_managed(self, obj):
        teams_managed = obj.teams_as_manager.values_list('id', flat=True)
        return list(teams_managed)

    def get_can_create_blackouts(self, obj):
        return obj.teams_as_member.filter(can_create_blackouts=True).exists() \
            or obj.is_tenant_owner

    def get_can_create_releases(self, obj):
        return obj.teams_as_member.filter(can_create_releases=True).exists() \
            or obj.is_tenant_owner

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['tenant'] = self.get_tenant(instance)
        representation['is_manager'] = self.get_is_manager(instance)
        representation['teams_managed'] = self.get_teams_managed(instance)
        representation['can_create_blackouts'] = self.get_can_create_blackouts(
            instance)
        return representation

    def get_role(self, obj):
        return [{'value': role.id, 'label': str(
            role)} for role in obj.role.all()]


class UserValidationSerializer(serializers.Serializer):
    email = serializers.EmailField()
