from uuid import uuid4

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class ChatRoom(models.Model):
    uuid = models.UUIDField(default=uuid4)
    date_created = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=255, blank=True, null=True)
    # TODO Add Unique constraint for manyToMany
    participants = models.ManyToManyField(User, related_name='chats')
    is_group_chat = models.BooleanField(default=False)


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

    class Meta:
        ordering = ("-id",)

    def to_json(self):
        return {
            "id": self.id,
            "author_id": self.user.id,
            "author": self.user.username,
            "author_profile_image": self.user.profile.image_url,
            "timestamp": self.date_added.strftime("%Y/%m/%d %H:%M:%S"),
            "body": self.message
        }

    def __str__(self) -> str:
        return f'{self.date_added.strftime("%Y/%m/%d, %H:%M:%S")} {self.user}: {self.message}'


class Attachment(models.Model):
    file = models.FileField()
    massage = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments')
