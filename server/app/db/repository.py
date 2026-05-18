# Filename: repository.py
# Description: Provides functions for querying and writing data to the DB.

import json
from influxdb_client_3 import Point
from datetime import datetime, timezone

def write_data(db, data):
    """Receives data from an MQTT client and writes it to a database."""
    data_json = json.loads(data)

    point = Point("climate") \
        .field("temperature", float(data_json["temperature"])) \
        .field("humidity", float(data_json["humidity"])) \
        .time(str(data_json["time"]))

    db.write(point)

def query_data(db):
    """Queries and sorts data from an InfluxDB database."""
    query = db.query("SELECT * FROM climate ORDER BY TIME")

    data = query.to_pylist()
    data.sort(key=lambda row: row["time"])

    return data