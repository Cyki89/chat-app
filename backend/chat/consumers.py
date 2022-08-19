import json
from asgiref.sync import async_to_sync

from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
from django.contrib.auth.models import User
from channels.auth import login
from .models import ChatRoom, Message


class ChatRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.chat_room = ChatRoom.objects.get_or_create(name=self.room_group_name)[0]
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        self.fetch_messages()

    def fetch_messages(self):
        messages = Message.objects.filter(room=self.chat_room)
        self.send(text_data=json.dumps({
            'type': 'fetch_messages',
            'messages': [message.to_json() for message in messages]
        }))

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)

        message = Message.objects.create(
            message=text_data_json['message'],
            user_id=text_data_json['user_id'],
            room=self.chat_room
        )

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {'type': 'chat_message', 'message': message.to_json()}
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'group_message',
            'message': event['message']
        }))

# class ChatRoomConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         print(self.scope['url'])
#         self.room_name = self.scope['url_route']['kwargs']['room_name']
#         self.room_group_name = 'chat_%s' % self.room_name
        
#         await self.channel_layer.group_add(
#             self.room_group_name,
#             self.channel_name
#         )

#         await self.accept()

#     async def disconnect(self, close_code):
#         message = f'User {self.channel_name} go out from chat'
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {'type': 'chat_message','message': message}
#         )

#         await self.channel_layer.group_discard(
#             self.room_group_name,
#             self.channel_name
#         )

#     async def receive(self, text_data=None, bytes_data=None):
#         text_data_json = json.loads(text_data)
#         message = text_data_json['message']

#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {'type': 'chat_message','message': message}
#         )

#     async def chat_message(self, event):
#         message = event['message']
#         await self.send(text_data=json.dumps({
#             'type': 'group_message',
#             'message': message
#         }))

