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
	
	def validate_username(self, value):
		print(value)
		print(len(value))
		if len(value) > 13:
			raise serializers.ValidationError("Username must contains 12 characters maximum.")
		return value

	# def validate_password(self, value):
	# 	try:
	# 		validate_password(value)
	# 	except ValidationError as e:
	# 		raise PasswordValidationError(detail=e.error_list[0])
	# 	return value
	
	def validate_confirmation_password(self, value):
		confirmation_password = value
		password = self.initial_data.get('password')

		if password != confirmation_password:
			raise PasswordValidationError(detail="Password not identical")
		return value

class PasswordValidationError(serializers.ValidationError):
	def __init__(self, detail=None):
		if detail is None:
			detail = "Mot de passe invalide."
		super().__init__(detail)