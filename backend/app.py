import uuid

from pydantic import BaseModel
from fastapi import FastAPI
from db import add_task, get_tasks, test_connection
from ai import understand_task

class TaskRequest(BaseModel):
    title: str
    description: str | None = None
    sliceId: str
    date: str
    time: str | None = None
    
class ThoughtRequest(BaseModel):
    text: str
    

app = FastAPI()


@app.post("/understand")
def understand(thought: ThoughtRequest):
    return understand_task(thought.text)

@app.get("/")
def home():
    return {
        "message": "Tangerined backend is running"
    }

@app.get("/tasks")
def read_tasks():
    return get_tasks()

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
    
@app.post("/tasks")
def create_task(task: TaskRequest):
    task_id = str(uuid.uuid4())

    add_task(
        task_id,
        task.title,
        task.description,
        task.sliceId,
        task.date,
        task.time,
    )

    return {
        "id": task_id,
        "title": task.title,
        "description": task.description,
        "sliceId": task.sliceId,
        "date": task.date,
        "time": task.time,
        "completed": False,
    }