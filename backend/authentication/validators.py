from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django_password_validators.password_character_requirements.password_validation import PasswordCharacterValidator

class CustomPasswordCharacterValidator:
    def __init__(self, min_length_digit=1, min_length_alpha=1, min_length_special=1,
                 min_length_lower=1, min_length_upper=1, special_characters="~!@#$%^&*()_+{}\":;'[]"):
        self.validator = PasswordCharacterValidator(
            min_length_digit=min_length_digit,
            min_length_alpha=min_length_alpha,
            min_length_special=min_length_special,
            min_length_lower=min_length_lower,
            min_length_upper=min_length_upper,
            special_characters=special_characters,
        )
        self.common_error_message = _("The password must contain at least: • one uppercase letter, •one lowercase letter, •one number and one special character from the following: ~!@#$%^&*()_+{}\":;'[].")

    def validate(self, password, user=None):
        try:
            self.validator.validate(password, user)
        except ValidationError:
            raise ValidationError(self.common_error_message)

