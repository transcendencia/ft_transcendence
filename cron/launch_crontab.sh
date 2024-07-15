#!/bin/bash
for variables in $(cat /etc/get_env)
do
    export $variables
done 
/usr/local/bin/python /backend/manage.py delete_inactive_users >> /backend/logs/cron.log 2>&1
