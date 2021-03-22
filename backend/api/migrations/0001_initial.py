# Generated by Django 3.1.7 on 2021-03-19 15:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='SensorReading',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('reading', models.DecimalField(decimal_places=2, max_digits=5)),
                ('timestamp', models.BigIntegerField()),
                ('sensor_type', models.CharField(choices=[('temperature', 'temperature'), ('humidity', 'humidity'), ('lumen', 'lumen')], max_length=15)),
            ],
        ),
    ]
