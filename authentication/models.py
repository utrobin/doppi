# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
import os


def avatar_upload_to(instance, filename):
    return os.path.join('', instance.user.username + os.path.splitext(filename)[1])


class UserProfile(models.Model):
    USER_TYPES = (
        ('PA', u'Родитель'),
        ('CH', u'Ребенок или подросток'),
        ('CO', u'Организация')
    )
    user = models.OneToOneField(User, unique=True)
    avatar = models.ImageField(upload_to=avatar_upload_to, default='miss.png')
    subscribed = models.BooleanField(default=True)
    user_type = models.CharField(max_length=2, choices=USER_TYPES, default='PA')
    info = models.OneToOneField('UserInfo')
    results = models.TextField(max_length=2048)


class UserInfo(models.Model):
    name = models.CharField(max_length=128, blank=True)
    title = models.CharField(max_length=128, blank=True)
    phone_number = models.CharField(max_length=20, blank=True)
    is_payable = models.BooleanField(default=False)
    is_photo = models.BooleanField(default=False)
    is_notify = models.BooleanField(default=False)
    activity = models.ManyToManyField('search.CourseType', blank=True)


class Child(models.Model):
    name = models.CharField(max_length=128)
    birth_year = models.PositiveSmallIntegerField(default=0)
    metro = models.CharField(max_length=128, blank=True)
    phone_number = models.CharField(max_length = 20, blank=True)
    email = models.EmailField(blank=True)
    good_at = models.CharField(max_length=128, blank=True)
    prev_activities = models.ManyToManyField('search.CourseType', blank=True)
    parent = models.ForeignKey(UserProfile, null=True, default=None)
    attend_to = models.ManyToManyField('search.Course', related_name='child_course', through='Payment')


class Payment(models.Model):
    child = models.ForeignKey(Child, null=True, default=None)
    course = models.ForeignKey('search.Course', null=True, default=None)
    isPayed = models.BooleanField(default=False)


class test(models.Model):
    title = models.CharField(max_length=128)


class Question(models.Model):
    text = models.TextField(max_length=1024)
    question = models.ForeignKey(test)
    several = models.BooleanField(default=False)


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer = models.CharField(max_length=200)
