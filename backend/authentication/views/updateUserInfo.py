import os

from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from ..models import User, UserStat
from ..serializers import UserSerializer, SignupSerializer, UpdateInfoSerializer, UserListSerializer

#--------------------LANGUAGE--------------------
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_language(request):
  user = request.user

  if request.method == 'POST':
    new_language = request.data.get("language")
    if new_language != user.language:
      user.language = new_language
      user.save()
      return Response({'user_id': user.id, 'languages': user.language}, status=200)
    else:
      return Response(status=400)
  else:
    return Response(status=405)

# adapter avec un id pour que se soit applicable au user non host
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_status(request):
  if request.method == 'POST':
    if request.data.get('status') == 'offline': #a checker
      request.user.is_host = False
    request.user.status = request.data.get('status')
    request.user.save()
    print(request.user.username, request.user.status) #LOG
    return Response({'user_id': request.user.id, 'status': request.user.status}, status=200)
  else:
    return Response(status=405)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_status(request, userId):
  try:
    user = get_object_or_404(User, id=userId)
    return Response({'status': user.status}, status=200)
  except User.DoesNotExist:
    return Response({'status': "Not found", 'error': "L'utilisateur avec cet identifiant n'existe pas."}, status=404)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_profile_info(request):
  if (request.method == 'GET'):
    user = request.user
    if user:
      profile_info = user.get_profile_info()
      return Response({'profile_info': profile_info})
    else:
      return Response(status=400)
  else:
    return Response(status=405)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_stats(request, userId):
  try:
    user = get_object_or_404(User, id=userId)
    gameWon = UserStat.objects.filter(player=user, isWinner=True)
    nbrGameWon = gameWon.count()
    percentageGameWon = round((nbrGameWon * 100) / user.nbr_match, 1) if user.nbr_match > 0 else 0
    print(percentageGameWon)
    percentageGameLost = round(100 - percentageGameWon, 1)
    return Response({'percentageGameWon': percentageGameWon, 'percentageGameLost': percentageGameLost})
  except User.DoesNotExist:
    return Response({'status': "Not found", 'error': "L'utilisateur avec cet identifiant n'existe pas."}, status=404)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_profile_info(request):
    if request.method == 'POST':
        print(request.data)
        # copier data dans un nouveau truc pour pouvoir changer  les valeurs (bien changer les endroit ou est appeler request.data par le nom de la nouvele variables)
        # checker request.data.get('anonymousStatus') == 'true'
        anonymousStatus = request.data.get('anonymousStatus') == 'true'
        print(anonymousStatus)
        
        serializer = UpdateInfoSerializer(instance=request.user, data=request.data)
        if 'profile-pic' in request.FILES:
            print(request.user.profile_picture.name)
            if request.user.profile_picture.name != 'default.png':
              request.user.profile_picture.delete()
            uploaded_file = request.FILES['profile-pic']
            request.user.profile_picture = uploaded_file
            request.user.save()
            print("picture changed") #LOG
        if serializer.is_valid():
            serializer.save()
            return Response({'status': "succes", 'id': request.user.id, 'serializer': serializer.data, 'message': "info changed"}, status=200)
        first_error = next(iter(serializer.errors.values()))[0]
        print(first_error)
        return Response({'status': "failure", "message": first_error}, status=400)

def user_list(request):
  return render(request, 'user_list.html')

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_list(request):
  if request.method == 'GET':
    users = User.objects.all()
    serializers = UserListSerializer(users, many=True)
    return Response(serializers.data)
  else:
    return Response(status=405)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_graphic_mode(request):
  if request.method == 'POST':
    request.user.graphic_mode = request.data.get('graphicMode')
    request.user.save()
    return Response({'user_id': request.user.id}, status=200)
  else:
    return Response(status=405)

#SECURISER
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_account(request):
  request.user.delete()
  return Response({'status' : "success"})

