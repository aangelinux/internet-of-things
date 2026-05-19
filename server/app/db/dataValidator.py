# Filename: dataValidator.py
# Description: Validates that data is of the correct type.

import json
from pydantic import BaseModel, ValidationError
from datetime import datetime

class ClimateData(BaseModel):
    time: datetime
    temperature: float
    humidity: float


def parse_json(data) -> dict | None:
    try:
        return json.loads(data)
    except json.JSONDecodeError as e:
        print("JSON parsing failed: ", e)

    return None

def validate(data) -> ClimateData | None:
    try:
        return ClimateData(**data)
    except ValidationError as e:
        print("Data validation failed: ", e)

    return None