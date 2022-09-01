from django.contrib import admin

from .models import ChatRoom, Message, Attachment

admin.site.register((
    ChatRoom, 
    Message,
    Attachment
))
