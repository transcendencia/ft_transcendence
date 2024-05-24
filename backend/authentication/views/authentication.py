from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from ..models import User
from ..serializers import UserSerializer, SignupSerializer

def index(request):
  return render(request, 'index.html')

# change user status to online
@api_view(['POST'])
@permission_classes([AllowAny])  
def login_page(request):
  try:
    username = request.POST.get("username")
    password = request.POST.get("password")
    new_language = request.POST.get("language")
    languageClicked = request.POST.get("languageClicked") == 'true'

    user = authenticate(username=username, password=password)
    if user is not None:
      token, created = Token.objects.get_or_create(user=user)
      if languageClicked and new_language != user.language:
          user.language = new_language
          user.save()
      return  Response({'status': "succes", 'token': token.key, 'language': user.language, 'message': "You are now logged in!\nPress [E] to enter a new galaxie"}) #return languages pour mettre a jour currenLanguage00000000000000000
    else:
      print("J'existe pas")
      return  Response({'status': "failure", 'message': "Username and/or password invalid"})
  except Exception as e:
      print(str(e))
      return Response({'status': "error", 'message': str(e)})

#ajouter message d'erreur quand user existe deja
##checker que username pas deja pris
@api_view(['POST'])
@permission_classes([AllowAny])  
def signup(request):
  print("je suis dans sign up")
  print(request.data)
  new_language = request.POST.get("language")

  print(new_language)
  serializer = SignupSerializer(data=request.data)
  if serializer.is_valid():
    user_data = serializer.validated_data
    user = User(username=user_data['username'])
    user.set_password(user_data['password'])
    print(user_data['username'])
    print(user_data['password'])
    print("Utilisateur cree")
    if new_language != user.language:
      print("Je change la langue")
      user.language = new_language
    user.save()
    return Response({"ok": True})
  print(serializer.errors)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_language(request):
  user = request.user

  print(user.username)
  if request.method == 'POST':
    new_language = request.data.get("language")
    print(new_language)
    if new_language != user.language:
      user.language = new_language
      user.save()
      return Response(status=status.HTTP_200_OK)
    else:
      return Response(status=status.HTTP_400_BAD_REQUEST)
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def logout(request):

#change user status to online
#view logout --> bien pense a supprime le token d'authentication dans le local storage

# @api_view(['POST'])
# def update_info(request):