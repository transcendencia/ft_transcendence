from django.urls import path
from .views import authenticationView, views

urlpatterns = [
	path('', authenticationView.index, name='index'),

    path('login_page/', authenticationView.login_page, name='login_page'),
    path('signup/', authenticationView.signup, name='signup'),
    path('tournament/', views.main, name='main'),
    path('add_player/', views.add_member, name='add_member'),
    path('new_tournament/', views.result, name='new_tournament'),
    path('new_tournament/details/<int:id>', views.details, name='details'),
    path('testing/', views.testing, name='testing'),
    # path('uptdate_info/', authenticationView.update_info, name='update_info'),
]