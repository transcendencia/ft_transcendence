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

from ..models import User, FriendRequest
from ..serializers import UserSerializer, SignupSerializer

from django.shortcuts import redirect
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from django.db.models import Q
# def	show_friendrequest(request):
# 	return render(request, 'show_friendrequest.html')

def	send_friendrequest(request):
	return render(request, 'send_friendrequest.html')

# @api_view(['POST'])
# @authentication_classes([TokenAuthentication])
# @permission_classes([IsAuthenticated])
# def	send_friend_request(request):
# 	sender = request.user
# 	receiver = User.objects.get(username=request.data.get('receiver_name'))
# 	friend_request, created = FriendRequest.objects.get_or_create(sender=sender, receiver=receiver)
# 	if created:
# 		return Response("friend request sent")
# 	else:
# 		return Response("friend request not sent")


User = get_user_model()

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
#verifier que j'essaie pas de m'envoyer une friend request a moi mm
#verifier qu'une friend request n'existe pas deja entre ces 2 user 

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def	accept_friend_request(request):
	friend_request = FriendRequest.objects.get(id=request.data.get("request_id"))
	# if friend_request.receiver == request.user :
	print(friend_request.sender.username, friend_request.receiver.username)
	friend_request.status = "accepted"
	friend_request.save()
	return Response('friend request accepted')
	# else:
	# 	return Response('friend request not accepted')
#
@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def reject_friend_request(request):
    print("ca degage")
    print(request.data.get("request_id"))
    friend_request = FriendRequest.objects.get(id=request.data.get("request_id"))
    friend_request.delete()
    return Response('friend request rejected')
#verifier que la requete que j'accepte c'est pas moi qui l'est envoyer

def render_request(request):
    return render(request, 'render_request.html')

@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def return_request(request):
    print(request.user.username)
    friend_requests = FriendRequest.objects.filter(Q(receiver=request.user) | Q(sender=request.user))
    print(friend_requests)
    list_request = [{'id': req.id, 'status': req.status, 'sender': req.sender.username, 'receiver': req.receiver.username} for req in friend_requests]
    print(list_request)
    return Response({'list': list_request})
    # return Response({"message": "je suis dans return message"})
