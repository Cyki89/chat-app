import os
import shutil

from django.conf import settings
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from .models import File, FileCollection


@receiver(post_save, sender=FileCollection)
def create_collection_filedir(sender, instance, created, **kwargs):
    if created:
        os.mkdir(settings.MEDIA_ROOT / str(instance.uuid))


@receiver(post_delete, sender=FileCollection)
def delete_collection_filedir(sender, instance, **kwargs):
    shutil.rmtree(settings.MEDIA_ROOT / str(instance.uuid))


@receiver(post_delete, sender=File)
def delete_image_file(sender, instance, **kwargs):
    os.remove(instance.file.path)