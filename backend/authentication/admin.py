from django.contrib import admin
from .models import Member
from .models import User, Friendlist, FriendRequest

class MemberAdmin(admin.ModelAdmin):
    list_display = ("username", "position",)

class FriendlistAdmin(admin.ModelAdmin):
    list_filter = ['user']
    list_display = ['user']
    search_fields = ['user']
    readonly_fields = ['user']

    class Meta:
        model = Friendlist

class FriendRequestAdmin(admin.ModelAdmin):
    list_filter = ['sender', 'receiver']
    list_display = ['sender', 'receiver']
    search_fields = ['sender__username', 'receiver__username']

    class Meta:
        model = FriendRequest

admin.site.register(FriendRequest, FriendRequestAdmin)
admin.site.register(Friendlist, FriendlistAdmin)
admin.site.register(Member, MemberAdmin)
admin.site.register(User)