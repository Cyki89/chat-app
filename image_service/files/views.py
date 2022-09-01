from django.shortcuts import get_object_or_404
from django.http.response import FileResponse

from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, RetrieveDestroyAPIView
from rest_framework import parsers

from .models import File, FileCollection
from .serializers import UploadFileSerializer


class UploadFileView(CreateAPIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    serializer_class = UploadFileSerializer


def file_view(request, uuid):
    file_obj = get_object_or_404(File, uuid=uuid)
    return FileResponse(open(file_obj.file.path, 'rb'), as_attachment=True)


class FileAPIView(RetrieveDestroyAPIView):
    queryset = File.objects.all()
    lookup_field = 'uuid'

    def get(self, request, *args, **kwargs):
        file_obj = get_object_or_404(File, uuid=kwargs['uuid'])
        return FileResponse(open(file_obj.file.path, 'rb'), as_attachment=True)


class UserFilesAPIViewView(RetrieveDestroyAPIView):
    queryset = FileCollection.objects.all()
    lookup_field = 'user_id'
    def get(self, request, user_id):
        return Response(self.get_object().to_json())