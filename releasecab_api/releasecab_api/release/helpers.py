from django.shortcuts import get_object_or_404

from releasecab_api.user.models import Role, Team


class ReleaseHelpers:
    '''
    Helpers for release related things
    '''
    @staticmethod
    def is_user_in_role_connection(user, approver_roles):
        if not approver_roles:
            return True  # Any role is good to go
        for approver_role_info in approver_roles:
            if isinstance(approver_role_info, dict):
                approver_role_id = approver_role_info.get('id')
                if approver_role_id:
                    role = get_object_or_404(Role, id=approver_role_id)
                    if user.role.filter(id=role.id).exists():
                        return True  # User is in this role
            elif isinstance(approver_role_info, int):
                role = get_object_or_404(Role, id=approver_role_info)
                if user.role.filter(id=role.id).exists():
                    return True  # User is in this role
        return False

    @staticmethod
    def is_user_in_team_connection(user, approver_teams):
        if not approver_teams:
            return True  # Any team is good to go
        for approver_team_info in approver_teams:
            if isinstance(approver_team_info, dict):
                approver_team_id = approver_team_info.get('id')
                if approver_team_id:
                    team = get_object_or_404(Team, id=approver_team_id)
                    if user in team.members.all() or \
                            user in team.managers.all():
                        return True  # User is in this team
            elif isinstance(approver_team_info, int):
                team = get_object_or_404(Team, id=approver_team_info)
                if user in team.members.all() or user in team.managers.all():
                    return True  # User is in this team
        return False
