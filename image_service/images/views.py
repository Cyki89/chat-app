from django.shortcuts import get_object_or_404
from django.http.response import FileResponse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework import parsers

from .models import Image, ImageCollection
from .serializers import UploadImageSerializer
from .custom_renderers import ImageRenderer


class UploadImageView(CreateAPIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    serializer_class = UploadImageSerializer


class UserImagesView(APIView):
    def get(self, request, user_id):
        collection = ImageCollection.objects.get(user_id=user_id)
        return Response(collection.to_json())


def image_view(request, uuid):
    image_obj = get_object_or_404(Image, uuid=uuid)
    return FileResponse(open(image_obj.image.path, 'rb'), as_attachment=False)


class ImageAPIView(RetrieveAPIView):
    renderer_classes = [ImageRenderer]

    def get(self, request, *args, **kwargs):
        image = Image.objects.get(uuid=self.kwargs['uuid']).image
        return Response(image, content_type='image/jpg')