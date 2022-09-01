import json
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from rest_framework import serializers

from external_services import file_service
from .models import Attachment, ChatRoom, Message
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

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['timestamp'] = timestamp_representation(instance.timestamp)
        rep["participants"] = ChatUserSerializer(instance.participants.all(), many=True).data
        rep["last_message"] = ChatLastMessageSerializer(instance.last_message).data
        return rep


class AttachmentsSerialzer(serializers.Serializer):
    # files = serializers.ListField(child=serializers.FileField())
    files = serializers.FileField()

    def create(self, validated_data):
        user = self.context["request"].user
        files = validated_data.pop('files')

        uploaded_files_ids = []
        # for file in files:
        if files:
            file = files
            attachement, created = Attachment.objects.get_or_create(user=user, name=file.name)
            if created:
                uploaded_file = file_service.upload_file(user.id, file)
                attachement.file_url = uploaded_file['file_url']
                attachement.save()
            uploaded_files_ids.append(attachement.id)
        return attachement

    def to_representation(self, instance):
        return instance.to_json()


class AttachmentSimpleSerialzer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ('id', 'user', 'file_url', 'messages')