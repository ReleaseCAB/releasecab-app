from rest_framework import serializers

from ..models import ReleaseStage


class ReleaseStageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReleaseStage
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(ReleaseStageSerializer, self).__init__(*args, **kwargs)
