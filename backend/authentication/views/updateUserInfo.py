import os
import json
import base64
from django.conf import settings

from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from django.http import Http404, QueryDict
from django.conf import settings
from django.core.files.images import get_image_dimensions
from PIL import Image
from django.core.exceptions import ValidationError
from django.db import OperationalError

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
from ..validators import ProfilePictureValidator
from django.db import OperationalError, InterfaceError

import random
import json

class UserGraphicModeView(APIView):
  authentication_classes = [TokenAuthentication]

  def patch(self, request):
    if not request.body:
      return Response({'message': "Request body is empty"}, status=status.HTTP_400_BAD_REQUEST)

    try:
      data = json.loads(request.body)
      if not isinstance(data, dict):
            return JsonResponse({'message': 'Invalid JSON format. Please send data in JSON format.'}, status=415)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON format. Please send data in JSON format.'}, status=415)
    except UnicodeDecodeError:
        return JsonResponse({'message': 'Invalid Unicode in request body.'}, status=400)

    newGraphicMode = data.get('graphicMode')
    if newGraphicMode is None:
      return Response({'message': "Graphic mode required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if newGraphicMode not in ["low", "medium", "high"]:
        return Response({'message': "Invalid graphic mode."}, status=status.HTTP_400_BAD_REQUEST)

    try:
      request.user.graphic_mode = newGraphicMode
      request.user.save()
      return HttpResponse(status=status.HTTP_200_OK)
    
    except (OperationalError, InterfaceError):
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class UserLanguageView(APIView):
  authentication_classes = [TokenAuthentication]
  
  def patch(self, request):
    if not request.body:
      return Response({'message': "Request body is empty"}, status=status.HTTP_400_BAD_REQUEST)

    try:
      data = json.loads(request.body)
      if not isinstance(data, dict):
            return JsonResponse({'message': 'Invalid JSON format. Please send data in JSON format.'}, status=415)
    except json.JSONDecodeError:
        return JsonResponse({'message': 'Invalid JSON format. Please send data in JSON format.'}, status=415)
    except UnicodeDecodeError:
        return JsonResponse({'message': 'Invalid Unicode in request body.'}, status=400)

    newLanguage = data.get('language')
    if newLanguage is None:
      return Response({'message': "Language is required"}, status=status.HTTP_400_BAD_REQUEST)
    
    if newLanguage not in ["es1", "en1", "fr1"]:
        return Response({'message': "Invalid language."}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
      user = request.user
      user.language = newLanguage
      user.save()
      return HttpResponse(status=status.HTTP_200_OK)
    
    except (OperationalError, InterfaceError):
      return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class UserStatusView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({'message': 'Invalid JSON format. Please send data in JSON format.'}, status=415)
        except UnicodeDecodeError:
            return JsonResponse({'message': 'Invalid Unicode in request body.'}, status=400)

        try:
            new_status = data.get('status')
            if new_status is None:
                return Response({'message': 'Status is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            valid_statuses = ['in_game', 'offline', 'online']
            if new_status not in valid_statuses:
                return Response({'message': f'Status must be one of {valid_statuses}'}, status=status.HTTP_400_BAD_REQUEST)

            request.user.status = new_status
            request.user.save()
            return Response({'message': 'Status updated successfully'}, status=status.HTTP_200_OK)
        except AttributeError:
            return Response({'message': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)
        except (OperationalError, InterfaceError) as e:
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    def get(self, request, userId=None):
        if userId is None:
            return Response({'message': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            userId = int(userId)
        except ValueError:
            return Response({'message': 'Invalid User ID format'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = get_object_or_404(User, id=userId)
            return Response({'user_status': user.status}, status=status.HTTP_200_OK)
        except Http404:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except (OperationalError, InterfaceError) as e:
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class UserInfoView(APIView):
  authentication_classes = [TokenAuthentication]

  def get(self, request, userId=None):
    if userId is None:
      return Response({'message': 'User ID is required'}, status=status.HTTP_400_BAD_REQUEST)

    try:
      user = get_object_or_404(User, id=userId)
      profile_info = user.get_profile_info()
      if profile_info['profile_picture'] and not settings.DEBUG:
        try:
          with open(os.path.join(settings.MEDIA_ROOT, user.profile_picture.name), 'rb') as img_file:
              profile_info['profile_picture'] = base64.b64encode(img_file.read()).decode('utf-8')
        except FileNotFoundError:
            profile_info['profile_picture'] = None
      return Response({'profile_info': profile_info})
    except (OperationalError, InterfaceError) as e:
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
  
  def post(self, request):
    content_type = request.META.get('CONTENT_TYPE', '')
    if not content_type.startswith('multipart/form-data'):
      return Response({'error': 'Unsupported Media Type'}, status=415)

    anonymousStatus = request.data.get('anonymousStatus') == 'true'

    try:
      if 'profile-pic' in request.FILES and not anonymousStatus:
        validator = ProfilePictureValidator(request.FILES['profile-pic'])
        validator.validate()
    except ValidationError as e:
        return Response({"msg_code": e}, status=status.HTTP_400_BAD_REQUEST)
    
    request.data._mutable = True

    if anonymousStatus:
        if 'profile-pic' in request.data:
            request.data.pop('profile-pic')
        if 'alias' in request.data:
            request.data['alias'] = ''
        unique_username_response = generate_unique_username(request)
        if unique_username_response.status_code != status.HTTP_200_OK:
            return unique_username_response
        request.data['username'] = unique_username_response.data['username']

    data = request.data.copy()
    if 'anonymousStatus' in data:
      data.pop('anonymousStatus')
    
    try:
      serializer = UpdateInfoSerializer(instance=request.user, data=data)
      
      if serializer.is_valid():
        self.updateProfilePicture(request, anonymousStatus)
        serializer.save()
        if anonymousStatus:
          request.user.alias = ''
          request.user.save()
        return Response({'id': request.user.id, 'serializer': serializer.data, 'msg_code': "successfulModifyInfo"}, status=status.HTTP_200_OK)
    except (OperationalError, InterfaceError) as e:
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    first_error = next(iter(serializer.errors.values()))[0]
    first_error_code = first_error.code
    return Response({"msg_code": first_error_code}, status=status.HTTP_400_BAD_REQUEST)
  
  def updateProfilePicture(self, request, anonymousStatus):
    try:
      if anonymousStatus and request.user.profile_picture.name != settings.DEFAULT_PROFILE_PICTURE:
          request.user.profile_picture = settings.DEFAULT_PROFILE_PICTURE
          request.user.save()
          if request.user.profile_picture.name != settings.DEFAULT_PROFILE_PICTURE:
            request.user.profile_picture.delete()
      elif 'profile-pic' in request.FILES and not anonymousStatus:
          if request.user.profile_picture.name != settings.DEFAULT_PROFILE_PICTURE:
            request.user.profile_picture.delete()
          uploaded_file = request.FILES['profile-pic']
          request.user.profile_picture = uploaded_file
          request.user.save()
    except (OperationalError, InterfaceError) as e:
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

def generate_unique_username(request):
    random_word = random.choice(words)
    random_item = random.choice(items)
    username = random_word + random_item
    nbrUser = User.objects.all().count()
    for i in range(nbrUser + 1):
        if not User.objects.filter(username=username).exists():
            return Response({'username': username}, status=status.HTTP_200_OK)
        else:
            random_word = random.choice(words)
            random_item = random.choice(items)
            username = random_word + random_item
    for i in range(nbrUser + 1):
        username = f"anonymous{i}"
        if not User.objects.filter(username=username).exists():
            return Response({'username': username}, status=status.HTTP_200_OK)
    return Response({'msg_code': "noRandomUsernameAvailable"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
def delete_account(request):
  try:
    request.user.auth_token.delete()
    request.user.delete()
    return Response({'status' : "success"}, status=status.HTTP_200_OK)
  except (OperationalError, InterfaceError) as e:
            return Response({'status': 'error', 'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
