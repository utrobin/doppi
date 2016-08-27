# -*- coding: utf-8 -*-
# Generated by Django 1.11.dev20160713141539 on 2016-08-24 08:49
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0011_auto_20160823_2106'),
    ]

    operations = [
        migrations.CreateModel(
            name='Results',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answers', models.TextField(max_length=128)),
            ],
            options={
                'indexes': [],
            },
        ),
        migrations.RemoveField(
            model_name='userprofile',
            name='results',
        ),
        migrations.AlterField(
            model_name='userinfo',
            name='test',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='results',
            name='results',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.UserProfile'),
        ),
    ]