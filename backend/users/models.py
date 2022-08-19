from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    image_url = models.URLField()
    user = models.OneToOneField(User, on_delete=models.CASCADE)
