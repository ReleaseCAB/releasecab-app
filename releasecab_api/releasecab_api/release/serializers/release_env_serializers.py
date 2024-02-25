from rest_framework import serializers

from ..models import ReleaseEnvironment


class ReleaseEnvironmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReleaseEnvironment
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(ReleaseEnvironmentSerializer,
              self).__init__(*args, **kwargs)
