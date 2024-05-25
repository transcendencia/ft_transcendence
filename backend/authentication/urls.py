from django.urls import path
from .views import authentication, tournament

urlpatterns = [
	path('', authentication.index, name='index'),

    path('login_page/', authentication.login_page, name='login_page'),
    path('signup/', authentication.signup, name='signup'),
    path('change_language/', authentication.change_language, name='change_language'),
    path('update_status/', authentication.update_status, name='update_status'),
    path('get_status/', authentication.get_status, name='get_status'),
    path('render_profile/', authentication.render_profile, name='render_profile'),
    path('render_profile/user_profile/', authentication.user_profile, name='user_profile'),
    path('render_change_picture/', authentication.render_change_picture, name='render_change_picture'),
    path('render_change_picture/change_profile_picture/', authentication.change_profile_picture, name='change_profile_picutre'),
    
    path('tournament/', tournament.result, name='result'),
    path('add_player/', tournament.add_member, name='add_member'),
]