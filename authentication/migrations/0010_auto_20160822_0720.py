# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20160713141539 on 2016-08-22 07:20
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0009_userinfo_sex'),
    ]

    operations = [
        migrations.AddField(
            model_name='userinfo',
            name='coordinate_x',
            field=models.FloatField(default=0),
        ),
        migrations.AddField(
            model_name='userinfo',
            name='coordinate_y',
            field=models.FloatField(default=0),
        ),
    ]
