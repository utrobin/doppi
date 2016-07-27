# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2016-07-16 15:24
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import search.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text', models.TextField(max_length=1024)),
                ('added_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.UserProfile')),
            ],
        ),
        migrations.CreateModel(
            name='Course',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=128)),
                ('description', models.TextField(blank=True, max_length=1024)),
                ('pic', models.ImageField(default='miss.png', upload_to=search.models.picture_upload_to)),
                ('added_at', models.DateTimeField(default=django.utils.timezone.now)),
                ('views', models.PositiveSmallIntegerField(default=0)),
                ('author', models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='authentication.UserProfile')),
            ],
        ),
        migrations.CreateModel(
            name='CourseCluster',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=128)),
            ],
        ),
        migrations.CreateModel(
            name='CourseInfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('age_from', models.PositiveSmallIntegerField(default=0)),
                ('age_to', models.PositiveSmallIntegerField(default=18)),
                ('time_from', models.PositiveSmallIntegerField(default=0)),
                ('time_to', models.PositiveSmallIntegerField(default=23)),
                ('coordinate_x', models.FloatField(blank=True)),
                ('coordinate_y', models.FloatField(blank=True)),
                ('price', models.PositiveIntegerField(default=0)),
                ('frequency', models.PositiveSmallIntegerField(default=0)),
                ('activity', models.ManyToManyField(blank=True, to='search.CourseCluster')),
            ],
        ),
        migrations.CreateModel(
            name='CourseType',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=128)),
                ('cluster', models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to='search.CourseCluster')),
            ],
        ),
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_liked', models.BooleanField(default=False)),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='search.Course')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authentication.UserProfile')),
            ],
        ),
        migrations.CreateModel(
            name='Metro',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=128)),
            ],
        ),
        migrations.AddField(
            model_name='courseinfo',
            name='location',
            field=models.ManyToManyField(blank=True, to='search.Metro'),
        ),
        migrations.AddField(
            model_name='course',
            name='info',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='search.CourseInfo'),
        ),
        migrations.AddField(
            model_name='course',
            name='likes',
            field=models.ManyToManyField(related_name='likes_userprofiles', through='search.Like', to='authentication.UserProfile'),
        ),
        migrations.AddField(
            model_name='comment',
            name='course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='search.Course'),
        ),
    ]