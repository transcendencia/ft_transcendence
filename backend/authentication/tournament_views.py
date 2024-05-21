from django.shortcuts import render
from django.contrib.auth import login, authenticate
from . import forms
from django.http import HttpResponse
from django.template import loader
from django.shortcuts import render, redirect
from .models import Member
from .forms import MemberForm

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