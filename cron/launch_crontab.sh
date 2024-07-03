#!/bin/bash
/usr/local/bin/python /backend/manage.py delete_inactive_users >> /backend/logs/cron.log 2>&1
