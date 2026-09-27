import json
from datetime import date

from db import get_connection


def understand_task(text):
    connection = get_connection()
    cursor = connection.cursor()

    today = date.today().isoformat()

    prompt = f"""
You are the task parser for an app called Tangerined.

Turn the user's statement into one task.

The only valid sliceId values are:
school
projects
personal

Rules:
- title should be short and clear
- choose the most appropriate sliceId
- date must use YYYY-MM-DD
- time should look like 7:00 PM
- if there is no description, use an empty string
- if there is no time, use an empty string

Today is {today}.

User said:
{text}
"""

    try:
        cursor.execute(
            """
            SELECT AI_COMPLETE(
                model => 'claude-haiku-4-5',
                prompt => %s,
                response_format => TYPE OBJECT(
                    title STRING,
                    description STRING,
                    sliceId STRING,
                    date STRING,
                    time STRING
                )
            )
            """,
            (prompt,),
        )

        result = cursor.fetchone()[0]

        if isinstance(result, str):
            result = json.loads(result)

        return result

    finally:
        cursor.close()
        connection.close()


def understand_tasks(text):
    connection = get_connection()
    cursor = connection.cursor()

    today = date.today().isoformat()

    prompt = f"""
You are the task parser for an app called Tangerined.

Turn the user's statement into every distinct task or reminder they mention.

The only valid sliceId values are:
school
projects
personal

Rules:
- return one task for each distinct thing the user wants to do or remember
- keep tasks in the order the user first mentioned them
- if the user corrects a task later, update that task instead of creating another task
- do not duplicate a task just because the user restated it
- title should be short and clear
- choose the most appropriate sliceId
- date must use YYYY-MM-DD
- time should look like 7:00 PM
- if there is no description, use an empty string
- if there is no date yet, use an empty string
- if there is no time, use an empty string

Today is {today}.

User said:
{text}
"""

    try:
        cursor.execute(
            """
            SELECT AI_COMPLETE(
                model => 'claude-sonnet-5',
                prompt => %s,
                response_format => TYPE OBJECT(
                    tasks ARRAY(
                        OBJECT(
                            title STRING,
                            description STRING,
                            sliceId STRING,
                            date STRING,
                            time STRING
                        )
                    )
                ),
                return_error_details => TRUE
            )
            """,
            (prompt,),
        )

        row = cursor.fetchone()

        if row is None:
            return []

        result = row[0]

        if isinstance(result, str):
            result = json.loads(result)

        if result is None:
            return []

        if result.get("error") is not None:
            print("CORTEX ERROR:", result["error"])
            return []

        value = result.get("value")

        if value is None:
            return []

        tasks = value.get("tasks")

        if tasks is None:
            return []

        return tasks

    finally:
        cursor.close()
        connection.close()