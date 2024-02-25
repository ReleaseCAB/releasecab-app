from django.db import models


class Tenant(models.Model):
    name = models.CharField(max_length=100)
    number_of_employees = models.IntegerField()
    invite_code = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class InvitedUser(models.Model):
    email = models.CharField(max_length=100)
    tenant = models.ForeignKey(
        Tenant, on_delete=models.CASCADE, db_index=True)

    def __str__(self):
        return self.email
