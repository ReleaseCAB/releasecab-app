from django.db import models
from django.utils import timezone

from releasecab_api.base_model import BaseReleaseCabModel
from releasecab_api.user.models import Role, Team


class Release(BaseReleaseCabModel):
    name = models.CharField(max_length=500)
    identifier = models.CharField(max_length=500)
    release_type = models.ForeignKey('ReleaseType', on_delete=models.PROTECT)
    release_environment = models.ManyToManyField(
        'ReleaseEnvironment', blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    description = models.TextField(blank=True, null=True)
    start_date = models.DateTimeField(default=None)
    end_date = models.DateTimeField(default=None)
    ticket_link = models.CharField(max_length=500, blank=True, null=True)
    affected_teams = models.ManyToManyField(Team, blank=True)
    current_stage = models.ForeignKey(
        'ReleaseStage',
        on_delete=models.PROTECT,
        related_name="releases")
    owner = models.ForeignKey('user.User', on_delete=models.PROTECT)
    pending_approval = models.BooleanField(default=False)
    next_stage = models.ForeignKey(
        'ReleaseStage',
        on_delete=models.PROTECT,
        related_name="next_stages",
        null=True)

    def __str__(self):
        return self.name


class ReleaseComment(BaseReleaseCabModel):
    comment_body = models.TextField()
    writer = models.ForeignKey('user.User', on_delete=models.PROTECT)
    release = models.ForeignKey(Release, on_delete=models.CASCADE)

    def __str__(self):
        return f"Comment by {self.writer} on {self.release}"


class ReleaseType(BaseReleaseCabModel):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return self.name


class ReleaseEnvironment(BaseReleaseCabModel):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=1000, blank=True, null=True)

    def __str__(self):
        return self.name


class ReleaseStage(BaseReleaseCabModel):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=1000, blank=True, null=True)
    is_end_stage = models.BooleanField(default=False)
    allow_release_delete = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class ReleaseStageConnection(BaseReleaseCabModel):
    from_stage = models.ForeignKey(
        ReleaseStage,
        related_name='connections_from',
        on_delete=models.CASCADE)
    to_stage = models.ForeignKey(
        ReleaseStage,
        related_name='connections_to',
        on_delete=models.CASCADE)
    approvers = models.ManyToManyField(
        'ReleaseStageConnectionApprover',
        blank=True)
    owner_only = models.BooleanField(default=False)
    owner_included = models.BooleanField(default=False)

    def __str__(self):
        return f"Connection from {self.from_stage} to {self.to_stage}"


class ReleaseStageConnectionApprover(BaseReleaseCabModel):
    approver_role = models.ManyToManyField(Role, blank=True)
    approver_team = models.ManyToManyField(Team, blank=True)

    def __str__(self):
        return f"Approver Role: {self.approver_role}, \
            Team: {self.approver_team}"


class ReleaseConfig(BaseReleaseCabModel):
    initial_stage = models.ForeignKey(
        ReleaseStage,
        on_delete=models.CASCADE)

    def __str__(self):
        return f"Initial Stage: {self.initial_stage}"
