from django.contrib import admin
from .models import Member

class MemberAdmin(admin.ModelAdmin):
    list_display = ("username", "position",)

admin.site.register(Member, MemberAdmin)