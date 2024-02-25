# Generated by Django 5.0.2 on 2024-02-23 03:27

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('blackout', '0001_initial'),
        ('release', '0001_initial'),
        ('tenant', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='blackout',
            name='owner',
            field=models.ForeignKey(
                help_text='The owner of the blackout.',
                on_delete=django.db.models.deletion.PROTECT,
                to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='blackout',
            name='release_environment',
            field=models.ManyToManyField(
                help_text='The release environments affected by the blackout.',
                to='release.releaseenvironment'),
        ),
        migrations.AddField(
            model_name='blackout',
            name='tenant',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to='tenant.tenant'),
        ),
    ]