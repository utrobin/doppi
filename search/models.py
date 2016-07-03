# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models


# Create your models here.

##debug
class Course(models.Model):
    title = models.CharField(max_length=128)
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
    #Возраст (может быть несолько одновременно)
    is_0_3_age = models.BooleanField(default=False)
    is_4_6_age = models.BooleanField(default=False)
    is_7_11_age = models.BooleanField(default=False)
    is_12_15_age = models.BooleanField(default=False)
    is_16_18_age = models.BooleanField(default=False)
    #Вид курса
    activity = models.CharField(max_length=2, choices=COURSE_ACTIVITIES, default=OTHER)
    #На улице или в здании
    is_indoors = models.BooleanField(default=True)
    #Местоположение
    location = models.CharField(max_length=50, default='')
    #Цена
    price = models.IntegerField(default=0)
    #Длительность в днях
    length = models.IntegerField(default=0)
    #Частота занятий в днях недели
    frequency = models.IntegerField(default=0)
