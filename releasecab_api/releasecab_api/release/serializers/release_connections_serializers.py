from rest_framework import serializers

from ..models import ReleaseStageConnection


class ReleaseStageConnectionSerializer(serializers.ModelSerializer):
    approvers = serializers.SerializerMethodField()

    class Meta:
        model = ReleaseStageConnection
        fields = '__all__'
        read_only_fields = [
            'pk',
            'created_at',
            'tenant']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(ReleaseStageConnectionSerializer,
              self).__init__(*args, **kwargs)

    def update(self, instance, validated_data):
        if 'approvers' in validated_data:
            approvers_data = validated_data.pop('approvers')
            if not approvers_data:
                instance.approvers.clear()
            else:
                instance.approvers.set(approvers_data)
        return super().update(instance, validated_data)

    def get_approvers(self, obj):
        approvers_data = []
        approvers_queryset = obj.approvers.all()
        for approver in approvers_queryset:
            approver_data = {
                'id': approver.id,
                'teams': [{'value': team.id, 'label': team.name}
                          for team in approver.approver_team.all()],
                'roles': [{'value': role.id, 'label': role.name}
                          for role in approver.approver_role.all()],
            }
            approvers_data.append(approver_data)
        return approvers_data
