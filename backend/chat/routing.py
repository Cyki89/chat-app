from django.urls import re_path
from . import consumers

ws_urlpatterns = [
    re_path(r'(?P<room_name>\w+)/$', consumers.ChatRoomConsumer.as_asgi()),
]