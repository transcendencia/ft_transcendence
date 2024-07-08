from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response

from ..models import User, FriendRequest
from ..serializers import UserSerializer, SignupSerializer, UserListSerializer

# #verifier qu'une friend request n'existe pas deja entre ces 2 user 
# #Return erreur si la friend request existe pas
class FriendRequestView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    print("I'm in the friend request ")
    def post(self, request):
        sender = request.user
        receiver_id = request.data.get('receiver_id')
        try:
            receiver = User.objects.get(id=receiver_id)
        except User.DoesNotExist:
            raise ValidationError("Receiver user does not exist")

        if receiver == sender:
            raise ValidationError("Cannot send friend request to yourself")

        friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver)

        if created:
            response = "Friend request sent"
        else:
            response = "Friend request not sent (already exists)"
        
        return Response({'message': response})

    def put(self, request):
        try:
            friend_request = FriendRequest.objects.get(id=request.data.get("request_id"))
        except FriendRequest.DoesNotExist:
            return Response({'message': 'Friend request does not exist'}, status=400)

        if friend_request.sender == request.user:
            return Response('You cannot accept the invite if you are the sender', status=400)
        
        friend_request.status = "accepted"
        friend_request.save()
        
        return Response('Friend request accepted')

    def delete(self, request):
        try:
            friend_request = FriendRequest.objects.get(id=request.data.get("request_id"))
        except FriendRequest.DoesNotExist:
            return Response({'message': 'Friend request does not exist'}, status=400)

        # if friend_request.sender == request.user:
        #     return Response('You cannot reject a request that you sent', status=400)
        
        friend_request.delete()
        
        return Response({'status': "success"})


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def return_friends_list(request):
    friends_requests = FriendRequest.objects.filter(Q(receiver=request.user) | Q(sender=request.user))

    received_request_list = []
    user_in_received_request_list = []
    friends = []
    sent_request_list = []
    user_in_list = []
    user_not_friend = []

    for req in friends_requests:
        if req.status == 'pending' and req.receiver == request.user:
            user = UserListSerializer(req.sender, many=False).data
            user_pair = { 
                'user' : user,
                'request_id' : req.id,
            }
            user_in_received_request_list.append(user)
            received_request_list.append(user_pair)
            user_in_received_request_list.append(user)
            user_in_list.append(req.sender.id)
        
        if req.status == 'accepted' and (req.receiver == request.user or req.sender == request.user):
            if request.user == req.receiver:
                user_pair = { 
                    'user' : UserListSerializer(req.sender, many=False).data,
                    'request_id' : req.id,
                }
                user_in_list.append(req.sender.id)
            if request.user == req.sender:
                user_pair = { 
                    'user' : UserListSerializer(req.receiver, many=False).data,
                    'request_id' : req.id,
                }
                user_in_list.append(req.receiver.id)
            friends.append(user_pair)

        if req.status == 'pending' and req.sender == request.user:
            sent_request_list.append(UserListSerializer(req.receiver, many=False).data)
    
    all_users = User.objects.exclude(id__in=user_in_list).exclude(id=request.user.id).exclude(username="bot")
    other_user_list = UserListSerializer(all_users, many=True).data
    user_not_friend = other_user_list + user_in_received_request_list
   # A tester
    try:
        bot = UserSerializer(User.objects.get(username="bot")).data
    except User.DoesNotExist:
        bot = UserSerializer(User.objects.create_user(username="bot", password="bot1234")).data

    # bot = UserSerializer(User.objects.get(username="bot")).data
    
    # print(received_request_list)
    print(friends)  
    return Response({
        'received_request_list': received_request_list, 
        'friends': friends, 
        'sent_request_list': sent_request_list, 
        'other_user_list': other_user_list, 
        'user_not_friend': user_not_friend, 
        'bot': bot})