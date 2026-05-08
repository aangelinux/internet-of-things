# Filename: dependencies.py
# Description: Provides getters for app state-dependencies.

from fastapi import Request

def get_db(request: Request):
    return request.app.state.db_client

def get_mqtt(request: Request):
    return request.app.state.mqtt_client