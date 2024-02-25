from django.conf import settings
from django.core.mail import send_mail

from .models import Communication


class CommunicationHelpers:
    '''
    Helpers to create communications and send emails
    '''
    DEBUG = settings.DEBUG
    FROM_EMAIL = settings.FROM_EMAIL

    @classmethod
    def create_new_message(cls, user, title, body, send_email):
        new_communication = Communication(
            to_user=user,
            tenant=user.tenant,
            message_title=title,
            message_body=body)
        new_communication.save()
        if send_email:
            cls._send_email(user.email, title, body)

    @classmethod
    def _send_email(cls, to_email, title, body):
        if not cls.DEBUG:
            send_mail(
                title,
                body,
                cls.FROM_EMAIL,
                [to_email, ],
            )
