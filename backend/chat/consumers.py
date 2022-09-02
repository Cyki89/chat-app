import json
from datetime import datetime
from asgiref.sync import async_to_sync

from django.core.exceptions import PermissionDenied
from channels.generic.websocket import WebsocketConsumer

from .models import ChatRoom, Message


MESSAGES_TO_FETCH = 10


class ChatRoomConsumer(WebsocketConsumer):
    def connect(self):
        self.room_uuid = self.scope['url_route']['kwargs']['uuid']
        self.room_group_name = 'chat_%s' % self.room_uuid
        self.chat_room = ChatRoom.objects.get(uuid=self.room_uuid)
        self.user = self.scope['user']
        
        if not self.chat_room.participants.filter(id=self.user.id).exists():
            raise PermissionDenied()
        
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    def receive(self, text_data=None, bytes_data=None):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']
        payload = text_data_json['payload']
        
        if message_type == 'chat_message':    
            self.on_recive_chat_message(payload)

        elif message_type == 'fetch_messages':
            self.on_recive_fetch_messages(payload)

    def on_recive_chat_message(self, payload):  
        message = Message.objects.create(
            message=payload['message'],
            user_id=payload['user_id'],
            room=self.chat_room
        )
        
        files = payload['files']
        if files:
            message.attachments.add(*[file['id'] for file in files])
        
        ChatRoom.objects.filter(uuid=self.room_uuid)\
                        .update(last_message=message, timestamp=datetime.now())

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {'type': 'chat_message', 'message': message.to_json()}
        )

    def on_recive_fetch_messages(self, payload):  
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {'type': 'fetch_messages', 'offset': payload['offset']}
        )

    def chat_message(self, event):
        self.send(text_data=json.dumps({
            'type': 'group_message',
            'message': event['message']
        }))

    def fetch_messages(self, event):
        offset = event['offset']
        messages = (
            Message.objects.filter(room=self.chat_room)
                           .prefetch_related('attachments')
                           .select_related('user__profile')
                            [offset: offset + MESSAGES_TO_FETCH]
        )
        self.send(text_data=json.dumps({
            'type': 'fetch_messages',
            'messages': [message.to_json() for message in messages][::-1],
            'has_next': bool(len(messages) == MESSAGES_TO_FETCH)
        }))