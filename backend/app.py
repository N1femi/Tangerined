import uuid

from pydantic import BaseModel
from fastapi import FastAPI

from db import add_task, get_tasks, test_connection
from ai import understand_task, understand_tasks


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


@app.post("/understand/tasks")
def understand_many(thought: ThoughtRequest):
    return {
        "tasks": understand_tasks(thought.text)
    }


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


@app.post("/tasks/from-text")
def create_task_from_text(thought: ThoughtRequest):
    parsed_task = understand_task(thought.text)

    task_id = str(uuid.uuid4())

    task_time = parsed_task["time"]

    if task_time == "":
        task_time = None

    add_task(
        task_id,
        parsed_task["title"],
        parsed_task["description"],
        parsed_task["sliceId"],
        parsed_task["date"],
        task_time,
    )

    return {
        "id": task_id,
        "title": parsed_task["title"],
        "description": parsed_task["description"],
        "sliceId": parsed_task["sliceId"],
        "date": parsed_task["date"],
        "time": task_time,
        "completed": False,
    }