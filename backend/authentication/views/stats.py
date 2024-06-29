import os

from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Sum, F, FloatField, ExpressionWrapper, Case, When

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from ..models import User, UserStat
from ..serializers import UserSerializer, SignupSerializer, UpdateInfoSerializer, UserListSerializer

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_stats(request, userId):
  try:
    # est ce que c ok ???? get_or_404
    user = get_object_or_404(User, id=userId)
    gameWon = UserStat.objects.filter(player=user, isWinner=True)
    nbrGameWon = gameWon.count()
    allGames = UserStat.objects.filter(player=user).order_by('date')
    nbrGames = allGames.count()

    mapPercentages = {}
    modePercentages = {}

    # Win rate
    percentageGameWon = round((nbrGameWon * 100) / user.nbr_match, 1) if user.nbr_match > 0 else 0
    percentageGameLost = round(100 - percentageGameWon, 1)

    # Dashes / PoweredUsed
    sums = allGames.aggregate(totalDashes=Sum('nbDashes'), totalPoweredUsed=Sum('nbPoweredUsed'), totalGameTime=Sum('gameTime'))

    totalGameTime = sums['totalGameTime'] or 0
    totalDashes = sums['totalDashes'] or 0
    totalPowerUpsUsed = sums['totalPoweredUsed'] or 0

    total = totalDashes + totalPowerUpsUsed
    if total > 0:
      dashesPercentage = (totalDashes / total) * 100
      poweredUsedPercentage = (totalPowerUpsUsed / total) * 100
    else:
      dashesPercentage = 0
      poweredUsedPercentage = 0

    # Efficiency rate
    allGames_annotated = allGames.annotate(
      efficiency_ratio=ExpressionWrapper(
        F('pointsScored') / 
        Case(
            When(pointsTaken__gt=0, then=F('pointsTaken')),
            default=1.0,
            output_field=FloatField()
        ),
        output_field=FloatField()
      )
    )

    # efficiencyRatios = list(allGames_annotated.values_list('efficiency_ratio', flat=True))
    # totalEficiency = allGames_annotated.aggregate(totalEfficiency=Sum('efficiency_ratio'))

    # Total points taken
    totalPointsTaken = allGames.aggregate(totalPointsTaken=Sum('pointsTaken'))['totalPointsTaken'] or 0
    totalPointsScored = allGames.aggregate(totalPointsScored=Sum('pointsScored'))['totalPointsScored'] or 0

    # Total balls bounced
    totalBounces = allGames.aggregate(totalBounces=Sum('nbBounces'))['totalBounces'] or 0

    # Current streak
    maxStreak = 0
    currentStreak = 0

    for game in allGames:
      if game.isWinner:
        currentStreak += 1
        if currentStreak > maxStreak:
          maxStreak = currentStreak
      else:
          currentStreak = 0
    
    spaceMap = 0
    dragonMap = 0
    skyMap = 0
    oceanMap = 0
    classicMode = 0
    spinOnlyMode = 0
    powerlessMode = 0

    for game in allGames:
      
      # Map counter
      if game.mapGame == "oceanMap":
        oceanMap += 1 
      elif game.mapGame == "spaceMap":
          spaceMap += 1
      elif game.mapGame == "dragonMap":
          dragonMap += 1
      elif game.mapGame == "skyMap":
          skyMap += 1
      
      # Mode counter
      if game.modeGame == "CLASSIC":
        classicMode += 1
      elif game.modeGame == "SPIN ONLY":
        spinOnlyMode += 1
      elif game.modeGame == "POWERLESS":
        powerlessMode += 1
    
    # Map percentage
    oceanMapPercentage = round((oceanMap / nbrGames) * 100, 1) if user.nbr_match > 0 else 0
    spaceMapPercentage = round((spaceMap / nbrGames) * 100, 1) if user.nbr_match > 0 else 0
    dragonMapPercentage = round((dragonMap / nbrGames) * 100, 1) if user.nbr_match > 0 else 0
    skyMapPercentage = round((skyMap / nbrGames) * 100, 1) if user.nbr_match > 0 else 0

    # Mode percantage
    classicModePercentage = round((classicMode / nbrGames) * 100, 1) if user.nbr_match > 0 else 0
    spinOnlyModePercentage = round((spinOnlyMode / nbrGames) * 100, 1) if user.nbr_match > 0 else 0
    powerlessModePercentage = round((powerlessMode / nbrGames) * 100, 1) if user.nbr_match > 0 else 0

    mapPercentages = {
      "oceanMap": oceanMapPercentage,
      "spaceMap": spaceMapPercentage,
      "dragonMap": dragonMapPercentage,
      "skyMap": skyMapPercentage
    }

    modePercentages = {
      "classicMode": classicModePercentage,
      "spinOnlyMode": spinOnlyModePercentage,
      "powerlessMode": powerlessModePercentage
    }

    # Bounces and points taken
    sums = allGames.aggregate(totalBounces=Sum('nbBounces'), totalPointsTaken=Sum('pointsTaken'))

    totalBounces = sums['totalBounces']
    totalPointsTaken = sums['totalPointsTaken']
    if totalBounces is not None and totalPointsTaken is not None:
      if totalPointsTaken != 0:
        efficiency = round((totalBounces / totalPointsTaken), 1)
      else:
        efficiency = -1
    else:
      efficiency = -1

    return Response({
      'percentageGameWon': percentageGameWon, 
      'percentageGameLost': percentageGameLost,
      'totalDashes': totalDashes,
      'totalPowerUpsUsed': totalPowerUpsUsed,
      'dashesPercentage': dashesPercentage,
      'poweredUsedPercentage': poweredUsedPercentage,
      'nbrGames': nbrGames,
      'maxStreak': maxStreak,
      'currentStreak': currentStreak,
      'mapPercentages': mapPercentages,
      'modePercentages' : modePercentages,
      'efficiency' : efficiency,
      'totalPointsTaken': totalPointsTaken,
      'totalPointsScored': totalPointsScored,
      'totalBounces': totalBounces,
      'totalGameTime': totalGameTime,
      'nbrGoal': user.nbr_goals,
      'nbrWin': user.nbr_match_win,
      'nbrLose': user.nbr_match_lost,
      'nbrMatch': user.nbr_match
    })

  except User.DoesNotExist:
    return Response({'status': "Not found", 'error': "L'utilisateur avec cet identifiant n'existe pas."}, status=404)