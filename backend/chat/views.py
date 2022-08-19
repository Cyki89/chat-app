from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required
def select_room(request):
    return render(request, 'rooms.html')


@login_required
def room(request, room_name):
    return render(request, 'room.html', {'room_name': room_name})
