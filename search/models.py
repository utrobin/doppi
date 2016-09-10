# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.db import models
from authentication.models import UserProfile
from django.utils import timezone
import os


# Create your models here.

def picture_upload_to(instance, filename):
    return os.path.join('', instance.author.user.username + os.path.splitext(filename)[1])


# Курс
class Course(models.Model):
    title = models.CharField(max_length=128)  # Название
    description = models.TextField(max_length=16384, blank=True)  # Описание
    introtext = models.TextField(max_length=256, blank=True)
    author = models.ForeignKey(UserProfile, default=1)  # Автор
    pic = models.ImageField(upload_to=picture_upload_to, default='miss.png')  # Картинка
    added_at = models.DateTimeField(default=timezone.now)  # Дата добавления
    views = models.PositiveSmallIntegerField(default=0)  # Просмотры
    likes = models.ManyToManyField(UserProfile, related_name='likes_userprofiles', through='Like')  # Лайки
    info = models.OneToOneField('CourseInfo')  # Связь с информацией
    rating = models.PositiveIntegerField(default=0)
    moderation = models.BooleanField(default=False)
    price = models.PositiveIntegerField(default=0)  # Цена
    location = models.ForeignKey('Metro', blank=True, null=True)
    phone = models.CharField(max_length=32, blank=True)
    site = models.CharField(max_length=128, blank=True)


# Информация о курсе
class CourseInfo(models.Model):
    age_from = models.PositiveSmallIntegerField(default=0)  # Возраст от
    age_to = models.PositiveSmallIntegerField(default=18)  # Возраст до
    time_from = models.PositiveSmallIntegerField(default=0)  # Время от
    time_to = models.PositiveSmallIntegerField(default=23)  # Время до
    activity = models.ForeignKey('CourseType', null=True, default=None)  # Вид курса
    coordinate_x = models.FloatField(blank=True, default=0)
    coordinate_y = models.FloatField(blank=True, default=0)
    frequency = models.PositiveSmallIntegerField(default=0)  # Количество занятий в неделю
    level = models.ForeignKey('Level', null=True)
    skill = models.ManyToManyField('Skill', blank=True)


class Comment(models.Model):
    text = models.TextField(max_length=1024)
    author = models.ForeignKey(UserProfile)
    course = models.ForeignKey(Course)
    added_at = models.DateTimeField(default=timezone.now)


class CourseCluster(models.Model):
    title = models.TextField(max_length=128)

    def __str__(self):
        return self.title


class Like(models.Model):
    user = models.ForeignKey(UserProfile)
    course = models.ForeignKey(Course)
    is_liked = models.BooleanField(default=False)


class Metro(models.Model):
    title = models.TextField(max_length=128)

    def __str__(self):
        return self.title


class CourseType(models.Model):
    title = models.TextField(max_length=128)
    cluster = models.ForeignKey(CourseCluster, blank=True)

    def __str__(self):
        return self.title


class Level(models.Model):
    value = models.IntegerField()
    title = models.CharField(max_length=128)

    def __str__(self):
        return self.title


class Skill(models.Model):
    title = models.CharField(max_length=128)

    def __str__(self):
        return self.title
