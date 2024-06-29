from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
from django.http import JsonResponse
from django.utils import timezone
from django.template.response import TemplateResponse
from django.db.models import Q

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from ..models import User, Game, UserStat
from ..serializers import UserSerializer, SignupSerializer, UpdateInfoSerializer, UserListSerializer, GameListSerializer

import json


def game_list(request):
  allGames = Game.objects.all()
  template = loader.get_template('addPlayer.html')
  context = {
    'allGames': allGames,
  }
  return HttpResponse(template.render(context, request))

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_game_list(request):
  if request.method == 'GET':
    games = Game.objects.all()
    serializers = GameListSerializer(games, many=True)
    return Response(serializers.data)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_game_player2(request):
  if request.method == 'POST':
    host = request.user
    data = json.loads(request.body)
    games = Game.objects.filter(player1=(data.get("id"))).union(Game.objects.filter(player2=(data.get("id")))).order_by('-date')
    serializers = GameListSerializer(games, many=True)
    response_data = {
        'host_id': host.id,
        'games': serializers.data
    }
    return Response(response_data)
  
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_game_user(request):
  if request.method == 'GET':
    user = request.user
    games = Game.objects.filter(player1=user).union(Game.objects.filter(player2=user)).order_by('-date')
    serializers = GameListSerializer(games, many=True)
    response_data = {
        'user_id': user.id,
        'games': serializers.data
    }
    return Response(response_data)

def add_game(request):
  if request.method == 'POST':
    data = json.loads(request.body)
        
    player1_id = data['player1']
    player2_id = data['player2']
    player3_id = data.get('player3', None)  # Optional
    scorePlayer1 = data['scorePlayer1']
    scorePlayer2 = data['scorePlayer2']
    gameplayMode = data['gameplayMode']
    modeGame = data['modeGame']
    mapGame = data['mapGame']
    gameTime = data['gameTime']
    
    player1 = User.objects.get(id=player1_id)
    player2 = User.objects.get(id=player2_id)
    player3 = User.objects.get(id=player3_id) if player3_id else None
    game = Game(
        player1=player1,
        player2=player2,
        player3=player3,
        scorePlayer1=scorePlayer1,
        scorePlayer2=scorePlayer2,
        gameplayMode=gameplayMode,
        modeGame=modeGame,
        mapGame=mapGame,
        gameTime=gameTime
    )
    game.save()
    
    createUserStat(player1, game, data['user1'])
    createUserStat(player2, game, data['user2'])
    # user1 = data['user1']
    # user2 = data['user2']
    # user3 = data.get('user3', None)
    # print("user1", user1)
    # print("user2", user2)
    return JsonResponse({'status': 'success', 'game_id': game.id})
  return JsonResponse({'status': 'fail'}, status=400)

def createUserStat(user, game, userStat):
  user.nbr_match += 1
  if userStat.get('isWinner', False):
    user.nbr_match_win += 1
  else:
    user.nbr_match_lost += 1
  user.nbr_goals += userStat['pointsScored']
  user.save()

  new_stat = UserStat(
    player=user, 
    game=game,
    isWinner=userStat['isWinner'],
    pointsScored=userStat['pointsScored'],
    pointsTaken=userStat['pointsTaken'],
    nbDashes=userStat['nbDashes'],
    nbPoweredUsed=userStat['nbPowerUsed'],
    nbBounces=userStat['nbBounces'],
    modeGame=game.modeGame,
    mapGame=game.mapGame,
    gameTime=game.gameTime)
  new_stat.save()

  return JsonResponse({'status': 'success'})
