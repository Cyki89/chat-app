from django.urls import path
from . import consumers

ws_urlpatterns = [
    path('<str:uuid>/', consumers.ChatRoomConsumer.as_asgi()),
]