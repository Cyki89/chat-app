from rest_framework import serializers

from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password

from external_services import image_service
from .models import Profile


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=255)
    password = serializers.CharField(max_length=255, write_only=True)


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        max_length=255, 
        write_only=True, 
        validators=[validate_password]
    )
    confirm_password = serializers.CharField(
        max_length=255, 
        write_only=True
    )
    image = serializers.ImageField()

    class Meta:
        model = User
        fields = ['username', 'password', 'confirm_password', 'image']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "password": _('Passwords must match.'), 
                "confirm_password": _('Passwords must match.')
            })

        return attrs

    def save(self, **kwargs):
        username = self.validated_data['username']
        password = self.validated_data['password']
        image = self.validated_data['image']
        
        user = User.objects.create(username=username)
        user.set_password(password)
        user.save()

        response = image_service.create_images(user.id, image)
        Profile.objects.create(user=user, image_url=response['thumbnails']['50px'])

        return user