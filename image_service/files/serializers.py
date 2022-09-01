from rest_framework import serializers

from .models import File, FileCollection


class UploadFileSerializer(serializers.Serializer):
    file = serializers.FileField()
    user_id = serializers.IntegerField()

    def create(self, validated_data):
        file_collection, _ = FileCollection.objects.get_or_create(user_id=validated_data['user_id'])
        return File.objects.create(file=validated_data['file'], collection=file_collection)

    def to_representation(self, instance):
        return instance.to_json()