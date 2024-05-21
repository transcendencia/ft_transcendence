from rest_framework import serializers
from .models import User
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
import logging

class UserSerializer(serializers.ModelSerializer):
	class Meta():
		model = User
		fields = ['username', 'password']

class SignupSerializer(serializers.ModelSerializer):
	confirmation_password = serializers.CharField(write_only=True)

	class Meta():
		model = User
		fields = ['username', 'password', 'confirmation_password']
	
	def validate_password(self, value):
		try:
			validate_password(value)
		except ValidationError as e:
			messages = {
				'password_too_short': "Le mot de passe est trop court.",
				'password_too_common': "Le mot de passe est trop courant.",
				'password_entirely_numeric': "Le mot de passe ne peut pas être entièrement numérique.",
				'password_too_similar': "Le mot de passe est trop similaire à votre nom d'utilisateur.",
				'password_character_requirements': "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial parmi les suivants : ~!@#$%^&*()_+{}\":;'[].",
			}

			logging.error(f"Password validation errors: {e.error_list[0]}")
			logging.error(e.error_list[0].code)
			error_code = e.error_list[0].code if e.error_list else None
			message = messages.get(error_code, "Le mot de passe ne respecte pas les critères de sécurité.")

			raise PasswordValidationError(detail=message)
		return value
	
	def validate_confirmation_password(self, value):
		confirmation_password = value
		password = self.initial_data.get('password')

		if password != confirmation_password:
			raise PasswordValidationError(detail=message)
		return value
	
	# def check_username
	
class PasswordValidationError(serializers.ValidationError):
	def __init__(self, detail=None):
		if detail is None:
			detail = "Mot de passe invalide."
		super().__init__(detail)