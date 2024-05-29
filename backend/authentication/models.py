from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.conf import settings

class User(AbstractUser):
  LANGUAGE_CHOICE = [
    ('en', 'english'),
    ('fr', 'french'),
    ('es', 'espagnol'),
  ]
  language = models.CharField(max_length = 10, choices=LANGUAGE_CHOICE, default='en')

  last_login_date = models.DateField(null=True, blank=True)

  STATUS_CHOICE = [
    ('online', 'online'),
    ('offline', 'offline'),
    ('in_game', 'in_game'),
  ]
  status = models.CharField(max_length = 10, choices=STATUS_CHOICE, default='offline')
  profile_picture = models.ImageField(default='default.png')
  bio = models.CharField(max_length = 28, null=True, blank=True)
  is_host = models.BooleanField(default=False)

  def get_profile_info(self):
    return({'username': self.username, 'bio': self.bio, 'profile_picture': self.profile_picture.url})

#histiorque des partie du jouer (adversaire : pseudo + image, score, mode de jeux)

class Member(models.Model):
  username = models.CharField(max_length=255)
  position = models.IntegerField(default=0)

  def __str__(self):
    return self.username