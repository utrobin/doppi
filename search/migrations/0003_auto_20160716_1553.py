# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-16 15:53
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('search', '0002_auto_20160716_1553'),
    ]

    operations = [
        migrations.AlterField(
            model_name='courseinfo',
            name='activity',
            field=models.ManyToManyField(blank=True, to='search.CourseType'),
        ),
    ]
