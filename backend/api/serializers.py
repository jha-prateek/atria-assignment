from rest_framework import serializers
from .models import *


class SensorSerializer(serializers.ModelSerializer):

    class Meta:
        model = SensorReading
        fields = '__all__'
