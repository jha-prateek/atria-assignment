from django.urls import path
from django.conf.urls import url
from . import views


urlpatterns = [
    path('get_all', views.get_reading, name='get_reading'),
    path('add', views.add_reading, name='add_reading'),
    path('stats', views.get_stats, name='get_stats'),
    path('range', views.filter_dates, name='filter_dates')
]