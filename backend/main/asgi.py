import os

from django.urls import path
from django.core.asgi import get_asgi_application

# from channels.sessions import SessionMiddlewareStack
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from chat.routing import ws_urlpatterns as chat_ws_urlpatterns

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'main.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path('ws/chat/' , URLRouter(chat_ws_urlpatterns)),
           
        ])
    )
})
