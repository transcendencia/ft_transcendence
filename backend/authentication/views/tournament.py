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

# def game_list(request):
#   games = Game.objects.all()
#   return render(request, 'addPlayer.html', {'games': games})

def game_list(request):
  allGames = Game.objects.all().values()
  template = loader.get_template('addPlayer.html')
  context = {
    'allGames': allGames,
  }
  return HttpResponse(template.render(context, request))

def add_game(request):
  if request.method == 'POST':
    data = json.loads(request.body)
        
    player1_id = data['player1']
    player2_id = data['player2']
    player3_id = data.get('player3', None)  # Optional
    scorePlayer1 = data['scorePlayer1']
    scorePlayer2 = data['scorePlayer2']
    gameplayMode = data['gameplayMode']

    player1 = User.objects.get(id=player1_id)
    player2 = User.objects.get(id=player2_id)
    player3 = User.objects.get(id=player3_id) if player3_id else None
    game = Game(
        player1=player1,
        player2=player2,
        player3=player3,
        scorePlayer1=scorePlayer1,
        scorePlayer2=scorePlayer2,
        gameplayMode=gameplayMode
    )
    game.save()
    return JsonResponse({'status': 'success', 'game_id': game.id})
  return JsonResponse({'status': 'fail'}, status=400)
