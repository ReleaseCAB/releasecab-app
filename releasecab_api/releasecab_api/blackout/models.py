from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from releasecab_api.base_model import BaseReleaseCabModel
from releasecab_api.release.models import ReleaseEnvironment


class Blackout(BaseReleaseCabModel):
    name = models.CharField(max_length=50,
                            help_text="The name of the blackout.")
    description = models.TextField(
        help_text="A description of the blackout.")
    start_date = models.DateTimeField(
        help_text="The start date and time of the blackout.")
    end_date = models.DateTimeField(
        help_text="The end date and time of the blackout.")
    release_environment = models.ManyToManyField(
        ReleaseEnvironment,
        help_text="The release environments affected by the blackout.")
    owner = models.ForeignKey(
        'user.User',
        on_delete=models.PROTECT,
        help_text="The owner of the blackout.")

    def clean(self):
        """
        Validate that the start date is before the end date.
        """
        if self.start_date and self.end_date \
                and self.start_date >= self.end_date:
            raise ValidationError(
                _('End date should be after the start date.'))

    def __str__(self):
        return f"{self.name} ({self.start_date} - {self.end_date})"
