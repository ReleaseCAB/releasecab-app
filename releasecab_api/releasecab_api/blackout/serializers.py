from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers

from .models import Blackout


class BlackoutSerializer(serializers.ModelSerializer):
    owner_name = serializers.SerializerMethodField()
    active_status = serializers.SerializerMethodField()
    release_environment = serializers.SerializerMethodField()

    class Meta:
        model = Blackout
        fields = '__all__'
        read_only_fields = [
            'pk', 'owner', 'tenant', 'created_at']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super().__init__(*args, **kwargs)

    def update(self, instance, validated_data):
        release_environments_data = self.context['request'].data.get(
            'release_environment', None)
        if release_environments_data is not None:
            instance.release_environment.set(release_environments_data)
        instance = super().update(instance, validated_data)
        if release_environments_data is not None:
            instance.release_environment.clear()
            for release_environment in release_environments_data:
                instance.release_environment.add(release_environment)
        return instance

    def create(self, validated_data):
        blackout = Blackout.objects.create(
            **validated_data)
        release_environments_data = self.context['request'].data.get(
            'release_environment', None)
        if release_environments_data is not None:
            for release_environment in release_environments_data:
                blackout.release_environment.add(release_environment)
        return blackout

    def validate(self, data):
        print(self.instance)
        data.pop('tenant', None)
        current_date = timezone.now()
        start_date = data['start_date']
        end_date = data['end_date']
        if start_date and end_date:
            if start_date >= end_date:
                raise serializers.ValidationError(
                    "End date must be after the start date.")
            if start_date < current_date or end_date < current_date:
                raise serializers.ValidationError(
                    "Dates cannot be in the past.")
        if self.instance is None:
            existing_blackouts = Blackout.objects.filter(
                Q(start_date__lt=end_date, end_date__gt=start_date) |
                Q(start_date__gte=start_date, start_date__lt=end_date) |
                Q(end_date__gte=start_date, end_date__lt=end_date),
                tenant=self.context['request'].user.tenant,
                release_environment__in=self.context['request'].data.get(
                    'release_environment', [])
            )
        else:
            existing_blackouts = Blackout.objects.filter(
                Q(start_date__lt=end_date, end_date__gt=start_date) |
                Q(start_date__gte=start_date, start_date__lt=end_date) |
                Q(end_date__gte=start_date, end_date__lt=end_date),
                tenant=self.context['request'].user.tenant,
                release_environment__in=self.context['request'].data.get(
                    'release_environment', [])
            ).exclude(pk=self.instance.pk)
        if existing_blackouts.exists():
            raise serializers.ValidationError(
                "This blackout overlaps with an existing one.")
        return data

    def get_owner_name(self, obj):
        if obj.owner:
            return obj.owner.first_name + " " + obj.owner.last_name
        return None

    def get_active_status(self, obj):
        now = timezone.now()
        start_date, end_date = obj.start_date, obj.end_date
        if start_date and end_date:
            if now < start_date:
                return 'future'
            elif start_date <= now <= end_date:
                return 'active'
            else:
                return 'expired'
        return ''

    def get_release_environment(self, obj):
        return [{'value': env.pk, 'label': str(env)}
                for env in obj.release_environment.all()]
