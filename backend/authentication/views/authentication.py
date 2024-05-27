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


# --------------- TEST PROFILE PICTURE -----------------------
def render_profile(request):
  return render(request, 'profile_picture.html')

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def user_profile(request):
    user_profile_data = {
        'profile_pic_url': request.user.profile_picture.url
    }
    return JsonResponse(user_profile_data)

def render_change_picture(request):
  return render(request, 'upload_img.html')

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_profile_picture(request):
    if 'file' in request.FILES:
        uploaded_file = request.FILES['file']
        request.user.profile_picture = uploaded_file
        request.user.save()
        print("picture changed") #LOG
        return Response(status=status.HTTP_200_OK)
    else:
        return Response(request, status=status.HTTP_400_BAD_REQUEST)
# --------------------------------------------------------------


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
          print("Je change la langue") #LOG
          user.language = new_language
      user.last_login_date = timezone.now()
      user.status = 'online'
      print(user.last_login_date, user.status)
      user.save()
      return  Response({'status': "succes", 'token': token.key, 'language': user.language, 'message': "You are now logged in!\nPress [E] to enter the galaxy"})
    else:
      print("J'existe pas") #LOG
      return  Response({'status': "failure", 'message': "Username and/or password invalid"})
  except Exception as e:
      print(str(e))
      return Response({'status': "error", 'message': str(e)})

#ajouter message d'erreur quand user existe deja
##checker que username pas deja pris
@api_view(['POST']) 
@permission_classes([AllowAny])  
def signup(request):
  print("je suis dans sign up", request.data) #LOG
  new_language = request.POST.get("language")

  print(new_language) #LOG
  serializer = SignupSerializer(data=request.data)
  if serializer.is_valid():
    user_data = serializer.validated_data
    user = User(username=user_data['username'], language=new_language)
    user.set_password(user_data['password'])
    print(user_data['username'], user_data['password'], user.status, "Utilisateur cree") #LOG
    user.save()
    return Response({'status': "success", "message": "User created"}, status=status.HTTP_200_OK)
  first_error = next(iter(serializer.errors.values()))[0]
  print(first_error)
  return Response({'status': "failure", "message": first_error})

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def change_language(request):
  user = request.user

  print(user.username)
  if request.method == 'POST':
    new_language = request.data.get("language")
    print(new_language) #LOG
    if new_language != user.language:
      user.language = new_language
      user.save()
      return Response(status=status.HTTP_200_OK)
    else:
      return Response(status=status.HTTP_400_BAD_REQUEST)
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_status(request):
  if request.method == 'POST':
    request.user.status = request.data.get('status')
    request.user.save()
    print(request.user.username, request.user.status) #LOG
    return Response(status=status.HTTP_200_OK)
  else:
    return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_status(request):
  user = request.user
  return Response({'status': user.status}, status=status.HTTP_200_OK)

