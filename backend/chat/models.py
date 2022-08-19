from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User


class ChatRoom(models.Model):
    date_created = models.DateTimeField(default=timezone.now)
    name = models.CharField(max_length=255)


class Message(models.Model):
    date_added = models.DateTimeField(default=timezone.now)
    message = models.CharField(max_length=255)
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

    def to_json(self):
        return {
            "id": self.id,
            "author_id": self.user.id,
            "author": self.user.username,
            "author_profile_image": self.user.profile.image_url,
            "timestamp": self.date_added.strftime("%Y/%m/%d, %H:%M:%S"),
            "body": self.message
        }

    def __str__(self) -> str:
        return f'{self.date_added.strftime("%Y/%m/%d, %H:%M:%S")} {self.user}: {self.message}'