#!/bin/bash
source get_env.sh
/usr/local/bin/python /backend/manage.py delete_inactive_users >> /backend/logs/cron.log 2>&1
