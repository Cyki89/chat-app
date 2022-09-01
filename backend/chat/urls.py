from django.urls import path
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r'api', views.ChatRoomViewSet, basename='chats')
urlpatterns = [
    path('api/attachments/', views.AttachmentsCreateView.as_view(), name='create-attachments'),
    path('api/attachments/<int:pk>/', views.AttachmentsDeleteView.as_view(), name='delete-attachment'),
    *router.urls,
]