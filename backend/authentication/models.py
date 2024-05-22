from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import render, redirect
from django.db import IntegrityError

class User(AbstractUser):
  pass
  # languages
  # game_won
  # game_lost
  # goals
  # profile_picutre
  # friends
  # last_login_date

class Member(models.Model):
  username = models.CharField(max_length=255)
  position = models.IntegerField(default=0)

  def __str__(self):
    return f"{self.username}"