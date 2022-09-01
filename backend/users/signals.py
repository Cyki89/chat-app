from django.db.models.signals import post_delete
from django.contrib.auth.models import User
from django.dispatch import receiver

from external_services import image_service, file_service


@receiver(post_delete, sender=User)
def delete_user_files(sender, instance, **kwargs):
    if not image_service.delete_user_images(instance.id):
        print('Unsuccessfull images deleted')

    if not file_service.delete_user_files(instance.id):
        print('Unsuccessfull files deleted')

    