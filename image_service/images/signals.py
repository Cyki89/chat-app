import os
import shutil

from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import ImageCollection, Image

@receiver(post_save, sender=ImageCollection)
def create_collection_filedir(sender, instance, created, **kwargs):
    if created:
        os.mkdir(settings.MEDIA_ROOT / str(instance.uuid))


@receiver(post_delete, sender=ImageCollection)
def delete_collection_filedir(sender, instance, **kwargs):
    shutil.rmtree(settings.MEDIA_ROOT / str(instance.uuid))


@receiver(post_delete, sender=Image)
def delete_image_file(sender, instance, **kwargs):
    os.remove(instance.image.path)