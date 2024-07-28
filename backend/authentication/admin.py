from django.contrib import admin
from .models import User, Game, FriendRequest

class MemberAdmin(admin.ModelAdmin):
    list_display = ("username", "position",)

admin.site.register(User)
admin.site.register(FriendRequest)
admin.site.register(Game)