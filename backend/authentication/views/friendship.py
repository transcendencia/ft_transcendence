import logging

from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse

from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes
from rest_framework import status
from rest_framework.authentication import TokenAuthentication

from ..models import User, FriendRequest
from ..serializers import UserSerializer, UserListSerializer
from ..utils.constants import FriendRequestStatus
from django.views.decorators.cache import never_cache
from django.utils.decorators import method_decorator

logger = logging.getLogger(__name__)

class FriendRequestView(APIView):
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        try:
            sender = request.user
            receiver = get_object_or_404(User, id=request.data.get('receiver_id'))
            friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver)

            logger.info(f"Friend request {'created' if created else 'already exists'} from user {sender.username} to user {receiver.username}")
            return HttpResponse(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f'An error occurred: {str(e)}')
            return Response({'status': "error", 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def patch(self, request):
        try:
            friend_request = get_object_or_404(FriendRequest, id=request.data.get("request_id"))
            friend_request.status = FriendRequestStatus.ACCEPTED
            friend_request.save()
        
            logger.info(f"Friend request from {friend_request.sender.username} accepted by user {request.user.username}")
            return HttpResponse(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f'An error occurred: {str(e)}')
            return Response({'status': "error", 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def delete(self, request):
        try:
            friend_request = get_object_or_404(FriendRequest, id=request.data.get("request_id"))
            friend_request.delete()
        
            logger.info(f"Friend request {friend_request.id} deleted by user {request.user.username}")
            return HttpResponse(status=status.HTTP_200_OK)
        
        except Exception as e:
            logger.error(f'An error occurred: {str(e)}')
            return Response({'status': "error", 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        except Exception as e:
            logger.error(f'An error occurred: {str(e)}')
            return Response({'status': "error", 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def create_user_pair(self, user, request_id):
        return {
            'user': UserListSerializer(user).data,
            'request_id': request_id,
        }
    
    def get_or_create_bot(self):
        try:
            bot, _ = User.objects.get_or_create(username="bot", defaults={'password': 'bot1234'})
            return UserSerializer(bot).data
        
        except Exception as e:
            logger.error(f'An error occurred: {str(e)}')
            return Response({'status': "error", 'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)