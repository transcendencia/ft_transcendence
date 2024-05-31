from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
from django.http import JsonResponse
from django.utils import timezone
from django.template.response import TemplateResponse

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from ..models import User
from ..serializers import UserSerializer, SignupSerializer, UpdateInfoSerializer, UserListSerializer

from django.shortcuts import redirect

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
      return Response({'user_id': user.id, 'languages': user.language}, status=status.HTTP_200_OK)
    else:
      return Response(status=status.HTTP_400_BAD_REQUEST)
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

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
    return Response({'user_id': request.user.id, 'status': request.user.status}, status=status.HTTP_200_OK)
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_status(request):
  user = request.user
  return Response({'status': user.status}, status=status.HTTP_200_OK)

def render_change_profile_info(request):
  print("j'affiche le html pour changer les info du user")
  return render(request, 'change_profile_info.html')

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
      return Response(status=status.HTTP_400_BAD_REQUEST)
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def	change_profile_info(request):
	serializer = UpdateInfoSerializer(instance=request.user, data=request.data)
	if 'profile-pic' in request.FILES:
		uploaded_file = request.FILES['profile-pic']
		request.user.profile_picture = uploaded_file
		request.user.save()
		print("picture changed") #LOG
	if serializer.is_valid():
		serializer.save()
		return Response({'id': request.user.id, 'serializer': serializer, 'message': "info changer"}, status=status.HTTP_200_OK)
	first_error = next(iter(serializer.errors.values()))[0]
	print(first_error)
	return Response({"message": first_error})

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
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
