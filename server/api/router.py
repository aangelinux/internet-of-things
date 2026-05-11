# Filename: router.py
# Description: Sets up routes for the API.

from fastapi import APIRouter, Depends
from db.repository import query_data
from .dependencies import get_db

router = APIRouter()

@router.get("/", tags=["root"])
async def read_root():
    return { "message": "Hello, World!" }

@router.get("/data/", tags=["data"])
async def read_data(db=Depends(get_db)):
    return { "message": query_data(db) }