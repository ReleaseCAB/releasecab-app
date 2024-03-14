import os

from django.core.mail import send_mail
from django.dispatch import receiver
from django.conf import settings

from django_rest_passwordreset.signals import reset_password_token_created


@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    """
    Handles password reset tokens
    When a token is created, an e-mail needs to be sent to the user
    :param sender: View Class that sent the signal
    :param instance: View Instance that sent the signal
    :param reset_password_token: Token Model Object
    :param args:
    :param kwargs:
    :return:
    """
    context = {
        'current_user': reset_password_token.user,
        'email': reset_password_token.user.email,
        'redirect_url': os.environ.get("UI_BASE_URL", default="") + "/forgot-password?token=" + reset_password_token.key
    }

    email_subject = "Password Reset for Release CAB"
    email_body = f"Hello {context['current_user']},\n\n" \
                f"We received a request to reset the password for your account.\n" \
                f"To reset your password, please click on the link below:\n\n" \
                f"{context['redirect_url']}\n\n" \
                f"If you didn't request this, you can ignore this email.\n\n" \
                f"Thank you,\nThe Release CAB Team"

    send_mail(
        email_subject,
        email_body,
        settings.FROM_EMAIL,
        [reset_password_token.user.email],
    )