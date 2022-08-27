from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ChatRoom, Message
from .utils import timestamp_representation


class ChatUserSerializer(serializers.ModelSerializer):
    avatar = serializers.URLField(source='profile.image_url')

    class Meta:
        model = User
        fields = ['id', 'username', 'avatar']
        read_only_fields = ['username','avatar']


class ChatLastMessageSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = Message
        fields = ['id', 'message', 'user']
        read_only_fields = ['message', 'user']    


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'uuid', 'timestamp', 'last_message', 'name', 'participants', 'is_group_chat']
        read_only_fields = ['uuid', 'timestamp', 'last_message']
    
    last_message = serializers.SlugRelatedField(
        read_only=True,
        slug_field='message'
     )
     
    def validate_name(self, name):
        is_group_chat = self.initial_data.get('is_group_chat')
        if is_group_chat and not name:
            raise serializers.ValidationError(
                _('Group conversation have to have name')
            )

        if not is_group_chat and name:
            raise serializers.ValidationError(
                _('Private conversation can\'t have name')
            )

        return name

    def validate_participants(self, participants):
        is_group_chat = self.initial_data.get('is_group_chat')
        if is_group_chat and len(participants) < 2:
            raise serializers.ValidationError(
                _('Group conversation have to have at least 2 members')
            )

        if not is_group_chat and len(participants) != 2:
            raise serializers.ValidationError(
                _('Private conversation have to have exacly 2 members')
            )
        
        return participants

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['timestamp'] = timestamp_representation(instance.timestamp)
        rep["participants"] = ChatUserSerializer(instance.participants.all(), many=True).data
        rep["last_message"] = ChatLastMessageSerializer(instance.last_message).data
        return rep