from django.contrib import admin
from django.urls import path, include

import debug_toolbar

from . import views

urlpatterns = [
    path('', views.index),
    path('admin/', admin.site.urls),
    path('chat/', include('chat.urls')),
    path('auth/', include('users.urls')),
    path("__debug__/", include(debug_toolbar.urls)),
]
