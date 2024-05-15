from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
from django.http import JsonResponse

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated

from ..models import User
from ..serializers import UserSerializer

def index(request):
  return render(request, 'index.html')

@api_view(['POST'])
@permission_classes([AllowAny])  
def login_page(request):
  try:
    username = request.POST.get("username")
    password = request.POST.get("password")
  
    user = authenticate(username=username, password=password)
    if user is not None:
      # login(request, user)
      token, created = Token.objects.get_or_create(user=user)
      return  Response({'status': "succes", 'token': token.key, 'message': "You are now logged in!\nPress [E] to enter a new galaxie"})
    else:
      return  Response({'status': "failure", 'message': "Username and/or password invalid"})
  except Exception as e:
        return Response({'status': "error", 'message': str(e)})

#ajouter adresse mail
#ajouter message d'erreur quand user existe deja
@api_view(['POST'])
@permission_classes([AllowAny])  
def signup(request):
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    user = User.objects.get(username=request.data['username'])
    user.set_password(request.data['password'])
    user.save()
    return Response({"ok": True, "user": serializer.data})
  print(serializer.errors)
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# @api_view(['POST'])
# @permission_classes([IsAuthenticated])
# def logout(request):

#view logout --> bien pense a supprime le token d'authentication dans le local storage
