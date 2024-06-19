from django.shortcuts import render
from django.contrib.auth import login, authenticate
from .. import forms
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from ..models import Member, User, Game
from ..forms import MemberForm

from django.http import JsonResponse
import json

def add_member(request):
  if request.method == 'POST':
    request.POST._mutable = True
    request.POST['position'] = 0
    form = MemberForm(request.POST)
    if form.is_valid():
      form.save()
  else:
    form = MemberForm()
  return render(request, 'addPlayer.html', {'form': form})

def result(request):
  mymembers = User.objects.all().values()
  template = loader.get_template('newTournament.html')
  context = {
    'mymembers': mymembers,
  }
  return HttpResponse(template.render(context, request))
