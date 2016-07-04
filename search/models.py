# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
import os


# Create your models here.

def picture_upload_to(instance, filename):
    return os.path.join('', instance.author.username + os.path.splitext(filename)[1])


class Course(models.Model):
    title = models.CharField(max_length=128)
    description = models.TextField(max_length=1024, default='')
    phone_number = models.CharField(max_length=20, default='')
    author = models.ForeignKey(User, default=1)
    pic = models.ImageField(upload_to=picture_upload_to, default='miss.png')
    added_at = models.DateTimeField(default=timezone.now)
    # Связь с информацией
    info = models.OneToOneField('CourseInfo')


class CourseInfo(models.Model):
    OTHER = 'OR'
    LANGUAGE = 'LN'
    SPORTS = 'SP'
    ART = 'AR'
    EDUCATION = 'ED'
    ENTERTAINMENT = 'ET'
    COURSE_ACTIVITIES = (
        (OTHER, u'Другое'),
        (LANGUAGE, u'Иностранные языки'),
        (SPORTS, u'Спорт'),
        (ART, u'Искусство'),
        (EDUCATION, u'Образование'),
        (ENTERTAINMENT, u'Развлечения'),
    )
    # Возраст
    age_from = models.PositiveSmallIntegerField(default=0)
    age_to = models.PositiveSmallIntegerField(default=18)
    # Вид курса
    activity = models.CharField(max_length=2, choices=COURSE_ACTIVITIES, default=OTHER)
    # На улице или в здании
    is_indoors = models.BooleanField(default=True)
    # Местоположение
    location = models.CharField(max_length=50, default='')
    # Цена
    price = models.IntegerField(default=0)
    # Длительность в днях
    length = models.PositiveSmallIntegerField(default=0)
    # Частота занятий в днях недели
    frequency = models.PositiveSmallIntegerField(default=0)


class Comment(models.Model):
    text = models.TextField(max_length=1024)
    author = models.ForeignKey(User)
    course = models.ForeignKey(Course)
    added_at = models.DateTimeField(default=timezone.now)
