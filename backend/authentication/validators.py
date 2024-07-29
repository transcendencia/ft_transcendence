from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _
from django_password_validators.password_character_requirements.password_validation import PasswordCharacterValidator
from django.core.exceptions import ValidationError
from django.core.files.images import get_image_dimensions
from django.conf import settings
from PIL import Image
import re
from django.core.validators import BaseValidator


class CustomPasswordCharacterValidator:
    def __init__(self, min_length_digit=1, min_length_alpha=1, min_length_special=1,
                 min_length_lower=1, min_length_upper=1, special_characters=".~!@#$%^&*()_+{}\":;'[]"):
        self.validator = PasswordCharacterValidator(
            min_length_digit=min_length_digit,
            min_length_alpha=min_length_alpha,
            min_length_special=min_length_special,
            min_length_lower=min_length_lower,
            min_length_upper=min_length_upper,
            special_characters=special_characters,
        )
        self.common_error_message = _("The password must contain at least: • one uppercase letter, •one lowercase letter, •one number and one special character from the following: ~!@#$%^&*()_+{}\":;'[].")
        self.error_code = "password_invalid"

    def validate(self, password, user=None):
        try:
            self.validator.validate(password, user)
        except ValidationError:
            raise ValidationError(self.common_error_message, code=self.error_code)

class ProfilePictureValidator:
    def __init__(self, profile_picture):
        self.profile_picture = profile_picture
    
    def validate(self):
        self.checkFileSize()
        # self.checkImgSize()
        self.checkImgIntegrity()

    def checkImgType(self):
        ext = os.path.splitext(uploaded_file.name)[1].lower()
        if ext not in settings.PROFILE_PIC_ALLOWED_EXTENSIONS:
            raise ValidationError("invalidImgType", code="invalidImgType")

    def checkFileSize(self):
        if self.profile_picture.size > settings.PROFILE_PIC_MAX_UPLOAD_SIZE:
            raise ValidationError("profilePicTooLarge", code="profilePicTooLarge")

    # def checkImgSize(self):
    #     width, height = get_image_dimensions(self.profile_picture)
    #     if width > settings.PROFILE_PIC_MAX_WIDTH or height > settings.PROFILE_PIC_MAX_HEIGHT:
    #         raise ValidationError("imageDimensionsTooLarge")

    def checkImgIntegrity(self):
        try:
            img = Image.open(self.profile_picture)
            img.verify()
        except:
            raise ValidationError("invalidImage", code="invalidImage")

class UsernameValidator(BaseValidator):
    def __init__(self, *args, **kwargs):
        # You can handle additional arguments or configurations here if needed
        pass

    def __call__(self, value):
        self.validate(value)
        
    def validate(self, value):
        self.username = value
        self.checkCharacter()
        self.checkLen()

    def checkCharacter(self):
        allowed_chars_pattern = re.compile(r'^[\w.@+-]+$')
        if not allowed_chars_pattern.match(self.username):
            raise ValidationError('Username can only contain letters, numbers, and @/./+/-/_ characters.', code="invalid_characters")
    
    def checkLen(self):
        if len(self.username) > 13:
            raise ValidationError("Username must contain 13 characters maximum.", code="length_exceeded_username")