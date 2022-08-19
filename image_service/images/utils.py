from django.conf import settings


def get_image_name(rel_path):
    return rel_path.split('/')[-1]


def get_image_link(uuid):
    return f'{settings.PROTOCOL}://{settings.DOMAIN}/images/{uuid}'