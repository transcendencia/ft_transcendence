from django.shortcuts import get_object_or_404
from django.http import JsonResponse

from django.db.models import Sum, Q
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework import status

from ..models import User, UserStat, FriendRequest

class StatsView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request, userId):
        user = get_object_or_404(User, id=userId)
        all_games = UserStat.objects.filter(player=user).order_by('date')
        nbr_match = all_games.count()
        max_streak, current_streak = self.get_streaks(all_games)

        sums = all_games.aggregate(totalPointsTaken=Sum('pointsTaken'), totalBounces=Sum('nbBounces'), totalDashes=Sum('nbDashes'), totalPoweredUsed=Sum('nbPoweredUsed'), totalGameTime=Sum('gameTime'))

        data = {
            'userInfo': self.get_user_info(user),
            
            'totalDashes': sums['totalDashes'] or 0,
            'totalPowerUpsUsed': sums['totalPoweredUsed'] or 0,
            'totalPointsTaken': sums['totalPointsTaken'] or 0,
            'totalBounces': sums['totalBounces'] or 0,
            'totalGameTime': sums['totalGameTime'] or 0,
            
            'maxStreak': max_streak,
            'currentStreak': current_streak,
            
            'mapPercentages': self.get_map_percentages(all_games, nbr_match),
            'modePercentages': self.get_mode_percentages(all_games, nbr_match),
            
            'nbrGoal': user.nbr_goals,
            'nbrWin': user.nbr_match_win,
            'nbrLose': user.nbr_match_lost,
            'nbrMatch': nbr_match,
            'nbrFriends': FriendRequest.objects.filter((Q(receiver=user) | Q(sender=user)) & Q(status="accepted")).count(),
        }

        return JsonResponse(data, status=status.HTTP_200_OK)

    def get_user_info(self, user):
        return {
            'username': user.username,
            'alias': user.alias,
            'profilePicture': user.profile_picture.url,
            'created_at': user.created_at,
        }
  
    def get_streaks(self, all_games):
        max_streak = 0
        current_streak = 0
        for game in all_games:
            if game.isWinner:
                current_streak += 1
                max_streak = max(max_streak, current_streak)
            else:
                current_streak = 0
        return max_streak, current_streak

    def get_map_percentages(self, all_games, nbr_match):
        map_counts = {
            'oceanMap': 0,
            'spaceMap': 0,
            'dragonMap': 0,
            'skyMap': 0
        }
        for game in all_games:
            if game.mapGame in map_counts:
                map_counts[game.mapGame] += 1

        return {
          'oceanMap': round((map_counts['oceanMap'] / nbr_match) * 100, 1) if nbr_match > 0 else 0,
          'spaceMap': round((map_counts['spaceMap'] / nbr_match) * 100, 1) if nbr_match > 0 else 0,
          'dragonMap': round((map_counts['dragonMap'] / nbr_match) * 100, 1) if nbr_match > 0 else 0,
          'skyMap': round((map_counts['skyMap'] / nbr_match) * 100, 1) if nbr_match > 0 else 0
        }

    def get_mode_percentages(self, all_games, nbr_match):
        mode_counts = {
            'CLASSIC': 0,
            'SPIN ONLY': 0,
            'POWERLESS': 0
        }
        
        for game in all_games:
            if game.modeGame in mode_counts:
                mode_counts[game.modeGame] += 1
        
        return {
            'classicMode': round((mode_counts['CLASSIC'] / nbr_match) * 100, 1) if nbr_match > 0 else 0,
            'spinOnlyMode': round((mode_counts['SPIN ONLY'] / nbr_match) * 100, 1) if nbr_match > 0 else 0,
            'powerlessMode': round((mode_counts['POWERLESS'] / nbr_match) * 100, 1) if nbr_match > 0 else 0
        }
