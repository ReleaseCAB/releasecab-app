from rest_framework import serializers

from ..models import ReleaseType


class ReleaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReleaseType
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if not instance.is_active:
            representation['name'] += " (inactive)"
        return representation

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(ReleaseTypeSerializer, self).__init__(*args, **kwargs)
