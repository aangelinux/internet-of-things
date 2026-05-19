# Filename: repository.py
# Description: Provides functions for querying and writing data to the DB.

from influxdb_client_3 import Point
from .dataValidator import parse_json, validate

def write_data(db, data):
    """Receives data from an MQTT client and writes it to a database."""
    json_data = parse_json(data)
    if json_data is None:
        return

    climate_data = validate(json_data)
    if climate_data is None:
        return

    point = Point("climate") \
        .field("temperature", climate_data.temperature) \
        .field("humidity", climate_data.humidity) \
        .time(climate_data.time)

    db.write(point)

def query_data(db, limit = 100):
    """Queries and sorts data from an InfluxDB database."""
    query = db.query(f"SELECT * FROM climate ORDER BY time DESC LIMIT {limit}")

    data = query.to_pylist()
    data.sort(key=lambda row: row["time"])

    return data