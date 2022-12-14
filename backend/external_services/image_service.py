import requests
from rest_framework import status

BASE_URL = "http://images:8001"


def create_images(user_id, image):
    res_data = None
    response = requests.post(f"{BASE_URL}/images/", data={"user_id": user_id}, files={"image": image})
    if response.status_code == status.HTTP_201_CREATED:
        res_data = response.json()
    return res_data


def get_user_images(user_id):
    res_data = None
    response = requests.get(f"{BASE_URL}/images/collection/{user_id}")
    if response.status_code == status.HTTP_200_OK:
        res_data = response.json()
    return res_data


def delete_user_images(user_id):
    response = requests.delete(f"{BASE_URL}/images/collection/{user_id}")
    if response.status_code == status.HTTP_204_NO_CONTENT:
        return True
    return False
