from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models
import os


def avatar_upload_to(instance, filename):
    return os.path.join('', instance.user.username + os.path.splitext(filename)[1])


class UserProfile(models.Model):
    user = models.OneToOneField(User, unique=True)
    avatar = models.ImageField(upload_to=avatar_upload_to, default='miss.png')
    info = models.TextField()