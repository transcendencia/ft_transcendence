from django.shortcuts import render
from django.contrib.auth import authenticate
from django.http import HttpResponse
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.db import OperationalError, InterfaceError

from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError

from ..models import User
from ..serializers import UserSerializer, SignupSerializer
from ..utils.constants import UserStatus
from authentication.exceptions import PasswordValidationError

def index(request):
  return render(request, 'index.html')

@api_view(['POST'])
@permission_classes([AllowAny])
def login_page(request):
    username = request.POST.get("username")
    password = request.POST.get("password")

    if not username or not password:
      return Response({'msg_code': "loginFailed"}, status=status.HTTP_400_BAD_REQUEST)

    usernameLower = username.lower()
    isHostLoggedIn = request.POST.get("hostLoggedIn") == 'true'
    newLanguage = getLanguage(request.POST.get("language")) if not isHostLoggedIn else None
    isLanguageClicked = request.POST.get("languageClicked") == 'true' if not isHostLoggedIn else False
    
    if usernameLower == 'bot':
      return Response({'msg_code': "loginFailed"}, status=status.HTTP_400_BAD_REQUEST)
    logging.info(f'Username: {user.username}, Status: {user.status}')
    try:
      user = authenticate(username=usernameLower, password=password)
      if user is None:
        return  Response({'msg_code': "loginFailed"}, status=status.HTTP_401_UNAUTHORIZED)


      if user.status != UserStatus.OFFLINE:
        return Response({'msg_code': "userAlreadyLoggedIn"}, status=status.HTTP_409_CONFLICT)
        
      updateUserLogin(user, isHostLoggedIn, isLanguageClicked, newLanguage)
      token, _ = Token.objects.get_or_create(user=user)
    
      return Response({
          'token': token.key, 
          'msg_code': "loginSuccessful",
          'language': user.language, 
          'id': user.id, 
          'graphic_mode': user.graphic_mode}, status=status.HTTP_200_OK)
  
    except (OperationalError, InterfaceError):
      return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

def updateUserLogin(user, isHostLoggedIn, isLanguageClicked, newLanguage):
    
    user.last_login_date = timezone.now()
    user.status = UserStatus.ONLINE
    
    try:
      if isHostLoggedIn == False:
          user.is_host = True
          if isLanguageClicked and newLanguage != user.language:
              user.language = newLanguage
      user.save()
    
    except (OperationalError, InterfaceError):
      return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
  
  new_language = getLanguage(request.POST.get("language", "en"))
  
  try:
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
      user_data = serializer.validated_data
      user = User(username=user_data['username'], language=new_language)
      user.set_password(user_data['password'])
      user.save()
      return Response({"msg_code": "successfulSignup"}, status=status.HTTP_201_CREATED)

  except (ValidationError, PasswordValidationError) as e:
    first_error = next(iter(e.detail.values()))[0]
    first_error_code = getattr(first_error, 'code', 'validationError')
    return Response({"msg_code": first_error_code}, status=status.HTTP_400_BAD_REQUEST)

  except (OperationalError, InterfaceError):
      return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


def getLanguage(language):
  if language == "fr":
    return "fr"
  elif language == "es":
    return "es"
  else:
    return "en"

class LogoutView(APIView):
  authentication_classes = [TokenAuthentication]

  def post(self, request):
    try:
      if request.user.is_host: 
        request.user.is_host = False
      request.user.status = UserStatus.OFFLINE
      request.user.save()
      request.user.auth_token.delete()

      return HttpResponse(status=status.HTTP_200_OK)
    
    except (OperationalError, InterfaceError):
      return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
