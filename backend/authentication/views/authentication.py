import logging

from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from django.utils import timezone
from django.template.response import TemplateResponse

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response

from ..models import User
from ..serializers import UserSerializer, SignupSerializer

logger = logging.getLogger(__name__)

def index(request):
  return render(request, 'index.html')

#to move 
def rgpd(request):
  return render(request, 'rgpd.html')

@api_view(['POST'])
@permission_classes([AllowAny])
def login_page(request):
  try:
    print(request.data)
    username = request.POST.get("username")
    usernameLower = username.lower()
    password = request.POST.get("password")
    isHostLoggedIn = request.POST.get("hostLoggedIn") == 'true'
    if isHostLoggedIn == False:
      newLanguage = request.POST.get("language")
      isLanguageClicked = request.POST.get("languageClicked") == 'true'
    else:
      isLanguageClicked = 'false'
      newLanguage = None

    logger.debug(f'Username received: {usernameLower}, Host logged in: {isHostLoggedIn}')

    user = authenticate(username=usernameLower, password=password)
    if user is not None:
      print("user status in login:", user.status)
      if user.status == "offline":
        updateUserLogin(user, isHostLoggedIn, isLanguageClicked, newLanguage)

        token, created = Token.objects.get_or_create(user=user)

        return Response({
          'status': "succes", 
          'token': token.key, 
          'msg_code': "loginSuccessful",
          'language': user.language, 
          'id': user.id, 
          'graphic_mode': user.graphic_mode})
      else:
        return Response({'status': "failure", 'msg_code': "userAlreadyLoggedIn"})
    else:
      return  Response({'status': "failure", 'msg_code': "loginFailed"})
  except Exception as e:
      print(str(e))
      logger.error(f'An error occurred: {str(e)}')
      return Response({'status': "error", 'message': str(e)})

def updateUserLogin(user, isHostLoggedIn, isLanguageClicked, newLanguage):
    user.last_login_date = timezone.now()
    user.status = 'online'
    logger.debug(f'IsHostLoggedIn: {isHostLoggedIn}')
    if isHostLoggedIn == False:
        user.is_host = True
        if isLanguageClicked and newLanguage != user.language:
            user.language = newLanguage
    user.save()
    logger.debug(f'{user.username} status is {user.status} is host {user.is_host}')


@api_view(['POST']) 
@permission_classes([AllowAny])  
def signup(request):
  new_language = request.POST.get("language")
  serializer = SignupSerializer(data=request.data)

  if serializer.is_valid():
    user_data = serializer.validated_data
    user = User(username=user_data['username'], language=new_language)
    user.set_password(user_data['password'])
    user.save()
    return Response({'status': "success", "msg_code": "successfulSignup"}, status=status.HTTP_200_OK)
  
  first_error = next(iter(serializer.errors.values()))[0]
  first_error_code = first_error.code 
  
  return Response({'status': "failure", "msg_code": first_error_code})
