from rest_framework import serializers

from ..models import Role


class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(RoleSerializer, self).__init__(*args, **kwargs)
