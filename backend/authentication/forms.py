from django import forms
from .models import Member
from django.db import IntegrityError

class LoginForm(forms.Form):
    username = forms.CharField(max_length=63, label='Nom d’utilisateur')
    password = forms.CharField(max_length=63, widget=forms.PasswordInput, label='Mot de passe')

class MemberForm(forms.ModelForm):
    class Meta:
        model = Member
        fields = ['username', 'position']
    def clean_username(self):
        username = self.cleaned_data.get('username')
        if Member.objects.filter(username=username).exists():
            raise forms.ValidationError("Ce nom d'utilisateur est déjà pris.")
        return username