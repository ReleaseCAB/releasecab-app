import random
import string

from rest_framework import serializers

from ..helpers import TenantHelpers
from ..models import Tenant


class TenantSerializer(serializers.ModelSerializer):
    invite_code = serializers.CharField(required=False)

    class Meta:
        model = Tenant
        fields = '__all__'
        read_only_fields = [
            'pk', 'created_at']

    def create(self, validated_data):
        invite_code = ''.join(random.choices(
            string.ascii_letters + string.digits, k=10))

        while Tenant.objects.filter(invite_code=invite_code).exists():
            invite_code = ''.join(random.choices(
                string.ascii_letters + string.digits, k=10))

        tenant = Tenant.objects.create(
            **validated_data, invite_code=invite_code)

        TenantHelpers.set_default_data(tenant=tenant)

        return tenant
