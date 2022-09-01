from uuid import uuid1
from django.db import models
from utils.files import get_file_link


class FileCollection(models.Model):
    uuid = models.UUIDField(default=uuid1)
    user_id = models.IntegerField(unique=True)

    def files(self):
        return self.files.all()

    def to_json(self):
        return {
            'uuid': self.uuid,
            'user_id': self.user_id,
            'files': {
                f'{file.file.name}' : get_file_link(file.uuid) 
                for file in self.files()
            },
        }


def get_upload_path(instance, filename):
    return f'{instance.collection.uuid}/{filename}'


class File(models.Model):
    uuid = models.UUIDField(default=uuid1)
    file = models.FileField(upload_to=get_upload_path)
    collection = models.ForeignKey(FileCollection, related_name='files', on_delete=models.CASCADE)

    def to_json(self):
        return {
            'uuid': self.uuid,
            'file_name': self.file.name,
            'file_url': get_file_link(self.uuid) 
        }