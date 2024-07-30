from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect, get_object_or_404
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

from django.db.utils import OperationalError, InterfaceError

import json


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_game_player2(request):
    if request.method == 'GET':
        host = request.user
        player_id = request.query_params.get("id")
        
        if player_id is None:
            return Response({'status': 'fail', 'message': 'Player ID is required'}, status=400)
        try:
            player_id = int(player_id)
        except ValueError:
            return Response({'status': 'fail', 'message': 'Invalid Player ID format'}, status=400)

        try:
            games = Game.objects.filter(player1=player_id).union(Game.objects.filter(player2=player_id)).order_by('-date')
            serializers = GameListSerializer(games, many=True)
            response_data = {
                'host_id': host.id,
                'games': serializers.data
            }
            return Response(response_data)
        
        except (OperationalError, InterfaceError) as e:
            return Response({'status': 'error', 'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

  
@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def get_game_user(request):
    try:
        user = request.user
        games = Game.objects.filter(player1=user).union(Game.objects.filter(player2=user)).order_by('-date')
        serializers = GameListSerializer(games, many=True)
        response_data = {
            'user_id': user.id,
            'games': serializers.data
        }
        return Response(response_data)
    except (OperationalError, InterfaceError) as e:
        return Response({'status': 'error', 'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def add_game(request):
    try:
        data = json.loads(request.body.decode('utf-8'))
    except json.JSONDecodeError:
        return JsonResponse({'status': 'fail', 'message': 'Invalid JSON format. Please send data in JSON format.'}, status=400)
    except UnicodeDecodeError:
        return JsonResponse({'status': 'fail', 'message': 'Invalid Unicode in request body.'}, status=400)

    if not isinstance(data, dict):
        return JsonResponse({'status': 'fail', 'message': 'Invalid data format. Expected a JSON object.'}, status=400)
    required_fields = ['player1', 'player2', 'scorePlayer1', 'scorePlayer2', 'gameplayMode', 'modeGame', 'mapGame', 'gameTime', 'user1', 'user2']
    missing_fields = [field for field in required_fields if field not in data]
    if missing_fields:
        return JsonResponse({'status': 'fail', 'message': f'Missing required fields: {", ".join(missing_fields)}'}, status=400)

    try:
        player1_id = int(data['player1'])
        player2_id = int(data['player2'])
        player3_id = int(data.get('player3')) if data.get('player3') not in [None, ''] else None
        scorePlayer1 = int(data['scorePlayer1'])
        scorePlayer2 = int(data['scorePlayer2'])
        gameTime = int(data['gameTime'])
    except ValueError as e:
        return JsonResponse({'status': 'fail', 'message': f'Invalid data type: {str(e)}'}, status=400)

    gameplayMode = data['gameplayMode']
    modeGame = data['modeGame']
    mapGame = data['mapGame']
    if not all(isinstance(field, str) for field in [gameplayMode, modeGame, mapGame]):
        return JsonResponse({'status': 'fail', 'message': 'Invalid data type for gameplayMode, modeGame, or mapGame'}, status=400)

    try:
        player1 = get_object_or_404(User, id=player1_id)
        player2 = get_object_or_404(User, id=player2_id)
        player3 = get_object_or_404(User, id=player3_id) if player3_id else None
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
        return JsonResponse({'status': 'success', 'game_id': game.id}, status=201)
    except User.DoesNotExist:
        return JsonResponse({'status': 'fail', 'message': 'One or more players not found'}, status=404)
    except (OperationalError, InterfaceError) as e:
        return Response({'status': 'error', 'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


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
