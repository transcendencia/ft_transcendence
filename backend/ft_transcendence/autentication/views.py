from django.shortcuts import render
from . import forms
# from django.http import HttpResponse

# def hello(request):
# 	return render(request, 'autentication/hello.html')

from django.contrib.auth import login, authenticate

def login_page(request):
	form = forms.LoginForm()
	message = ''
	if request.method == 'POST':
		form = forms.LoginForm(request.POST)
		if form.is_valid():
			user = authenticate(
				username=form.cleaned_data['username'],
				password=form.cleaned_data['password'],
			)
			if user is not None:
				login(request, user)
				message = f'Bonjour, {user.username}! Vous êtes connecté.'
			else:
				message = 'Identifiants invalides.'
	return render(
		request, 'autentication/login.html', context={'form': form, 'message': message})