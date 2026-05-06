# Filename: db.py
# Description: Establishes a connection with an InfluxDB database.

import os
from dotenv import load_dotenv
from influxdb_client_3 import InfluxDBClient3, write_client_options, SYNCHRONOUS

load_dotenv()

HOST = os.getenv("HOST")
DATABASE = os.getenv("DATABASE")
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN")

options = write_client_options(write_options = SYNCHRONOUS)

def create_client():
  return InfluxDBClient3(
    host = HOST,
    database = DATABASE,
    token = ADMIN_TOKEN,
    write_client_options = options
  )