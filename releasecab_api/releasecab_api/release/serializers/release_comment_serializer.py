from rest_framework import serializers

from ..models import ReleaseComment


class ReleaseCommentSerializer(serializers.ModelSerializer):
    writer_name = serializers.SerializerMethodField()

    class Meta:
        model = ReleaseComment
        fields = '__all__'
        read_only_fields = [
            'pk', 'writer', 'tenant', 'created_at']

    def get_writer_name(self, instance):
        if instance.writer:
            return f"{instance.writer.first_name} {instance.writer.last_name}"
        return None
