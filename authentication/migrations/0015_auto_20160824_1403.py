# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20160713141539 on 2016-08-24 14:03
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0014_auto_20160824_1349'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userinfo',
            name='sex',
            field=models.CharField(choices=[('M', 'мальчик'), ('W', 'девочка'), ('N', 'не указано')], default='N', max_length=2),
        ),
    ]