import os

from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Sum, F, FloatField, ExpressionWrapper, Case, When

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from ..models import User, UserStat
from ..serializers import UserSerializer, SignupSerializer, UpdateInfoSerializer, UserListSerializer

from .words import colors, items

import random
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
# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def update_status(request):
#   if request.method == 'POST':
#     print(request.user.username, " status before changed:", request.user.status)
#     if request.data.get('status') == 'offline': #a checker
#       request.user.is_host = False
#     request.user.status = request.data.get('status')
#     request.user.save()
#     print("user status after changed:", request.user.status)
#     return Response({'user_id': request.user.id, 'status': request.user.status}, status=200)
#   else:
#     return Response(status=405)

# @api_view(['GET'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def get_status(request, userId):
#   try:
#     print(userId)
#     user = User.objects.get(id=userId)
#     return Response({'user_status': user.status}, status=200)
#   except User.DoesNotExist:
#     return Response({'user_status': "Not found", 'error': "L'utilisateur avec cet identifiant n'existe pas."}, status=404)

class UserStatusView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.user.username, " status before changed:", request.user.status)
        if request.data.get('status') == 'offline':  # a checker
            request.user.is_host = False
        request.user.status = request.data.get('status')
        request.user.save()
        print("user status after changed:", request.user.status)
        return Response({'user_id': request.user.id, 'status': request.user.status}, status=200)
      
    def get(self, request, userId):
        try:
            print(userId)
            user = User.objects.get(id=userId)
            return Response({'user_status': user.status}, status=200)
        except User.DoesNotExist:
            return Response({'user_status': "Not found", 'error': "L'utilisateur avec cet identifiant n'existe pas."}, status=404)

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

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_profile_info(request):
    if request.method == 'POST':
        anonymousStatus = request.data.get('anonymousStatus') == 'true'
        if anonymousStatus:
            request.user.profile_picture = 'default.png'
            request.user.save()
        data = request.data.copy()
        data.pop('anonymousStatus')
        serializer = UpdateInfoSerializer(instance=request.user, data=data)
        if 'profile-pic' in request.FILES and not anonymousStatus:
            print(request.user.profile_picture.name)
            if request.user.profile_picture.name != 'default.png':
              request.user.profile_picture.delete()
            uploaded_file = request.FILES['profile-pic']
            print(uploaded_file)
            request.user.profile_picture = uploaded_file
            request.user.save()
            print("picture changed") 
        if serializer.is_valid():
            serializer.save()
            return Response({'status': "succes", 'id': request.user.id, 'serializer': serializer.data, 'message': "info changed"}, status=200)
        first_error = next(iter(serializer.errors.values()))[0]
        print(first_error)
        return Response({'status': "failure", "message": first_error}, status=400)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def generate_unique_username(request):
    random_color = random.choice(colors)
    random_item = random.choice(items)
    username = random_color + random_item
    nbrUser = User.objects.all().count()
    for i in range(nbrUser + 1):
        if not User.objects.filter(username=username).exists():
            return Response({'username': username}, status=200)
        else:
            random_color = random.choice(colors)
            random_item = random.choice(items)
            username = random_color + random_item
    for i in range(nbrUser + 1):
        username = f"anonymous{i}"
        if not User.objects.filter(username=username).exists():
            return Response({'username': username}, status=200)
    return Response(status=400)

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

