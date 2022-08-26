from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import ChatRoom


class ChatUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']
        read_only_fields = ['username']


class ChatRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatRoom
        fields = ['id', 'uuid', 'date_created', 'name', 'participants', 'is_group_chat']
        read_only_fields = ['uuid', 'date_created']

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
        rep["participants"] = ChatUserSerializer(instance.participants.all(), many=True).data
        return rep