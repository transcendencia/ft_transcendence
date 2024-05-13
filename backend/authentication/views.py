from django.shortcuts import render
from django.contrib.auth import login, authenticate
from . import forms
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from .models import Member
from .forms import MemberForm
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
import json
from django.http import JsonResponse

def index(request):
  return render(request, 'index.html')

# def signup_page_render(request):
#   return render(request, 'signup.html')

# @csrf_protect
def login_page(request):
    if request.method == 'POST':
        username = request.POST.get("username")
        password = request.POST.get("password")
        
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            return  JsonResponse({'status': "succes", 'message': "You are now logged in!\nPress [E] to enter a new galaxie"})
        else:
            return  JsonResponse({'status': "failure", 'message': "Username and/or password invalid"})
    else:
      return JsonResponse({'error': 'Méthode non autorisée'}, status=405)

def check_auth(request):
    if request.user.is_authenticated:
        print("User authentifier")
        return JsonResponse({'ok': True})
    else:
        print("USer pas authentifier")
        return JsonResponse({'ok': False})

def signup_page(request):
    form = forms.SignupForm()
    if request.method == 'POST':
        form = forms.SignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect(settings.LOGIN_REDIRECT_URL)
    return render(request, 'authentication/signup.html', context={'form': form})


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