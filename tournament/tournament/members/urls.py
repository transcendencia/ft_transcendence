from django.urls import path
from . import views

urlpatterns = [
    path('', views.main, name='main'),
    path('add_player/', views.add_member, name='add_member'),
    path('new_tournament/', views.result, name='new_tournament'),
    path('new_tournament/details/<int:id>', views.details, name='details'),
    path('testing/', views.testing, name='testing'),
]
