from rest_framework.viewsets import ModelViewSet
from rest_framework.generics import CreateAPIView, DestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import parsers, status

from .models import Message, Attachment
from .serializers import ChatRoomSerializer, AttachmentsSerialzer, AttachmentSimpleSerialzer
from .paginations import ChatCursorPagination


class ChatRoomViewSet(ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = (IsAuthenticated, )
    pagination_class = ChatCursorPagination 

    def get_queryset(self):
        return self.request.user.chats.select_related("last_message__user").prefetch_related("participants__profile")


class AttachmentsCreateView(CreateAPIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    serializer_class = AttachmentsSerialzer


class AttachmentsDeleteView(DestroyAPIView):
    def get_queryset(self):
        return Attachment.objects.filter(id=self.kwargs['pk'])

    def delete(self, request, *args, **kwargs):
        if Message.objects.filter(attachments__id=kwargs['pk']).exists():
            return Response(
                {'non_field_errors': 'Attachement is used by another messages'}, 
                status=status.HTTP_405_METHOD_NOT_ALLOWED
            )

        return super().delete(request, *args, **kwargs)