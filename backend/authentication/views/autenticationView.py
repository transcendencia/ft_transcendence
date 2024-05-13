from django.shortcuts import render
from django.contrib.auth import login, authenticate
from . import forms
from django.views.decorators.csrf import (csrf_protect, csrf_exempt)
import json
from django.http import JsonResponse

def index(request):
  return render(request, 'index.html')

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