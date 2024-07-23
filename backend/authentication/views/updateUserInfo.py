import os

from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.db.models import Sum, F, FloatField, ExpressionWrapper, Case, When

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status

from ..models import User, UserStat
from ..serializers import UserSerializer, SignupSerializer, UpdateInfoSerializer, UserListSerializer
from ..utils.constants import UserStatus
from .words import words, items
from django.db import transaction
from django.db.models import F

import random
#--------------------LANGUAGE--------------------
class UserGraphicModeView(APIView):
  authentication_classes = [TokenAuthentication]

  def patch(self, request):
    request.user.graphic_mode = request.data.get('graphicMode')
    request.user.save()
    return HttpResponse(status=status.HTTP_200_OK)

class UserLanguageView(APIView):
  authentication_classes = [TokenAuthentication]
  
  def patch(self, request):
    user = request.user
    user.language = request.data.get("language")
    user.save()
    return HttpResponse(status=status.HTTP_200_OK)

class UserStatusView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        request.user.status = request.data.get('status')
        request.user.save()
        return HttpResponse(status=status.HTTP_200_OK)
      
    def get(self, request, userId):
        try:
            print(userId)
            user = User.objects.get(id=userId)
            return Response({'user_status': user.status}, status=200)
        except User.DoesNotExist:
            return Response({'user_status': "Not found", 'error': "L'utilisateur avec cet identifiant n'existe pas."}, status=404)

class UserInfoView(APIView):
  authentication_classes = [TokenAuthentication]

  def get(self, request, userId):
    user = get_object_or_404(User, id=userId)
    if user:
      profile_info = user.get_profile_info()
      return Response({'profile_info': profile_info})
    else:
      return Response(status=400)
  
  def post(self, request):
    anonymousStatus = request.data.get('anonymousStatus') == 'true'
    if anonymousStatus:
        request.user.profile_picture = 'default.png'
        request.user.save()
    data = request.data.copy()
    data.pop('anonymousStatus')
    serializer = UpdateInfoSerializer(instance=request.user, data=data)
    if 'profile-pic' in request.FILES and not anonymousStatus:
        if request.user.profile_picture.name != 'default.png':
          request.user.profile_picture.delete()
        uploaded_file = request.FILES['profile-pic']
        request.user.profile_picture = uploaded_file
        request.user.save()
    if serializer.is_valid():
        serializer.save()
        return Response({'status': "succes", 'id': request.user.id, 'serializer': serializer.data, 'msg_code': "successfulModifyInfo"}, status=200)
    first_error = next(iter(serializer.errors.values()))[0]
    first_error_code = first_error.code
    return Response({'status': "failure", "msg_code": first_error_code})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
def generate_unique_username(request):
    random_word = random.choice(words)
    random_item = random.choice(items)
    username = random_word + random_item
    nbrUser = User.objects.all().count()
    for i in range(nbrUser + 1):
        if not User.objects.filter(username=username).exists():
            return Response({'username': username}, status=200)
        else:
            random_word = random.choice(words)
            random_item = random.choice(items)
            username = random_word + random_item
    for i in range(nbrUser + 1):
        username = f"anonymous{i}"
        if not User.objects.filter(username=username).exists():
            return Response({'username': username}, status=200)
    return Response(status=400)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def delete_account(request):
  request.user.delete()
  return Response({'status' : "success"})
