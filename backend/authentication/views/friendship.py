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

def send_friend_request(request):
	user = request.user
	if request.method == 'POST':
		receiver_id = request.POST.get("receiver_id")
		if receiver_id:
			receiver = User.objects.get(pk=receiver_id)
			try:
				friend_requests = FriendRequest.objects.filter(sender=user, receiver=receiver)
				try :
					for request in friend_requests:
						if request.is_active:
							raise Exception("You already send a friend request")
					friend_request = FriendRequest(sender=user, receiver=receiver)
					friend_request.save()
					return Response({'message': "Friend request send"})
				except Exception as e:
					return