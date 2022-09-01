from django.contrib.auth import authenticate, login, logout
from django.shortcuts import get_object_or_404
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie

from rest_framework.decorators import api_view
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, parsers

from .models import Profile

from .serializers import LoginSerializer, RegisterSerializer


def authenticated_user(user):
    return Response(
        {
            "id": user.id,
            "username" : user.username,
        }, status=status.HTTP_200_OK
    )


@api_view(["GET"])
def get_csrf(request):
    response = Response({'detail': 'CSRF cookie set'}, status=status.HTTP_200_OK)
    response['X-CSRFToken'] = get_token(request)
    return response


class LoginView(APIView):
    serializer = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            username=serializer.validated_data['username'], 
            password=serializer.validated_data['password']
        )

        if user is None:
            return Response({'non_field_errors': ['Invalid credentials.']}, status=status.HTTP_400_BAD_REQUEST)

        login(request, user)

        return authenticated_user(user)


class RegisterView(CreateAPIView):
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        login(request, user)
        
        return authenticated_user(user)    
    

@api_view(["GET"])
def logout_view(request):
    if not request.user.is_authenticated:
        return Response({'detail': 'You\'re not logged in.'}, status=status.HTTP_401_UNAUTHORIZED)

    logout(request)
    return Response({'detail': 'Successfully logged out.'}, status=status.HTTP_200_OK)


@ensure_csrf_cookie
@api_view(["GET"])
def get_user_if_authenticated(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'detail': 'You\'re not logged in.'}, status=status.HTTP_401_UNAUTHORIZED)
    
    return authenticated_user(user)


@api_view(["GET"])
def get_user_image(request, user_id):
    profile = get_object_or_404(Profile, user_id=user_id)
    return Response({'image_url': profile.image_url})