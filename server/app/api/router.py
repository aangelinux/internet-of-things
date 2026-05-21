# Filename: router.py
# Description: Sets up routes for the API.

from fastapi import APIRouter, Depends
from db.repository import query_data
from .dependencies import get_db, get_mqtt

router = APIRouter()

@router.get("/api", tags=["root"])
async def read_root():
    return { "message": "Hello, World!" }

@router.get("/api/data/historical", tags=["data"])
async def read_historical_data(limit: int | None = None, db=Depends(get_db)):
    if limit is not None: 
        return { "message": query_data(db, limit) }

    return { "message": query_data(db) }