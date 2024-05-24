from django.contrib import admin
from .models import Member
from .models import User, Game

class MemberAdmin(admin.ModelAdmin):
    list_display = ("username", "position",)

admin.site.register(Member, MemberAdmin)
admin.site.register(User)
admin.site.register(Game)