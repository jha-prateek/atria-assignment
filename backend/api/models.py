from django.db import models


# Create your models here.


class SensorReading(models.Model):
    reading = models.DecimalField(decimal_places=1, max_digits=4, null=False)
    timestamp = models.BigIntegerField(null=False)

    SensorEnum = (
        ('temperature', 'temperature'),
        ('humidity', 'humidity'),
        ('lumen', 'lumen'),
    )

    sensor_type = models.CharField(max_length=15, choices=SensorEnum, null=False)
