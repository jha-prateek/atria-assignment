FROM python:3.8.6-alpine3.12 as pyt

ENV PYTHONUNBUFFERED 1
ENV LANG C.UTF-8
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app
ADD ./requirements.txt .

RUN pip install -r requirements.txt
ADD . .
RUN python manage.py makemigrations api
RUN python manage.py migrate

EXPOSE 8001

RUN python manage.py create_data temperature 500
RUN python manage.py create_data lumen 500
RUN python manage.py create_data humidity 500

CMD gunicorn backend.wsgi:application --bind 0.0.0.0:8001
