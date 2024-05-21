from django.urls import path
from .views import authenticationView

urlpatterns = [
	path('', authenticationView.index, name='index'),

    path('login_page/', authenticationView.login_page, name='login_page'),
    path('signup/', authenticationView.signup, name='signup'),
]