from django.urls import path

from . import views

urlpatterns = [
    path('csrf/', views.get_csrf, name='auth-csrf'),
    path('login/', views.LoginView.as_view(), name='auth-login'),
    path('register/', views.RegisterView.as_view(), name='auth-register'),
    path('logout/', views.logout_view, name='auth-logout'),
    path('authentication/', views.get_user_if_authenticated, name='auth-session'),
    path('user_image/<int:user_id>', views.get_user_image, name='user-img')
]