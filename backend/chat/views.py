from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated

from .serializers import ChatRoomSerializer
from .paginations import ChatCursorPagination

class ChatRoomViewSet(ModelViewSet):
    serializer_class = ChatRoomSerializer
    permission_classes = (IsAuthenticated, )
    pagination_class = ChatCursorPagination 

    def get_queryset(self):
        return self.request.user.chats.prefetch_related("participants")
