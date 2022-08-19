from django.urls import path
from .views import UploadImageView, UserImagesView, image_view, ImageAPIView


urlpatterns = [
    path("", UploadImageView.as_view()),
    path("collection/<int:user_id>", UserImagesView.as_view()),
    path("<str:uuid>", ImageAPIView.as_view())
]