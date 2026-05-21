# Filename: DBClient.py
# Description: Connection to an InfluxDB database.

import os
from influxdb_client_3 import (
    InfluxDBClient3, 
    write_client_options, 
    SYNCHRONOUS, 
    Point
)

class DBClient:
    def __init__(self):
        self.client = None
        self.options = write_client_options(write_options=SYNCHRONOUS)

    def connect(self):
        print("Connected to DB")

        self.client = InfluxDBClient3(
            host = os.getenv("HOST"),
            database = os.getenv("DATABASE"),
            token = os.getenv("ADMIN_TOKEN"),
            write_client_options = self.options
        )

    def write_data(self, climate_data):
        """Receives data from an MQTT client and writes it to a database."""
        point = Point("climate") \
            .field("temperature", climate_data.temperature) \
            .field("humidity", climate_data.humidity) \
            .time(climate_data.time)

        self.client.write(point)

    def query_data(self, limit = 100):
        """Queries and sorts data from an InfluxDB database."""
        query = self.client.query(
            f"SELECT * FROM climate ORDER BY time DESC LIMIT {limit}"
        )

        data = query.to_pylist()
        data.sort(key=lambda row: row["time"])

        return data

    def disconnect(self):
        self.client.close()