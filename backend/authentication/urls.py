from django.urls import path
from .views import authentication, tournament

urlpatterns = [
	path('', authentication.index, name='index'),

    path('login_page/', authentication.login_page, name='login_page'),
    path('signup/', authentication.signup, name='signup'),
    path('tournament/', tournament.result, name='result'),
    path('add_player/', tournament.add_member, name='add_member'),
    # path('uptdate_info/', authenticationView.update_info, name='update_info'),
]