from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

from .utils import timestamp_representation


class ChatRoom(models.Model):
    uuid = models.UUIDField(default=uuid4)
    timestamp = models.DateTimeField(auto_now=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    
    participants = models.ManyToManyField(User, related_name='chats')
    
    last_message = models.ForeignKey(
        to='Message', 
        null=True, 
        blank=True,
        related_name='+',
        on_delete=models.CASCADE
    )
    is_group_chat = models.BooleanField(default=False)

    class Meta:
        ordering = ("-timestamp", )


class Attachment(models.Model):
    file_url = models.URLField(null=True, blank=True)
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attachments')
    
    class Meta:
        unique_together = [['name', 'user']]

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name,
            "file_url": self.file_url
        }


class Message(models.Model):
    date_added = models.DateTimeField(default=timezone.now)
    message = models.TextField()
    user = models.ForeignKey(
        to=User, 
        related_name='messages',
        on_delete=models.PROTECT,
    )
    room = models.ForeignKey(
        to=ChatRoom, 
        related_name='messages',
        on_delete=models.CASCADE, 
    )
    attachments = models.ManyToManyField(Attachment, related_name='messages')

    class Meta:
        ordering = ("-id",)

    def to_json(self):
        return {
            "id": self.id,
            "author_id": self.user.id,
            "author": self.user.username,
            "attachments": [attachment.to_json() for attachment in self.attachments.all()],
            "author_profile_image": self.user.profile.image_url,
            "timestamp": timestamp_representation(self.date_added),
            "body": self.message
        }

    def __str__(self) -> str:
        return f'{self.date_added.strftime("%Y/%m/%d, %H:%M:%S")} {self.user}: {self.message}'
