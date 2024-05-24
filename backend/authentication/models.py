from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import render, redirect
from django.db import IntegrityError

class User(AbstractUser):
	pass

class Member(models.Model):
  username = models.CharField(max_length=255)
  position = models.IntegerField(default=0)

  def __str__(self):
    return f"{self.username}"

class Game(models.Model):
    player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player1')
    player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='games_as_player2')
    player3 = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='games_as_player3')
    scorePlayer1 = models.IntegerField(default=-1)
    scorePlayer2 = models.IntegerField(default=-1)
    gameplayMode = models.CharField(max_length=255)
    