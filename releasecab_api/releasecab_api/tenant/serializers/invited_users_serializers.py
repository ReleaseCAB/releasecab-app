
from rest_framework import serializers

from releasecab_api.user.models import User

from ..models import InvitedUser


class InvitedUserSerializer(serializers.ModelSerializer):
    has_joined = serializers.SerializerMethodField()

    class Meta:
        model = InvitedUser
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']

    def get_has_joined(self, obj):
        if 'request' in self.context:
            user = self.context['request'].user
            return User.objects.filter(
                email=obj.email, tenant=user.tenant).exists()
        return False
