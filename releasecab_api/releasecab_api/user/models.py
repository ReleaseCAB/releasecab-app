from typing import List

from django.contrib.auth.models import AbstractUser
from django.db import models

from releasecab_api.base_model import BaseReleaseCabModel

from .managers import CustomUserManager


class User(AbstractUser, BaseReleaseCabModel):
    objects = CustomUserManager()
    email = models.EmailField(unique=True)
    username = None  # Use email instead of username
    role = models.ManyToManyField('role', blank=True)
    is_tenant_owner = models.BooleanField(
        default=False,
        help_text='Designates whether this user is owner/administrator of\
              the tenant.')
    last_onboarding_step = models.IntegerField(
        default=0,
        help_text='Designates the last onboarding step the user has completed. \
            100 means completed.')
    is_onboarding_complete = models.BooleanField(
        default=False,
        help_text='Designates whether this user has completed onboarding.')
    is_active = models.BooleanField(
        default=True,
        help_text='Designates whether this user is active and allowed \
            to sign in')
    # TODO: Add profile picture
    # TODO: Add preferred homepage

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS: List = []


class Role(BaseReleaseCabModel):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=5000, blank=True, null=True)

    def __str__(self):
        return self.name


class Team(BaseReleaseCabModel):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(
        User, related_name='teams_as_member', blank=True)
    managers = models.ManyToManyField(
        User, related_name='teams_as_manager', blank=True)
    can_create_blackouts = models.BooleanField(default=False)
    can_create_releases = models.BooleanField(default=True)

    def __str__(self):
        return self.name
