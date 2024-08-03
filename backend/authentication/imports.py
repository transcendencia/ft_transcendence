import os
import json
import base64
import random

from django.shortcuts import render, get_object_or_404
from django.contrib.auth import authenticate
from django.http import HttpResponse, JsonResponse, Http404, QueryDict
from django.utils import timezone
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError
from django.db.utils import OperationalError, InterfaceError
from django.db.models import Sum, Q
from django.conf import settings

from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import User, FriendRequest, UserStat
from .serializers import UserSerializer, SignupSerializer, UserListSerializer, UpdateInfoSerializer
from .utils.constants import UserStatus, FriendRequestStatus
from .validators import ProfilePictureValidator
from authentication.exceptions import PasswordValidationError