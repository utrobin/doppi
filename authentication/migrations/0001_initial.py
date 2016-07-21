# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-16 15:24
from __future__ import unicode_literals

import authentication.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Child',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=128)),
                ('birth_year', models.PositiveSmallIntegerField(default=0)),
                ('metro', models.CharField(blank=True, max_length=128)),
                ('phone_number', models.CharField(blank=True, max_length=20)),
                ('email', models.EmailField(blank=True, max_length=254)),
                ('good_at', models.CharField(blank=True, max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='Payment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('isPayed', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UserInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=128)),
                ('title', models.CharField(blank=True, max_length=128)),
                ('phone_number', models.CharField(blank=True, max_length=20)),
                ('is_payable', models.BooleanField(default=False)),
                ('is_photo', models.BooleanField(default=False)),
                ('is_notify', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('avatar', models.ImageField(default='miss.png', upload_to=authentication.models.avatar_upload_to)),
                ('subscribed', models.BooleanField(default=True)),
                ('user_type', models.CharField(choices=[('PA', 'Родитель'), ('CH', 'Ребенок или подросток'), ('CO', 'Организация')], default='PA', max_length=2)),
                ('info', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='authentication.UserInfo')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
