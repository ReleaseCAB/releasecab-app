from rest_framework import serializers

from ..models import ReleaseType


class ReleaseTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReleaseType
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(ReleaseTypeSerializer, self).__init__(*args, **kwargs)
