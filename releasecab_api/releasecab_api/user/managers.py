from django.contrib.auth.models import BaseUserManager
from django.utils import timezone

from releasecab_api.tenant.models import Tenant


class CustomUserManager(BaseUserManager):
    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError('The email must be set')
        email = self.normalize_email(email)
        extra_fields.setdefault('is_superuser', False)
        extra_fields.setdefault('is_staff', False)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    # A tenant needs to be created first, since all users need a tenant
    # TODO: Just create a 'superuser' tenant
    def create_superuser(
            self,
            email=None,
            password=None,
            **extra_fields):
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('tenant', Tenant.objects.first())
        extra_fields.setdefault('date_joined', timezone.now())

        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(email, password, **extra_fields)
