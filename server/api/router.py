# Filename: router.py
# Description: Sets up routes for the API.

from fastapi import APIRouter

router = APIRouter()

@router.get("/", tags = ["root"])
async def read_root():
    return { "message": "Hello, World!" }

@router.post("/data/", tags = ["data"])
async def post_data():
    return { "message": "Inserting data ..." }