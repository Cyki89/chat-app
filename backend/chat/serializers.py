import json
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from rest_framework import serializers

from external_services import file_service
from .models import Attachment, ChatRoom, Message
from .utils import timestamp_representation


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


class MessageSerializer(serializers.ModelSerializer):
    json = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ('json', )

    def get_json(self, instance):
        return instance.to_json()



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
        fields = ['message', 'user']
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

    def create(self, validated_data):
        if not validated_data['is_group_chat'] and (
            chat_room := ChatRoom.objects
                                .filter(is_group_chat=False)
                                .filter(participants=validated_data['participants'][0])
                                .filter(participants=validated_data['participants'][1])
                                .first()
        ):
            return chat_room
            
        return super().create(validated_data)

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['timestamp'] = timestamp_representation(instance.timestamp)
        rep["participants"] = ChatUserSerializer(instance.participants.all(), many=True).data
        rep["last_message"] = ChatLastMessageSerializer(instance.last_message).data
        return rep


class AttachmentsSerialzer(serializers.Serializer):
    file = serializers.FileField()

    def create(self, validated_data):
        user = self.context["request"].user
        file = validated_data.pop('file')

        attachement, created = Attachment.objects.get_or_create(user=user, name=file.name)
        if created:
            uploaded_file = file_service.upload_file(user.id, file)
            attachement.file_url = uploaded_file['file_url']
            attachement.save()
        
        return attachement

    def to_representation(self, instance):
        return instance.to_json()


class AttachmentSimpleSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ('id', 'user', 'file_url', 'messages')