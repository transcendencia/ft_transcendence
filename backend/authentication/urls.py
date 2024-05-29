from django.urls import path
from .views import authentication, tournament, updateUserInfo

urlpatterns = [
	path('', authentication.index, name='index'),

    #authenitcation.py
    path('login_page/', authentication.login_page, name='login_page'),
    path('signup/', authentication.signup, name='signup'),
    
    #updateUserInfo.py
    path('change_language/', updateUserInfo.change_language, name='change_language'),
    path('update_status/', updateUserInfo.update_status, name='update_status'),
    path('get_status/', updateUserInfo.get_status, name='get_status'),
    path('render_profile/', updateUserInfo.render_profile, name='render_profile'),
    path('render_profile/user_profile/', updateUserInfo.user_profile, name='user_profile'),
    path('render_change_picture/', updateUserInfo.render_change_picture, name='render_change_picture'),
    path('render_change_picture/change_profile_picture/', updateUserInfo.change_profile_picture, name='change_profile_picutre'),
    path('render_change_profile_info/', updateUserInfo.render_change_profile_info, name="render_change_profile_info"),
    path('render_change_profile_info/change_profile_info/', updateUserInfo.change_profile_info, name="change_profile_info"),
    path('render_display_profile_info/', updateUserInfo.render_display_profile_info, name="render_display_profile_info"),
    path('get_profile_info/', updateUserInfo.get_profile_info, name="get_profile_info"),
    path('user_list/', updateUserInfo.user_list, name="user_list"),
    path('get_user_list/', updateUserInfo.get_user_list, name="get_user_list"),
    
    #friendship.py

    #tounament.py
    path('tournament/', tournament.result, name='result'),
    path('add_player/', tournament.add_member, name='add_member'),
]