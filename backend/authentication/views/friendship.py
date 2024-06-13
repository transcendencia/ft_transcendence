from django.shortcuts import render
from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from django.db.models import Q

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

def	send_friendrequest(request):
	return render(request, 'send_friendrequest.html')

User = get_user_model() #J'en ai vrmt besoin??

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    if request.method == 'POST':
        sender = request.user
        receiver_name = request.data.get('receiver_name')
        try:
            receiver = User.objects.get(username=receiver_name)
        except User.DoesNotExist:
            raise ValidationError("Receiver user does not exist")

        if receiver == sender:
            raise ValidationError("Cannot send friend request to yourself")

        print(sender.username, receiver.username)
        friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver)

        if created:
            print("Friend request send")
            response = "Friend request sent"
        else:
            response = "Friend request not sent (already exists)"
    else:
        response = None
    
    return Response({'message': response})
#verifier qu'une friend request n'existe pas deja entre ces 2 user 

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def	accept_friend_request(request):
	friend_request = FriendRequest.objects.get(id=request.data.get("request_id"))
	if friend_request.sender == request.user:
		return Response('You cannot accept the invite if you are the sender')
	friend_request.status = "accepted"
	friend_request.save()
	return Response('friend request accepted')


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def reject_friend_request(request):
    friend_request = FriendRequest.objects.get(id=request.data.get("request_id"))
    friend_request.delete()
    
    return Response({'status' : "success"})
#verifier que la requete que j'accepte c'est pas moi qui l'est envoyer

def render_request(request):
    return render(request, 'render_request.html')

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def return_request(request):
    friend_requests = FriendRequest.objects.filter(Q(receiver=request.user) | Q(sender=request.user))
    list_request = [{'id': req.id, 'status': req.status, 'sender': req.sender.username, 'receiver': req.receiver.username} for req in friend_requests]

    return Response({'list': list_request})

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def return_friends_list(request):
    friends_requests = FriendRequest.objects.filter(Q(receiver=request.user) | Q(sender=request.user))
    print("je suis dans return friend list")
    received_request_list = []
    friends = []
    sent_request_list = []
    user_in_list = []
    user_not_friend = []

    for req in friends_requests:
        if req.status == 'pending' and req.receiver == request.user:
            user_pair = { 
                'user' : UserListSerializer(req.sender, many=False).data,
                'request_id' : req.id,
            }
            received_request_list.append(user_pair)
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
    print(other_user_list)
    # user_not_friend = other_user_list + received_request_list + User.object.get(username="bot")
    # additional_user = User.objects.get(username="extra_user")

    user_not_friend = other_user_list + received_request_list
    bot = UserSerializer(User.objects.get(username="bot")).data
    return Response({'received_request_list': received_request_list, 'friends': friends, 'sent_request_list': sent_request_list, 'other_user_list': other_user_list, 'user_not_friend': user_not_friend, 'bot': bot})