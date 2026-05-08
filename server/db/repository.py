# Filename: repository.py
# Description: Provides functions for querying and writing data to the DB.

import json
from influxdb_client_3 import Point
from datetime import datetime, timezone

def write_data(db, data):
    """Receives data from an MQTT client and writes it to a database."""
    data_json = json.loads(data)

    point = Point("climate") \
        .field("temperature", str(data_json["temperature"])) \
        .field("humidity", str(data_json["humidity"])) \
        .time(datetime.now(timezone.utc))

    db.write(point)

def query_data(db):
    """Queries data from a database for a specified timespan."""
    query = db.query(
        "SELECT humidity, temperature, time FROM climate")

    # Invoke data-parsing functions here later

    print(query)