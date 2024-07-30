from rest_framework import serializers
from .models import User, Game
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
import logging
import re

class UserSerializer(serializers.ModelSerializer):
	class Meta():
		model = User
		fields = ['id', 'username', 'language', 'last_login_date', 'status', 'profile_picture', 'alias', 'is_host']

error_codes = {
    "length_exceeded_username": "Username must contain 13 characters maximum.",
    "unique": "A user with that username already exists.",
	"length_exceeded_alias": "Alias must contain 13 characters maximum.",
	"unique_alias": "A user with that alias already exists.",
}

class SignupSerializer(serializers.ModelSerializer):
	confirmation_password = serializers.CharField(write_only=True)
	class Meta():
		model = User
		fields = ['username', 'password', 'confirmation_password']
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		for field_name, field in self.fields.items():
			field_value = self.initial_data.get(field_name, None)
			if field_value is None or len(field_value) == 0:
				field.error_messages['blank'] = "All fields must be completed."
	
	def validate_username(self, value):
		value = value.lower()

		if len(value) > 13:
			raise serializers.ValidationError(code="length_exceeded_username")
		if value == 'bot':
			raise serializers.ValidationError(code="unique")
		if User.objects.filter(username=value).exists():
			raise serializers.ValidationError(code="unique")
		# logger.debug("je return la value du username")
		return value

	# add eror code
	def validate_password(self, value):
		print("coucou")
		# if ' ' in value:
		# 	raise serializers.ValidationError("Password cannot contain spaces.", code="invalidSpacePassword")
		if re.search(r'\s', value):
			raise serializers.ValidationError(code="invalidWhitespacePassword")

		# try:
		# 	validate_password(value)
		# except ValidationError as e:
		# 	raise PasswordValidationError(detail=e.error_list[0])
		return value

	def validate_confirmation_password(self, value):
		confirmation_password = value
		password = self.initial_data.get('password')

		if password != confirmation_password:
			raise serializers.ValidationError(code="invalidConfirmationPassword")
		return value


import logging
logger = logging.getLogger(__name__)

class UpdateInfoSerializer(serializers.ModelSerializer):
	confirmation_password = serializers.CharField(write_only=True, required=False)
	class Meta():
		model = User
		fields = ['username', 'password', 'alias', 'confirmation_password']
		extra_kwargs = {
			'password': {'write_only': True, 'required': False},
			'username': {'required': False},
			'alias': {'required': False},
		}

	def	validate_username(self, value):
		logger.debug(f"Entering validate_confirmation_password with value: {value}")
		
		if value:
			value = value.lower()
			if len(value) > 13:
				raise serializers.ValidationError(code="length_exceeded_username")
			current_user = self.instance
			if current_user and current_user.username == value:
				return value 
			if User.objects.filter(username=value).exists():
				raise serializers.ValidationError(code="unique")
		return value


	def validate_alias(self, value):
		logger.debug(f"Entering validate_confirmation_password with value: {value}")
		if value:
			value = value.lower()
			allowed_chars_pattern = re.compile(r'^[\w.@+-]+$')
			if not allowed_chars_pattern.match(value):
				raise serializers.ValidationError(code="invalidCharAlias")
			if len(value) > 13:
				raise serializers.ValidationError(code="length_exceeded_alias")
			current_user = self.instance
			if current_user and current_user.alias == value:
				return value 
			if User.objects.filter(alias=value).exists():
				raise serializers.ValidationError(code="unique_alias")
		return value

	def validate_password(self, value):
		confirmation_password = self.initial_data.get('confirmation_password')
		
		if value and not confirmation_password:
			raise serializers.ValidationError(code="passwordError")

		try:
			validate_password(value)
		except ValidationError as e:
			raise PasswordValidationError(detail=e.error_list[0])
		return value

	def validate_confirmation_password(self, value):
		confirmation_password = value
		password = self.initial_data.get('password')

		if confirmation_password and not password:
			raise serializers.ValidationError(code="passwordError")
		elif password != confirmation_password:
			raise serializers.ValidationError(code="invalidConfirmationPassword")
		return value

	def update(self, instance, validated_data):
		for attr, value in validated_data.items():
			if attr == 'password' and value:
				instance.set_password(value)
			elif value:
				setattr(instance, attr, value)
		instance.save()
		return instance
	

class PasswordValidationError(serializers.ValidationError):
	def __init__(self, detail=None):
		if detail is None:
			detail = "Mot de passe invalide."
		super().__init__(detail)

class UserListSerializer(serializers.ModelSerializer):
	class Meta():
		model = User
		fields = ['id', 'username', 'language', 'last_login_date', 'status', 'profile_picture', 'alias', 'is_host']


class GameListSerializer(serializers.ModelSerializer):
	player1_username = serializers.CharField(source='player1.username', read_only=True)
	player1_profilePicture = serializers.CharField(source='player1.profile_picture.url', read_only=True)
	player2_username = serializers.CharField(source='player2.username', read_only=True)
	player2_profilePicture = serializers.CharField(source='player2.profile_picture.url', read_only=True)
	player3_username = serializers.CharField(source='player3.username', read_only=True, allow_null=True)
	Date = serializers.DateTimeField(format="%Y-%m-%d %H:%M", source='date', read_only=True)

	class Meta:
		model = Game
		fields = ['id', 'player1', 'player1_username', 'player1_profilePicture', 'player2', 'player2_username', 'player2_profilePicture', 'player3', 'player3_username', 'scorePlayer1', 'scorePlayer2', 'gameplayMode', 'modeGame', 'Date']
