from rest_framework.pagination import CursorPagination


class ChatCursorPagination(CursorPagination):
    page_size = 10
    ordering = '-date_created'

