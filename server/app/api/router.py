# Filename: router.py
# Description: Sets up routes for the API.

from fastapi import APIRouter, Depends
from db.repository import query_data
from .dependencies import get_db

router = APIRouter()

@router.get("/api", tags=["root"])
async def read_root():
    return { "message": "Hello, World!" }

@router.get("/api/data", tags=["data"])
async def read_data(limit: int | None = None, db=Depends(get_db)):
    if limit is not None: 
        return { "message": query_data(db, limit) }

    return { "message": query_data(db) }