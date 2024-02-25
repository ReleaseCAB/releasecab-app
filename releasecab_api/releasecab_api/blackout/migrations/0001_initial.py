# Generated by Django 5.0.2 on 2024-02-23 03:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Blackout',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('name', models.CharField(help_text='The name of the blackout.', max_length=50)),
                ('description', models.TextField(help_text='A description of the blackout.')),
                ('start_date', models.DateTimeField(help_text='The start date and time of the blackout.')),
                ('end_date', models.DateTimeField(help_text='The end date and time of the blackout.')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
