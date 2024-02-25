from rest_framework import serializers

from ..models import ReleaseConfig


class ReleaseConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReleaseConfig
        fields = '__all__'
        read_only_fields = [
            'pk', 'initial_stage', 'tenant', 'created_at']
