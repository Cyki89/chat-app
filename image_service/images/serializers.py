import sys
from io import BytesIO
from PIL import Image as PILImage

from django.core.files.uploadedfile import InMemoryUploadedFile
from rest_framework import serializers

from .models import Image, ImageCollection


class UploadImageSerializer(serializers.Serializer):
    image = serializers.ImageField()
    user_id = serializers.IntegerField()
    # thumbnails_sizes = serializers.ListField(child=serializers.IntegerField())

    def create(self, validated_data):
        print(validated_data)
        user_id = validated_data['user_id']
        # thumbnails_sizes = validated_data['thumbnails_sizes']
        thumbnails_sizes = [50, 100, 200]
        in_memo_image = validated_data['image']
        
        collection = self._create_new_collection(user_id)
        self._save_orginal_image(in_memo_image, collection)
        self._create_thumbnails(in_memo_image, collection, thumbnails_sizes)

        return collection

    def _create_new_collection(self, user_id):
        collection = ImageCollection(user_id=user_id)
        collection.save()
        
        return collection

    def _save_orginal_image(self, in_memo_image, collection):
        return Image.objects.create(
            image=in_memo_image, 
            collection=collection, 
            is_orginal=True)

    def _create_thumbnails(self, in_memo_image, collection, thumbnails_sizes):
        django_type, pill_type = self._get_image_types_or_type_error(in_memo_image)
        image_name, image_ext = in_memo_image.name.split('.')
        
        thumbnail_objs = []
        for size in thumbnails_sizes:
            in_memo_thubmnail = self._create_thumbnail(
                size, 
                in_memo_image, 
                pill_type, 
                django_type, 
                image_name, 
                image_ext
            )
            
            thumbnail_objs.append(Image.objects.create(
                image=in_memo_thubmnail, 
                reduced_height=size,
                collection=collection,
            ))

        return thumbnail_objs

    def _get_image_types_or_type_error(self, image):
        django_type = image.content_type
        if django_type == 'image/jpeg':
            pil_type = 'jpeg'
        elif django_type == 'image/png':
            pil_type = 'png'
        else:
            raise TypeError('Invalid file type!')

        return django_type, pil_type

    def _create_thumbnail(self, size, in_memo_image, pill_type, 
                          django_type, image_name, image_ext):
        output = BytesIO()
        
        pill_image = PILImage.open(in_memo_image)
        pill_image.thumbnail((pill_image.width, size))
        pill_image.save(output, format=pill_type)
        
        thumbnail_name = f'{image_name}_{size}.{image_ext}'
        in_memo_thubmnail = InMemoryUploadedFile(
            file=output,
            field_name='ImageField',
            name=thumbnail_name,
            content_type=django_type,
            size=sys.getsizeof(output), 
            charset=None
        )
        
        return in_memo_thubmnail

    def to_representation(self, instance):
        return instance.to_json()