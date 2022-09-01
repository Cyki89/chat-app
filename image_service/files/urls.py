from django.urls import path
from .views import UploadFileView, file_view, FileAPIView, UserFilesAPIViewView


urlpatterns = [
    path("", UploadFileView.as_view()),
    path("collection/<int:user_id>", UserFilesAPIViewView.as_view()),
    path("<str:uuid>", FileAPIView.as_view())
]