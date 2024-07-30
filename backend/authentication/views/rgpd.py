from ..models import User, FriendRequest, Game, UserStat
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from django.db.models import Q
import io
from django.http import HttpResponse
from django.utils.text import slugify
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def generateDataFile(request):
    try:
        user = get_object_or_404(User, username=request.user.username)
        stats = UserStat.objects.filter(player=user)
        games = Game.objects.filter(Q(player1=user) | Q(player2=user) | Q(player3=user))
        friends_requests = FriendRequest.objects.filter(Q(receiver=user) | Q(sender=user))


        buffer = io.StringIO()


        buffer.write("User Information:\n")
        buffer.write(f"Username: {user.username}\n")
        buffer.write(f"Language: {user.language}\n")
        buffer.write(f"Profile: {user.profile_picture.url}\n")
        buffer.write(f"Last Login Date: {user.last_login_date}\n")
        buffer.write(f"Created At: {user.created_at}\n")
        buffer.write(f"Status: {user.status}\n")
        buffer.write(f"Alias: {user.alias}\n")
        buffer.write(f"Is Host: {user.is_host}\n")
        buffer.write(f"Graphic Mode: {user.graphic_mode}\n")
        buffer.write(f"Number of Matches: {user.nbr_match}\n")
        buffer.write(f"Number of Wins: {user.nbr_match_win}\n")
        buffer.write(f"Number of Losses: {user.nbr_match_lost}\n")
        buffer.write(f"Number of Goals: {user.nbr_goals}\n\n")


        buffer.write("Stats:\n")
        for stat in stats:
            buffer.write(
                f"Game: {stat.game}, Winner: {stat.isWinner}, Points Scored: {stat.pointsScored}, "
                f"Points Taken: {stat.pointsTaken}, Dashes: {stat.nbDashes}, Powers Used: {stat.nbPoweredUsed}, "
                f"Bounces: {stat.nbBounces}, Mode: {stat.modeGame}, Map: {stat.mapGame}, "
                f"Date: {stat.date}, Game Time: {stat.gameTime}\n"
            )
        buffer.write("\n")


        buffer.write("Games:\n")
        for game in games:
            buffer.write(
                f"Player1: {game.player1}, Player2: {game.player2}, Player3: {game.player3}, "
                f"Score Player1: {game.scorePlayer1}, Score Player2: {game.scorePlayer2}, "
                f"Gameplay Mode: {game.gameplayMode}, Mode: {game.modeGame}, Map: {game.mapGame}, "
                f"Date: {game.date}, Game Time: {game.gameTime}\n"
            )
        buffer.write("\n")


        buffer.write("Friend Requests:\n")
        for fr in friends_requests:
            buffer.write(f"Sender: {fr.sender}, Receiver: {fr.receiver}, Status: {fr.status}\n")


        buffer.seek(0)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"user_data_{slugify(user.username)}_{timestamp}.txt"
        response = HttpResponse(buffer.getvalue(), content_type='text/plain')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        print(response['Content-Disposition'])
        logger.info(f"File generated successfully for user {user.username}")
        print(response)
        return response
    except Exception as e:
        logger.error(f"Error generating file for user {request.user.username}: {str(e)}")
        return HttpResponse(status=500)
