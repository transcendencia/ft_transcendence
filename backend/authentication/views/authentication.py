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
from rest_framework.views import APIView
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.contrib.auth.password_validation import validate_password
from authentication.exceptions import PasswordValidationError
from rest_framework.exceptions import ValidationError

from ..models import User
from ..serializers import UserSerializer, SignupSerializer

logger = logging.getLogger(__name__)

def index(request):
  return render(request, 'index.html')

@api_view(['POST'])
@permission_classes([AllowAny])
def login_page(request):
  try:

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

    if usernameLower == 'bot':
      return Response({'status': "failure", 'msg_code': "loginFailed"})
    print(f'username: {username}, password: {password}')
    user = authenticate(username=usernameLower, password=password)
    if user is not None:
      print(f'status {user.status}')
      if user.status == "offline":
        updateUserLogin(user, isHostLoggedIn, isLanguageClicked, newLanguage)

        token, created = Token.objects.get_or_create(user=user)

        return Response({
          'status': "success", 
          'token': token.key, 
          'msg_code': "loginSuccessful",
          'language': user.language, 
          'id': user.id, 
          'graphic_mode': user.graphic_mode})
      else: 
        print("user already logged in")
        return Response({'status': "failure", 'msg_code': "userAlreadyLoggedIn"})
    else:
      print("login failed")
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
  try:
      new_language = request.POST.get("language")
      serializer = SignupSerializer(data=request.data)

      if serializer.is_valid(raise_exception=True):
          user_data = serializer.validated_data
          user = User(username=user_data['username'], language=new_language)
          user.set_password(user_data['password'])
          user.save()
          logger.debug("User created successfully with username: %s", user.username)
          return Response({"msg_code": "successfulSignup"}, status=status.HTTP_201_CREATED)

  except (ValidationError, PasswordValidationError) as e:
      first_error = next(iter(e.detail.values()))[0]
      first_error_code = getattr(first_error, 'code', 'validationError')
      return Response({"msg_code": first_error_code}, status=status.HTTP_400_BAD_REQUEST)

  except IntegrityError as e:
      return Response({"msg_code": "unique"}, status=status.HTTP_400_BAD_REQUEST)



class LogoutView(APIView):
  authentication_classes = [TokenAuthentication]

  def post(self, request):
    if request.data.get('status') == 'offline' and request.user.is_host:  # a checker
      request.user.is_host = False
    request.user.status = 'offline'
    request.user.save()
    request.user.auth_token.delete()
    print("user status: ", request.user.status)
    return Response({'user_id': request.user.id, 'status': request.user.status}, status=200)
