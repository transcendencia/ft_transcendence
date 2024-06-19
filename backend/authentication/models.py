from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import render, redirect
from django.db import IntegrityError
from django.conf import settings
from django.utils import timezone

class User(AbstractUser):
  language_choices = [
    ('en', 'english'),
    ('fr', 'french'),
    ('es', 'espagnol'),
  ]
  language = models.CharField(max_length=10, choices=language_choices, default='en')
  last_login_date = models.DateField(null=True, blank=True)

  status_choices = [
    ('online', 'online'),
    ('offline', 'offline'),
    ('in_game', 'in_game'),
  ]
  status = models.CharField(max_length=10, choices=status_choices, default='offline')
  profile_picture = models.ImageField(default='default.png')
  alias = models.TextField(max_length=28, null=True, blank=True)
  is_host = models.BooleanField(default=False)
  friends = models.ManyToManyField("self", through="FriendRequest", symmetrical=False, related_name='related_friends', blank=True)
  graphic_mode = models.CharField(max_length=10, default='medium')

  nbr_match = models.IntegerField(default=0)
  nbr_match_win = models.IntegerField(default=0)
  nbr_match_lost = models.IntegerField(default=0)
  nbr_goals = models.IntegerField(default=0)

  def get_profile_info(self):
    return {'id': self.id, 
    'username': self.username, 
    'alias': self.alias, 
    'profile_picture': self.profile_picture.url, 
    'nbr_match': self.nbr_match, 
    'nbr_match_win': self.nbr_match_win,
    'nbr_match_lost': self.nbr_match_lost,
    'nbr_goals': self.nbr_goals}


class FriendRequest(models.Model):
  sender = models.ForeignKey(User, related_name="sender", on_delete=models.CASCADE)
  receiver = models.ForeignKey(User, related_name="receiver", on_delete=models.CASCADE)
  status_choices = [
    ('accepted', 'accepted'),
    ('pending', 'pending'),
  ]
  status = models.CharField(max_length=10, choices=status_choices, default='pending')

#histiorque des partie du jouer (adversaire : pseudo + image, score, mode de jeux)

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
  modeGame = models.CharField(max_length=255, default="test")
  mapGame = models.CharField(max_length=255, default="spaceMap")
  date = models.DateTimeField(default=timezone.now)
  
  def __str__(self):
    return f"{self.gameplayMode}"
class UserStat(models.Model):
  player = models.ForeignKey(User, on_delete=models.CASCADE)
  game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name='user_stats')
  isWinner = models.BooleanField(default=False)
  pointsScored = models.IntegerField(default=-1)
  pointsTaken = models.IntegerField(default=-1)
  nbDashes = models.IntegerField(default=-1)
  nbPoweredUsed = models.IntegerField(default=-1)
  nbBounces = models.IntegerField(default=-1)
  modeGame = models.CharField(max_length=255, default="test")
  mapGame = models.CharField(max_length=255, default="spaceMap")
  date = models.DateTimeField(default=timezone.now)
