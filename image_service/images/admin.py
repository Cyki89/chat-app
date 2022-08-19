from django.contrib import admin
from .models import Image, ImageCollection


admin.site.register(
    (Image, ImageCollection)
)