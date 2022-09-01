from django.conf import settings


def get_file_name(rel_path):
    return rel_path.split('/')[-1]


def get_file_link(uuid):
    return f'{settings.PROTOCOL}://{settings.DOMAIN}/files/{uuid}'