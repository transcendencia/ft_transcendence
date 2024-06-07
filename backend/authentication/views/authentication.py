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
from ..serializers import UserSerializer, SignupSerializer

from django.shortcuts import redirect

def index(request):
  return render(request, 'index.html')

# cree un loginForm pour rendre le code plus clair
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
      # if user.status != 'online':
        token, created = Token.objects.get_or_create(user=user)
        if languageClicked and new_language != user.language:
            user.language = new_language
        user.last_login_date = timezone.now()
        user.status = 'online'
        user.is_host = True
        user.save()
        return  Response({'status': "succes", 'token': token.key, 'language': user.language, 'id': user.id, 'graphic_mode': user.graphic_mode, 'message': "You are now logged in!\nPress [E] to enter the galaxy"})
      # else:
        # return Response({'status': "failure", 'message': "User already logged in"})
    else:
      return  Response({'status': "failure", 'message': "Username and/or password invalid"})
  except Exception as e:
      print(str(e))
      return Response({'status': "error", 'message': str(e)})


@api_view(['POST']) 
@permission_classes([AllowAny])  
def signup(request):
  new_language = request.POST.get("language") #on valide ?

  serializer = SignupSerializer(data=request.data)
  if serializer.is_valid():
    user_data = serializer.validated_data
    user = User(username=user_data['username'], language=new_language)
    user.set_password(user_data['password'])
    user.save()
    return Response({'status': "success", "message": "User created You may now log in", "msg_code": "successfulSignup"}, status=status.HTTP_200_OK)
  # irst_error_field = next(iter(serializer.errors))
    # first_error_message = serializer.errors[first_error_field][0]
  first_error = next(iter(serializer.errors.values()))[0]
  # print(serializer.errors.values())
  first_error_field = next(iter(serializer.errors))  # Récupère le premier champ avec une erreur
  # first_error_message = serializer.errors[first_error_field][0]  # Récupère le premier message d'erreur
  first_error_code = first_error.code 
  print(first_error_code)
  return Response({'status': "failure", "message": first_error})
