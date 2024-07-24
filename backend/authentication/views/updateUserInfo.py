import os

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.decorators import api_view, authentication_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework import status

from ..models import User
from ..serializers import UpdateInfoSerializer
from ..utils.constants import UserStatus
from .words import words, items

import random

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
      user = get_object_or_404(User, id=userId)
      return Response({'user_status': user.status}, status=status.HTTP_200_OK)

class UserInfoView(APIView):
  authentication_classes = [TokenAuthentication]

  def get(self, request, userId):
    user = get_object_or_404(User, id=userId)
    profile_info = user.get_profile_info()
    return Response({'profile_info': profile_info})
  
  def post(self, request):
    anonymousStatus = request.data.get('anonymousStatus') == 'true'
    
    data = request.data.copy()
    data.pop('anonymousStatus')
    serializer = UpdateInfoSerializer(instance=request.user, data=data)
    
    if anonymousStatus and request.user.profile_picture.name != 'default.png':
        request.user.profile_picture = 'default.png'
        request.user.save()
        request.user.profile_picture.delete()
    elif 'profile-pic' in request.FILES and not anonymousStatus:
        if request.user.profile_picture.name != 'default.png':
          request.user.profile_picture.delete()
        uploaded_file = request.FILES['profile-pic']
        request.user.profile_picture = uploaded_file
        request.user.save()
    
    if serializer.is_valid():
        serializer.save()
        return Response({'status': "succes", 'id': request.user.id, 'serializer': serializer.data, 'msg_code': "successfulModifyInfo"}, status=status.HTTP_200_OK)
    
    first_error = next(iter(serializer.errors.values()))[0]
    first_error_code = first_error.code
    return Response({'status': "failure", "msg_code": first_error_code}, status=status.HTTP_400_BAD_REQUEST)

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
            return Response({'username': username}, status=status.HTTP_200_OK)
    return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
def delete_account(request):
  request.user.delete()
  return Response({'status' : "success"})
