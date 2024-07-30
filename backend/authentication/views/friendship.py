import logging
import os
import json

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse
from django.db import OperationalError
from django.http import Http404
from django.utils.crypto import get_random_string
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from django.db.utils import OperationalError, InterfaceError

from ..models import User, FriendRequest
from ..serializers import UserSerializer, UserListSerializer
from ..utils.constants import FriendRequestStatus
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator

logger = logging.getLogger(__name__)

class FriendRequestView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        if not request.body:
            return Response({'status': "error", 'message': "Request body is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        data = json.loads(request.body)
        if not isinstance(data, dict):
            return Response({'status': "error", 'message': "Request body must be a JSON object"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            sender = request.user

            receiver_id = data.get('receiver_id')
            if receiver_id is None:
                return Response({'message': "Receiver ID is required"}, status=status.HTTP_400_BAD_REQUEST)
        
            bot = get_object_or_404(User, username="bot")
            if receiver_id == sender.id or receiver_id == bot.id:
                return Response({'message': "Invalid ID"}, status=status.HTTP_400_BAD_REQUEST)

                receiver = get_object_or_404(User, id=receiver_id)
            friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver)

            logger.info(f"Friend request {'created' if created else 'already exists'} from user {sender.username} to user {receiver.username}")
            return HttpResponse(status=status.HTTP_200_OK)
        
        except  Http404:
            logger.error('Friendrequest not found')
            return Response({'status': "error", 'message': "User not found"}, status=status.HTTP_404_NOT_FOUND)

        except (OperationalError, InterfaceError):
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    def patch(self, request):
        if not request.body:
            logger.error("Request body is empty")
            return Response({'status': "error", 'message': "Request body is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            data = json.loads(request.body)
            if not isinstance(data, dict):
                logger.error("Request body must be a JSON object")
                return Response({'status': "error", 'message': "Request body must be a JSON object"}, status=status.HTTP_400_BAD_REQUEST)

            request_id = data.get("request_id")
            if request_id is None:
                raise ValueError("Request ID is required")
            
            friend_request = get_object_or_404(FriendRequest, id=request_id)
            if request.user.id == friend_request.sender.id:
                raise ValueError("Invalid ID")
                                                                                                  
            friend_request.status = FriendRequestStatus.ACCEPTED
            friend_request.save()
        
            logger.info(f"Friend request from {friend_request.sender.username} accepted by user {request.user.username}")
            return HttpResponse(status=status.HTTP_200_OK)
        
        except  Http404:
            logger.error('Friendrequest not found')
            return Response({'status': "error", 'message': "Friendrequest not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValueError as ve:
            logger.error(f'Value error: {str(ve)}')
            return Response({'status': "error", 'message': str(ve)}, status=status.HTTP_400_BAD_REQUEST)

        except (OperationalError, InterfaceError):
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    def delete(self, request):
        if not request.body:
            logger.error("Request body is empty")
            return Response({'status': "error", 'message': "Request body is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            data = json.loads(request.body)
            if not isinstance(data, dict):
                logger.error("Request body must be a JSON object")
                return Response({'status': "error", 'message': "Request body must be a JSON object"}, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return Response({'status': "error", 'message': "Invalid JSON in request body"}, status=status.HTTP_400_BAD_REQUEST)
        except UnicodeDecodeError:
            return JsonResponse({'message': 'Invalid Unicode in request body.'}, status=400)

        try:
            request_id = data.get("request_id")
            if request_id is None:
                raise ValueError("Request ID is required")

            friend_request = get_object_or_404(FriendRequest, id=request_id)
            if request.user.id == friend_request.sender.id:
                raise ValueError("Invalid ID")

            friend_request.delete()
        
            logger.info(f"Friend request {request_id} deleted by user {request.user.username}")
            return HttpResponse(status=status.HTTP_200_OK)
        
        except Http404:
            logger.error('Friend request not found')
            return Response({'status': "error", 'message': "Friend request not found"}, status=status.HTTP_404_NOT_FOUND)
        
        except ValueError as ve:
            logger.error(f'Value error: {str(ve)}')
            return Response({'status': "error", 'message': str(ve)}, status=status.HTTP_400_BAD_REQUEST)

        except (OperationalError, InterfaceError):
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

class FriendListView(APIView):
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        try:
            friends_requests = FriendRequest.objects.filter(Q(receiver=request.user) | Q(sender=request.user)).select_related('sender', 'receiver')

            received_request_list = []
            friends = []
            sent_request_list = []
            user_in_list = []
            user_not_friend = []
        
            for req in friends_requests:
                if req.status == FriendRequestStatus.PENDING: 
                    if req.receiver == request.user:
                        user = UserListSerializer(req.sender, many=False).data
                        received_request_list.append(self.create_user_pair(req.sender, req.id))
                        user_in_list.append(req.sender.id)
            
                    elif req.sender == request.user:
                        sent_request_list.append(UserListSerializer(req.receiver, many=False).data)
        
                elif req.status == FriendRequestStatus.ACCEPTED:
                    user = req.sender if request.user == req.receiver else req.receiver
                    friends.append(self.create_user_pair(user, req.id))
                    user_in_list.append(user.id) 
    
            other_users = User.objects.exclude(id__in=user_in_list).exclude(id=request.user.id).exclude(username="bot")
            other_users_list = UserListSerializer(other_users, many=True).data
            user_not_friend = other_users_list + [user['user'] for user in received_request_list]

            data = {
                'received_request_list': received_request_list,
                'friends': friends,
                'sent_request_list': sent_request_list,
                'other_user_list': other_users_list,
                'user_not_friend': user_not_friend,
                'bot': self.get_or_create_bot()
            }

            return JsonResponse(data, status=status.HTTP_200_OK)
        
        except (OperationalError, InterfaceError):
            return Response({'message': 'Database connection error'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    def create_user_pair(self, user, request_id):
        return {
            'user': UserListSerializer(user).data,
            'request_id': request_id,
        }
    
    def get_or_create_bot(self):
        try:
            characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*(-_=+)'
            bot_password = get_random_string(8, characters)
            bot, _ = User.objects.get_or_create(username="bot")
            bot.set_password(bot_password)
            return UserSerializer(bot).data
        
        except OperationalError as e:
            logger.error(f'An error occurred: {str(e)}')
            return HttpResponse(status=status.HTTP_503_SERVICE_UNAVAILABLE)