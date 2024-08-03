from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# import authentication.views
from django.views.static import serve
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path('', include('authentication.urls')),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
else:
    urlpatterns += [
        path('media/<path:path>', login_required(serve), {'document_root': settings.MEDIA_ROOT}),
    ]