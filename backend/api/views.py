from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from .serializers import *
from django.db.models import Max, Min, Avg
# Create your views here.


@api_view(['GET'])
def get_reading(request):
    try:
        sensor_data = SensorReading.objects.all()
        serialized_sensor_data = SensorSerializer(sensor_data, many=True).data
        return JsonResponse(serialized_sensor_data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({
            "status": "failure",
            "reason": str(e)
        }, status=400)


@api_view(['POST'])
def add_reading(request):
    try:
        sensor_data = SensorSerializer(data=request.data)
        if sensor_data.is_valid(raise_exception=True):
            sensor_data.save()
            return JsonResponse(sensor_data.data, status=201)
    except Exception as e:
        return JsonResponse({
            "status": "failure",
            "reason": str(e)
        }, status=400)


@api_view(['GET'])
def filter_dates(request):
    sensor_type = request.GET.get('sensor')
    from_timestamp = request.GET.get('from')
    to_timestamp = request.GET.get('to')
    try:
        sensor_data = SensorReading.objects.filter(timestamp__gt=from_timestamp,
                                                   timestamp__lt=to_timestamp,
                                                   sensor_type__exact=sensor_type)
        serialized_sensor_data = SensorSerializer(sensor_data, many=True).data
        return JsonResponse(serialized_sensor_data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({
            "status": "failure",
            "reason": str(e)
        }, status=400)


@api_view(['GET'])
def get_stats(request):
    sensor_type = str(request.GET.get('sensor'))
    from_timestamp = int(request.GET.get('from'))
    to_timestamp = int(request.GET.get('to'))
    try:
        sensor_data = SensorReading.objects.filter(timestamp__gt=from_timestamp,
                                                   timestamp__lt=to_timestamp,
                                                   sensor_type__exact=sensor_type)\
            .aggregate(Avg('reading'), Max('reading'), Min('reading'))
        return JsonResponse(sensor_data, safe=False, status=200)
    except Exception as e:
        return JsonResponse({
            "status": "failure",
            "reason": str(e)
        }, status=400)


def show_404(request):
    return JsonResponse({
        "status": "failure",
        "reason": "No such endpoint."
    }, status=404)
