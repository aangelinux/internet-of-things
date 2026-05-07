# Filename: router.py
# Description: Sets up routes for the API.

from fastapi import APIRouter

router = APIRouter()

@router.get("/", tags=["root"])
async def read_root():
  return { "message": "Hello, World!" }