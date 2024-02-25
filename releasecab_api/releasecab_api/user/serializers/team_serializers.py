from rest_framework import serializers

from ..models import Team


class TeamSerializer(serializers.ModelSerializer):
    members = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = [
            'pk', 'tenant', 'created_at']

    def __init__(self, *args, **kwargs):
        kwargs['partial'] = True
        super(TeamSerializer, self).__init__(*args, **kwargs)

    def update(self, instance, validated_data):
        members_data = self.context['request'].data.get('members', None)
        if members_data is not None:
            instance.members.set(members_data)
        return super().update(instance, validated_data)

    def get_members(self, instance):
        return [
            {
                'label': f'{member.first_name} {member.last_name}',
                'value': member.id
            } for member in instance.members.all()
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['managers'] = [
            {
                'label': f'{manager.first_name} {manager.last_name}',
                'value': manager.id} for manager in instance.managers.all()]
        return representation


class AddUserToTeamsSerializer(serializers.Serializer):
    team_ids = serializers.ListField(child=serializers.IntegerField())
    user_id = serializers.IntegerField()
