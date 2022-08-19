from uuid import uuid1
from django.db import models
from . import utils


class ImageCollection(models.Model):
    uuid = models.UUIDField(default=uuid1)
    user_id = models.IntegerField(unique=True)

    def orginal(self):
        return self.images.filter(is_orginal=True).first()
    
    def thumbnails(self):
        return self.images.filter(is_orginal=False)

    def thumbnail(self, height):
        return self.images.filter(reduced_height=height).first()

    def to_json(self):
        return {
            'uuid': self.uuid,
            'user_id': self.user_id,
            'orginal': utils.get_image_link(self.orginal().uuid),
            'thumbnails': {
                f'{thumbnail.reduced_height}px' : utils.get_image_link(thumbnail.uuid) 
                for thumbnail in self.thumbnails()
            },
        }


def get_upload_path(instance, filename):
    return f'{instance.collection.uuid}/{filename}'


class Image(models.Model):
    uuid = models.UUIDField(default=uuid1)
    image = models.ImageField(upload_to=get_upload_path)
    is_orginal = models.BooleanField(default=False)
    reduced_height = models.IntegerField(null=True, blank=True)
    collection = models.ForeignKey(ImageCollection, related_name='images', on_delete=models.CASCADE)
