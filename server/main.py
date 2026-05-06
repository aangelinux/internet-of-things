# Filename: main.py
# Description: Configures a FastAPI backend, serving a REST API.

from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
  return { "Hello, World!" }