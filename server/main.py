# Filename: main.py
# Description: Configures a FastAPI server for writing & querying data.

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.router import router
from services.mqtt import create_mqtt_client, connect
from db.connect import create_db_client

origins = ["*"]

@asynccontextmanager
async def lifespan(app: FastAPI):
    db_client = create_db_client()
    mqtt_client = create_mqtt_client()
    mqtt_client.user_data_set({
        "db_client": db_client
    })
    
    app.state.db_client = db_client
    app.state.mqtt_client = mqtt_client
    connect(app.state.mqtt_client)

    yield

    app.state.mqtt_client.loop_stop()
    app.state.mqtt_client.disconnect()
    app.state.db_client.close()
    print("Server disconnected")


app = FastAPI(lifespan=lifespan)

app.include_router(router)
app.add_middleware(
    CORSMiddleware,
    allow_origins = origins
)