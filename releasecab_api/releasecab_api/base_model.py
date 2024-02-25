from django.db import models

from releasecab_api.tenant.models import Tenant


class BaseReleaseCabModel(models.Model):
    # Base model for all others to inherit from
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        abstract = True
