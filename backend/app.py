from fastapi import FastAPI

from db import test_connection

app = FastAPI()


@app.get("/")
def home():
    return {
        "message": "Tangerined backend is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }
    
@app.get("/snowflake")
def snowflake_health():
    version = test_connection()

    return {
        "connected": True,
        "version": version,
    }