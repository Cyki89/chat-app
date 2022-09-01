import requests
from rest_framework import status

DOCKER_URL = "http://images:8001"
LOCAL_URL = "http://localhost:8001"


def upload_file(user_id, file):
    res_data = None
    response = requests.post(f"{DOCKER_URL}/files/", data={"user_id": user_id}, files={"file": file})
    if response.status_code == status.HTTP_201_CREATED:
        res_data = response.json()
    return res_data


def delete_file(file_url):
    response = requests.delete(file_url.replace(LOCAL_URL, DOCKER_URL))
    if response.status_code == status.HTTP_204_NO_CONTENT:
        return True
    return False


def delete_user_files(user_id):
    response = requests.delete(f"{DOCKER_URL}/files/collection/{user_id}")
    if response.status_code == status.HTTP_204_NO_CONTENT:
        return True
    return False
