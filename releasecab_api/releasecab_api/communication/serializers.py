from rest_framework import serializers

from .models import Communication


class CommunicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Communication
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']
