from django.db import models
from django.contrib.auth.models import AbstractUser
from django.shortcuts import render, redirect
from django.db import IntegrityError

class User(AbstractUser):
  LANGUAGE_CHOICE = [
    ('en', 'english'),
    ('fr', 'french'),
    ('es', 'espagnol'),
  ]
  language = models.CharField(max_length = 10, choices=LANGUAGE_CHOICE, default='en')
  
  last_login_date = models.DateField(null=True)

  STATUS_CHOICE = [
    ('online', 'online'),
    ('offline', 'offline'),
    ('in_game', 'in_game'),
  ]
  status = models.CharField(max_length = 10, choices=STATUS_CHOICE, default='offline')
  profile_picture = models.ImageField(default='default.png')
  bio = models.CharField(max_length = 28, null=True, blank=True)
  
  def get_profile_info(self):
    return({'username': self.username, 'bio': self.bio, 'profile_picture': self.profile_picture.url})

# friends = models.ManyToManyField("User", blank=True)
# histiorque des partie du jouer (adversaire : pseudo + image, score, mode de jeux)

# class Friend_Request(models.Model):
#   from_user = models.ForeignKey(User, related_name='from_user', on_delete=models.CASCADE)
#   to_user = models.ForeignKey(User, related_name='to_user', on_delete=models.CASCADE)

# class Game(models.Model):
  #player_1 = 
  #player_2
  #player_3
  #score
  #winner/loser
  #mode

# class Friendship(models.Model):
#   friend_1 = models.ForeignKey(User, related_name='friend_1', on_delete=models.CASCADE)
#   friend_2 = models.ForeignKey(User, related_name='friend_2', on_delete=models.CASCADE)
  #booleen pour savoir si la demande d'amis a etait accepte ?

  # Stats
  #game_won = models.PositiveIntegerField(default=0)
  #game_lost = models.PositiveIntegerField(default=0)
  #game_played = models.PositiveIntegerField(default=0)
  # goals = models.PositiveIntegerField(default=0)
  #point en tournois
  #point en partie solo
  #point totaux
  #point moyen a chaque game
  #meilleur score


#class Torunament(models.Model): relation avec user

class Member(models.Model):
  username = models.CharField(max_length=255)
  position = models.IntegerField(default=0)

  def __str__(self):
    return self.username