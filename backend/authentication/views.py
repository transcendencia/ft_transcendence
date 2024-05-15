from django.shortcuts import render
from django.contrib.auth import login, authenticate
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
from django.http import JsonResponse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token

from . import forms
from .models import Member, User
from .forms import MemberForm
from .serializers import UserSerializer

def index(request):
  return render(request, 'index.html')

@api_view(['POST'])
def login_page(request):
  try:
    username = request.POST.get("username")
    password = request.POST.get("password")
  
    user = authenticate(username=username, password=password)
    if user is not None:
      login(request, user)
      token, created = Token.objects.get_or_create(user=user)
      return  Response({'status': "succes", 'token': token.key, 'message': "You are now logged in!\nPress [E] to enter a new galaxie"})
    else:
      return  Response({'status': "failure", 'message': "Username and/or password invalid"})
  except Exception as e:
        return Response({'status': "error", 'message': str(e)})


#Checker validiter de l'username et du password
#ajouter adresse mail
@api_view(['POST'])
@csrf_exempt #NON
def signup(request):
  print("Je suis dans le sign up form")
  serializer = UserSerializer(data=request.data)
  if serializer.is_valid():
    serializer.save()
    user = User.objects.get(username=request.data['username'])
    user.set_password(request.data['password']) #allows us to store an ash password
    user.save()
    token = Token.objects.create(user=user)
    return Response({"token": token.key, "user": serializer.data})
  return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#view logout --> bien pense a supprime le token d'authentication

@api_view(['GET'])
def check_auth(request):
    # username = request.GET.get("username")
    # password = request.GET.get("password")
    
    # print(username)
    # print(password)
    # if not (username and password):
    #     return JsonResponse({'authenticated': False})
    if request.user.is_authenticated:
        print("User authentifier")
        return JsonResponse({'authenticated': True})
    else:
        print("USer pas authentifier")
        return JsonResponse({'authenticated': False})

# def signup_page(request):
#     form = forms.SignupForm()
#     if request.method == 'POST':
#         form = forms.SignupForm(request.POST)
#         if form.is_valid():
#             user = form.save()
#             login(request, user)
#             return redirect(settings.LOGIN_REDIRECT_URL)
#     return render(request, 'authentication/signup.html', context={'form': form})


def add_member(request):
  if request.method == 'POST':
    request.POST._mutable = True
    request.POST['position'] = 0
    form = MemberForm(request.POST)
    if form.is_valid():
      form.save()
  else:
    form = MemberForm()
  return render(request, 'addPlayer.html', {'form': form})

def result(request):
  mymembers = Member.objects.all().values()
  template = loader.get_template('newTournament.html')
  context = {
    'mymembers': mymembers,
  }
  return HttpResponse(template.render(context, request))

def details(request, id):
  mymembers = Member.objects.get(id=id)
  template = loader.get_template('details.html')
  context = {
    'mymembers': mymembers,
  }
  return HttpResponse(template.render(context, request))

def main(request):
  template = loader.get_template('main.html')
  return HttpResponse(template.render())

def testing(request):
  mymembers = Member.objects.all().values()
  template = loader.get_template('template.html')
  context = {
    'mymembers': mymembers,
  }
  return HttpResponse(template.render(context, request))