from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
# Create your views here.


def show_404(request):
    return JsonResponse({
        "status": "failure",
        "reason": "No such endpoint."
    }, status=404)
