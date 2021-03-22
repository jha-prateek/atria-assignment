from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.db import transaction
from api.models import SensorReading
from datetime import datetime
import random
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(module)s [%(levelname)s] %(message)s')


class Command(BaseCommand):
    help = "Generate fake data for testing"

    def add_arguments(self, parser):
        parser.add_argument('sensor_type', type=str, help='Indicates the type of sensor to be created')
        parser.add_argument('total', type=int, help='Indicates the number of records to be created')

    @transaction.atomic
    def handle(self, *args, **kwargs):
        sensor_type = kwargs['sensor_type']
        total = kwargs['total']
        now = datetime.now()

        for index in range(total):
            timestamp = (datetime.timestamp(now)*1000) - ((5 * 60 * 1000) * index)
            SensorReading(reading=random.randint(210, 360)/10, timestamp=timestamp, sensor_type=sensor_type).save()

        logging.info(f'Created {total} for {sensor_type}.')