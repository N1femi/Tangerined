import os

import snowflake.connector
from dotenv import load_dotenv


load_dotenv()


def get_connection():
    connection = snowflake.connector.connect(
        account=os.getenv("SNOWFLAKE_ACCOUNT"),
        user=os.getenv("SNOWFLAKE_USER"),
        password=os.getenv("SNOWFLAKE_PAT"),
        role=os.getenv("SNOWFLAKE_ROLE"),
        warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
        database=os.getenv("SNOWFLAKE_DATABASE"),
        schema=os.getenv("SNOWFLAKE_SCHEMA"),
    )

    return connection


def test_connection():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT CURRENT_VERSION()")
        result = cursor.fetchone()

        return result[0]
    finally:
        cursor.close()
        connection.close()
        
        
def add_task(
    task_id,
    title,
    description,
    slice_id,
    task_date,
    task_time,
):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO TASKS (
                ID,
                TITLE,
                DESCRIPTION,
                SLICE_ID,
                TASK_DATE,
                TASK_TIME
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (
                task_id,
                title,
                description,
                slice_id,
                task_date,
                task_time,
            ),
        )
    finally:
        cursor.close()
        connection.close()
        
def get_tasks():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute(
            """
            SELECT
                ID,
                TITLE,
                DESCRIPTION,
                SLICE_ID,
                TASK_DATE,
                TASK_TIME,
                COMPLETED
            FROM TASKS
            ORDER BY TASK_DATE
            """
        )

        rows = cursor.fetchall()

        tasks = []

        for row in rows:
            task = {
                "id": row[0],
                "title": row[1],
                "description": row[2],
                "sliceId": row[3],
                "date": str(row[4]),
                "time": row[5],
                "completed": row[6],
            }

            tasks.append(task)

        return tasks

    finally:
        cursor.close()
        connection.close()