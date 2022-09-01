from django.shortcuts import get_object_or_404
from django.http.response import FileResponse

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView, RetrieveAPIView, RetrieveDestroyAPIView
from rest_framework import parsers

from .models import Image, ImageCollection
from .serializers import UploadImageSerializer
from .custom_renderers import ImageRenderer


class UploadImageView(CreateAPIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    serializer_class = UploadImageSerializer


class UserImagesView(RetrieveDestroyAPIView):
    queryset = ImageCollection.objects.all()
    lookup_field = 'user_id'
    def get(self, request, user_id):
        return Response(self.get_object().to_json())


def image_view(request, uuid):
    image_obj = get_object_or_404(Image, uuid=uuid)
    return FileResponse(open(image_obj.image.path, 'rb'), as_attachment=False)


class ImageAPIView(RetrieveDestroyAPIView):
    renderer_classes = [ImageRenderer]
    queryset = Image.objects.all()
    lookup_field = 'uuid'

    def get(self, request, *args, **kwargs):
        return Response(self.get_object().image, content_type='image/jpg')