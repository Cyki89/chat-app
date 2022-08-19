from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.index),
    path('admin/', admin.site.urls),
    path('chat/', include('chat.urls')),
    path('auth/', include('users.urls')),
]
