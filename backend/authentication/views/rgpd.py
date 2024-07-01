from ..models import User, FriendRequest, Game, UserStat
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from django.shortcuts import get_object_or_404
from django.db.models import Q

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def generateDataFile(request):
    user = get_object_or_404(User, username=request.user.username)
    stats = UserStat.objects.filter(player=user)
    games = Game.objects.filter(Q(player1=user) | Q(player2=user) | Q(player3=user))
    friends_requests = FriendRequest.objects.filter(Q(receiver=user) | Q(sender=user))
    
    print("\nUser Information:")
    print(f"Username: {user.username}")
    print(f"Language: {user.language}")
    print(f"Profile: {user.profile_picture.url}")
    print(f"Last Login Date: {user.last_login_date}")
    print(f"Created At: {user.created_at}")
    print(f"Status: {user.status}")
    print(f"Alias: {user.alias}")
    print(f"Is Host: {user.is_host}")
    print(f"Graphic Mode: {user.graphic_mode}")
    print(f"Number of Matches: {user.nbr_match}")
    print(f"Number of Wins: {user.nbr_match_win}")
    print(f"Number of Losses: {user.nbr_match_lost}")
    print(f"Number of Goals: {user.nbr_goals}")

    print("\nStats:")
    for stat in stats:
        print(f"Game: {stat.game}, Winner: {stat.isWinner}, Points Scored: {stat.pointsScored}, "
              f"Points Taken: {stat.pointsTaken}, Dashes: {stat.nbDashes}, Powers Used: {stat.nbPoweredUsed}, "
              f"Bounces: {stat.nbBounces}, Mode: {stat.modeGame}, Map: {stat.mapGame}, "
              f"Date: {stat.date}, Game Time: {stat.gameTime}")

    print("\nGames:")
    for game in games:
        print(f"Player1: {game.player1}, Player2: {game.player2}, Player3: {game.player3}, "
              f"Score Player1: {game.scorePlayer1}, Score Player2: {game.scorePlayer2}, "
              f"Gameplay Mode: {game.gameplayMode}, Mode: {game.modeGame}, Map: {game.mapGame}, "
              f"Date: {game.date}, Game Time: {game.gameTime}")

    print("\nFriend Requests:")
    for fr in friends_requests:
        print(f"Sender: {fr.sender}, Receiver: {fr.receiver}, Status: {fr.status}")

    return Response({"message": "Data file generated and printed to console"})