from django.contrib import admin
from .models import Member
from .models import User

class MemberAdmin(admin.ModelAdmin):
    list_display = ("username", "position",)

admin.site.register(Member, MemberAdmin)
admin.site.register(User)