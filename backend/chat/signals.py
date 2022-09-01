from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import Attachment
from external_services import file_service


@receiver(post_delete, sender=Attachment)
def delete_user_images(sender, instance, **kwargs):
    is_deleted = file_service.delete_file(instance.file_url)
    if not is_deleted:
        print('Unsuccessfull file deleted')