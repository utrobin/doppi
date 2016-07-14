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
    description = models.TextField(max_length=1024, blank=True)  # Описание
    author = models.ForeignKey(UserProfile, default=1)  # Автор
    pic = models.ImageField(upload_to=picture_upload_to, default='miss.png')  # Картинка
    added_at = models.DateTimeField(default=timezone.now)  # Дата добавления
    views = models.PositiveSmallIntegerField(default=0)  # Просмотры
    likes = models.ManyToManyField(UserProfile, related_name='likes_userprofiles', through='Like')  # Лайки
    info = models.OneToOneField('CourseInfo')  # Связь с информацией


# Информация о курсе
class CourseInfo(models.Model):
    age_from = models.PositiveSmallIntegerField(default=0)  # Возраст от
    age_to = models.PositiveSmallIntegerField(default=18)  # Возраст до
    time_from = models.PositiveSmallIntegerField(default=0)  # Время от
    time_to = models.PositiveSmallIntegerField(default=23)  # Время до
    activity = models.ManyToManyField('CourseType', blank=True)  # Вид курса
    location = models.ManyToManyField('Metro', blank=True)  # Местоположение
    coordinate = models.CharField(max_length=128, blank=True)
    price = models.PositiveIntegerField(default=0)  # Цена
    frequency = models.PositiveSmallIntegerField(default=0)  # Количество занятий в неделю


class Comment(models.Model):
    text = models.TextField(max_length=1024)
    author = models.ForeignKey(UserProfile)
    course = models.ForeignKey(Course)
    added_at = models.DateTimeField(default=timezone.now)


class CourseType(models.Model):
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
