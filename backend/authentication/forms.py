from django import forms
from .models import Member
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from django.contrib.auth.forms import UserCreationForm

class MemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = ['username', 'position']
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if Member.objects.filter(username=username).exists():
            raise forms.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return username
