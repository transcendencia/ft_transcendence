#!/bin/bash 

python /backend/ft_transcendence/manage.py migrate
python /backend/ft_transcendence/manage.py runserver 0.0.0.0:8000