# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20160713141539 on 2016-08-20 12:58
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0005_userprofile_results'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='yesno',
            field=models.BooleanField(default=False),
        ),
    ]
