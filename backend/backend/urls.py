from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# import authentication.views

urlpatterns = [
    path('admin/', admin.site.urls),

    # path('tournament/', authenticationView.main, name='main'),
    # path('add_player/', authentication.views.add_member, name='add_member'),
    # path('new_tournament/', authentication.views.result, name='new_tournament'),
    # path('new_tournament/details/<int:id>', authentication.views.details, name='details'),
    # path('testing/', authentication.views.testing, name='testing'),
    path('', include('authentication.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
