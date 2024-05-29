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

  last_login_date = models.DateField(null=True)

  STATUS_CHOICE = [
    ('online', 'online'),
    ('offline', 'offline'),
    ('in_game', 'in_game'),
  ]
  status = models.CharField(max_length = 10, choices=STATUS_CHOICE, default='offline')
  profile_picture = models.ImageField(default='default.png')
  bio = models.CharField(max_length = 28, null=True, blank=True)
  # friends = models.ManyToManyField('self', related_name='friends', blank=True)

  def get_profile_info(self):
    return({'username': self.username, 'bio': self.bio, 'profile_picture': self.profile_picture.url})

#histiorque des partie du jouer (adversaire : pseudo + image, score, mode de jeux)

class Friendlist(models.Model):
  user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user")
  friends = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True)

  def add_friend(self, account):
    if not account in self.friends.all():
      self.friends.add(account)
      self.save()
  
  def remove_friend(self, account):
    if account in self.friends.all():
      self.friends.remove(account)
      self.save()
  
  def unfriend(self, removee):
    remover_friends_list = self
    remover_frind_list.remove_frind(removee)
    frind_list = Friendlist.object.get(user=removee)
    frien_list.remove_friend(self.user)
  
  def is_mutal_friend(self, friend):
    if friend in self.friends.all():
      return True
    return False

class FriendRequest(models.Model):
  sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sender")
  receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="receiver")
  is_active = models.BooleanField(blank=True, null=False, default=True)

  def accept(self):
    reveiver_friend_list = Friendlist.object.get(user=self.reveiver)
    if receiver_friend_list:
      receiver_friend_list.add_friend(self.sender)
      sender_friend_list = FriendList.objects.get(user=self.sender)
      if sender_friend_list:
        sender_friend_list.add_friend(self.receiver)
        self.is_active = False
        self.save()

  def decline(self):
    self.is_active = False
    self.save()

  def cancel(self):
    self.is_active = False
    self.save()

class Member(models.Model):
  username = models.CharField(max_length=255)
  position = models.IntegerField(default=0)

  def __str__(self):
    return self.username