from django.db import models

from releasecab_api.base_model import BaseReleaseCabModel


class Communication(BaseReleaseCabModel):
    to_user = models.ForeignKey('user.User', on_delete=models.PROTECT)
    message_title = models.TextField(
        help_text="Title of the message", blank=False)
    message_body = models.TextField(
        help_text="Body of the message", blank=False)

    def __str__(self):
        return self.to_user.__str__() + " " + self.message_title
